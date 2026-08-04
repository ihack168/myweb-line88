import { NextResponse } from "next/server";
import { Converter } from "opencc-js";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const PRIMARY_MODEL =
  process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

const MAX_ATTEMPTS = 5;
const SOURCE_TEXT_MAX_LENGTH = 1800;
const MAX_COMPLETION_TOKENS = 4200;

// 簡體中文轉台灣繁體中文
const toTaiwanTraditional = Converter({ from: "cn", to: "twp" });

type GeneratedArticle = {
  title: string;
  html: string;
};

type GroqResult = {
  ok: boolean;
  status: number;
  data: any;
  usedKeyIndex: number | null;
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function limitText(text: string, maxLength = SOURCE_TEXT_MAX_LENGTH) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function escapeHtmlAttr(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toBase64Utf8(value: string) {
  return Buffer.from(value || "", "utf8").toString("base64");
}

function getGroqApiKeys() {
  return String(
    process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || ""
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * 偵測真正可能是亂碼的內容。
 *
 * 不把正常的句尾半形問號直接判定為亂碼，
 * 只攔截替代字元、方框、HTML numeric entity，
 * 以及中文字中間被半形問號截斷的情況。
 */
function hasBadText(value: string) {
  if (!value) return false;

  if (value.includes("\uFFFD") || value.includes("�")) return true;
  if (/□+/.test(value)) return true;
  if (/\?{3,}/.test(value)) return true;

  // 例如：成為了一?非常重要
  if (/[\u3400-\u9FFF]\?[\u3400-\u9FFF]/u.test(value)) return true;

  // 未解碼的 HTML numeric entity
  if (/&#x?[0-9a-fA-F]{2,7};/i.test(value)) return true;
  if (/&amp;#x?[0-9a-fA-F]{2,7};/i.test(value)) return true;

  return false;
}

/**
 * 將 numeric entity 還原成正常字元。
 * 保留一般的 &amp;、&lt; 等合法 HTML entity。
 */
function decodeStrayEntities(value: string) {
  if (!value) return value;

  return value
    .replace(/&amp;(#x?[0-9a-fA-F]{2,7};)/gi, "&$1")
    .replace(/&#x([0-9a-fA-F]{2,7});/gi, (_, hex: string) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint)
        ? String.fromCodePoint(codePoint)
        : "";
    })
    .replace(/&#(\d{2,7});/g, (_, decimal: string) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isFinite(codePoint)
        ? String.fromCodePoint(codePoint)
        : "";
    });
}

function stripMarkdownCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json|html|javascript|typescript)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function removeAllLinks(html: string) {
  return html.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

function removeDangerousTags(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
}

function cleanTitle(value: string) {
  return stripMarkdownCodeFence(value)
    .replace(/<\/?h1\b[^>]*>/gi, "")
    .replace(/^\s*#{1,6}\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureImageAtBeginning(
  html: string,
  imageUrl: string,
  keyword: string
) {
  const cleanedImageUrl = String(imageUrl || "").trim();

  // 沒有圖片網址時，把模型自行產生的空 src 圖片移除
  if (!cleanedImageUrl) {
    return html.replace(/<img\b[^>]*src\s*=\s*["']\s*["'][^>]*\/?>/gi, "");
  }

  const safeImageUrl = escapeHtmlAttr(cleanedImageUrl);
  const safeAlt = escapeHtmlAttr(`文章標題 ${keyword}`);
  const requiredImage = `<img src="${safeImageUrl}" alt="${safeAlt}" />`;

  // 先移除所有模型自行產生的圖片，避免使用到錯誤網址或重複圖片
  const withoutImages = html.replace(/<img\b[^>]*\/?>/gi, "").trim();

  return `${requiredImage}\n${withoutImages}`;
}

function ensureArticleWrapper(html: string) {
  let cleaned = html.trim();

  // 移除模型偶爾輸出的 h1，避免頁面重複主標題
  cleaned = cleaned.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "$1");

  if (
    /^<div\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>/i.test(
      cleaned
    ) &&
    /<\/div>\s*$/i.test(cleaned)
  ) {
    return cleaned;
  }

  // 避免重複包裝
  cleaned = cleaned
    .replace(
      /^<div\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>/i,
      ""
    )
    .replace(/<\/div>\s*$/i, "")
    .trim();

  return `<div class="article-content">\n${cleaned}\n</div>`;
}

function plainTextToHtml(text: string) {
  const cleaned = stripMarkdownCodeFence(text)
    .replace(/\r\n/g, "\n")
    .trim();

  const blocks = cleaned
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = block.match(/^#{1,6}\s+(.+)$/s);

      if (heading) {
        return `<h2>${escapeHtmlText(heading[1].trim())}</h2>`;
      }

      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const isList =
        lines.length > 1 &&
        lines.every((line) => /^[-*•]\s+/.test(line));

      if (isList) {
        const items = lines
          .map((line) =>
            line.replace(/^[-*•]\s+/, "").trim()
          )
          .map((line) => `<li>${escapeHtmlText(line)}</li>`)
          .join("\n");

        return `<ul>\n${items}\n</ul>`;
      }

      return `<p>${escapeHtmlText(lines.join(" "))}</p>`;
    });

  return blocks.join("\n");
}

function looksLikeHtml(value: string) {
  return /<(?:div|img|p|h2|h3|ul|ol|li|strong|br|hr)\b/i.test(value);
}

/**
 * 解析模型回傳內容，按以下順序嘗試：
 * 1. JSON：{"title":"...","html":"..."}
 * 2. 舊格式：[TITLE] / [HTML] / [END]
 * 3. 模型直接輸出「第一行標題＋HTML」
 * 4. 純文字或 Markdown 備援
 */
function extractTitleAndHtml(
  text: string,
  fallbackKeyword: string
): GeneratedArticle | null {
  if (!text?.trim()) return null;

  const cleaned = stripMarkdownCodeFence(text);

  // 1. JSON 主格式
  try {
    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed?.title === "string" &&
      typeof parsed?.html === "string"
    ) {
      const title = cleanTitle(parsed.title);
      const html = parsed.html.trim();

      if (title && html) {
        return { title, html };
      }
    }
  } catch {
    // 繼續使用備援解析
  }

  // 2. 舊版分隔符格式
  const titleMatch = cleaned.match(
    /\[TITLE\]\s*([\s\S]*?)(?=\[HTML\]|\[END\]|$)/i
  );
  const htmlMatch = cleaned.match(
    /\[HTML\]\s*([\s\S]*?)(?=\[END\]|$)/i
  );

  if (titleMatch?.[1]?.trim() && htmlMatch?.[1]?.trim()) {
    return {
      title: cleanTitle(titleMatch[1]),
      html: htmlMatch[1].trim(),
    };
  }

  // 3. 第一行標題，後面已經是 HTML
  const firstLineBreak = cleaned.indexOf("\n");

  if (firstLineBreak > 0) {
    const possibleTitle = cleanTitle(cleaned.slice(0, firstLineBreak));
    const possibleBody = cleaned.slice(firstLineBreak + 1).trim();

    if (
      possibleTitle &&
      possibleTitle.length <= 120 &&
      looksLikeHtml(possibleBody)
    ) {
      return {
        title: possibleTitle,
        html: possibleBody,
      };
    }
  }

  // 4. 整段已是 HTML
  if (looksLikeHtml(cleaned)) {
    const firstHeading = cleaned.match(
      /<(?:h1|h2|h3)\b[^>]*>([\s\S]*?)<\/(?:h1|h2|h3)>/i
    );

    const title = cleanTitle(
      firstHeading?.[1]?.replace(/<[^>]+>/g, "") || fallbackKeyword
    );

    return {
      title: title || fallbackKeyword,
      html: cleaned,
    };
  }

  // 5. 純文字／Markdown 備援
  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    const title = cleanTitle(lines[0]) || fallbackKeyword;
    const body = lines.slice(1).join("\n");

    return {
      title,
      html: plainTextToHtml(body),
    };
  }

  return null;
}

function extractMessageContent(message: any) {
  const content = message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  // 相容部分 API 將 content 回傳成陣列的情況
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item?.text === "string") return item.text;
        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

async function readGroqResponse(res: Response) {
  const rawText = await res.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return {
      error: "Groq 回傳不是有效 JSON",
      rawResponse: rawText.slice(0, 2000),
    };
  }
}

async function callGroqWithRotation(
  body: Record<string, unknown>
): Promise<GroqResult> {
  const keys = getGroqApiKeys();

  if (!keys.length) {
    return {
      ok: false,
      status: 500,
      data: {
        error: "缺少 GROQ_API_KEYS 或 GROQ_API_KEY",
      },
      usedKeyIndex: null,
    };
  }

  const startIndex = Math.floor(Math.random() * keys.length);

  let lastError: unknown = null;
  let lastStatus = 500;
  let lastUsedKeyIndex: number | null = null;

  for (let index = 0; index < keys.length; index++) {
    const keyIndex = (startIndex + index) % keys.length;
    const apiKey = keys[keyIndex];

    lastUsedKeyIndex = keyIndex + 1;

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const data = await readGroqResponse(res);

      if (res.ok) {
        return {
          ok: true,
          status: res.status,
          data,
          usedKeyIndex: keyIndex + 1,
        };
      }

      lastError = data;
      lastStatus = res.status;

      if (
        [400, 401, 403, 404, 408, 409, 429, 500, 502, 503, 504].includes(
          res.status
        )
      ) {
        continue;
      }

      return {
        ok: false,
        status: res.status,
        data,
        usedKeyIndex: keyIndex + 1,
      };
    } catch (error) {
      lastError =
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
            }
          : String(error);

      lastStatus = 500;
    }
  }

  return {
    ok: false,
    status: lastStatus,
    data: {
      error: "所有 Groq API Key 都失敗",
      lastError,
    },
    usedKeyIndex: lastUsedKeyIndex,
  };
}

const BANNED_PHRASES = [
  "在數位時代",
  "在現今社會",
  "隨著科技的進步",
  "對於追求...而言",
  "不容忽視",
  "不可或缺",
  "全方位",
  "顛覆傳統",
  "劃時代",
  "值得注意的是",
  "綜上所述",
  "總而言之",
];

function makeWritingStyle() {
  const useBulletList = Math.random() < 0.6;

  return {
    tone: pick([
      "輕鬆部落客口吻",
      "真實消費者心得",
      "朋友分享感",
      "生活經驗分享",
      "自然聊天語氣",
      "踩雷提醒口吻",
      "簡單懶人包口吻",
      "個人觀察口吻",
      "有點碎念但務實的口吻",
      "第一次接觸、邊做邊學的口吻",
    ]),
    structure: pick([
      "先說自己的需求再帶出重點",
      "用生活情境開場",
      "用問題開場再分享心得",
      "先講簡單結論再補充",
      "用比較輕鬆的段落分享",
      "像寫部落格心得文",
      "用一個具體小故事開場再帶出重點",
    ]),
    articleAngle: pick([
      "使用前可以先了解什麼",
      "怎麼挑比較不容易踩雷",
      "一般人會在意的幾個重點",
      "簡單整理心得與注意事項",
      "從消費者角度看這件事",
      "適合新手快速了解",
      "自己實際比較後的取捨",
    ]),
    titleStyle: pick([
      "心得型標題",
      "疑問句標題",
      "懶人包標題",
      "經驗分享標題",
      "避雷提醒標題",
      "生活化標題",
    ]),
    openingStyle: pick([
      "生活情境開場",
      "直接說需求",
      "朋友聊天開場",
      "簡單心得開場",
      "問題切入開場",
    ]),
    h2Count: rand(2, 4),
    faqCount: rand(0, 2),
    wordTarget: rand(500, 900),
    useBulletList,
  };
}

function buildPrompt(args: {
  keyword: string;
  sourceText: string;
  imageUrl: string;
  style: ReturnType<typeof makeWritingStyle>;
}) {
  const { keyword, sourceText, imageUrl, style } = args;

  const structureRules = [
    style.useBulletList
      ? "內容適合時，可使用一組 ul/li 條列。"
      : "本次不要使用 ul/li，使用自然段落呈現。",
    style.faqCount > 0
      ? `文末可加入約 ${style.faqCount} 則簡短 FAQ，但內容必須來自參考資料。`
      : "本次不要加入 FAQ。",
  ].join("\n");

  return `
請根據關鍵字及參考資料，撰寫一篇適合外部部落格、生活網站或心得平台刊登的短篇文章。

【最重要的輸出規則】
你只能輸出一個有效 JSON 物件，不得在 JSON 前後加入任何文字、Markdown 程式碼區塊或說明。

JSON 必須包含：
{
  "title": "純文字文章標題",
  "html": "<div class=\\"article-content\\">完整 HTML 文章</div>"
}

【語言規則】
- 全文使用繁體中文及台灣用語。
- 禁止簡體中文及大陸用語。
- 禁止輸出亂碼或 Unicode 替代字元。
- 禁止輸出 numeric HTML entity，例如 &#xFF1F; 或 &#65311;。
- 正常 HTML 必要的 &amp; 可以使用，但中文標點必須直接輸出「？！，。」。
- 不要在中文句子中間使用半形問號取代中文字或標點。

【關鍵字】
${keyword}

【參考資料】
${sourceText}

【圖片網址】
${imageUrl}

【本次寫作風格】
- 語氣：${style.tone}
- 文章架構：${style.structure}
- 文章角度：${style.articleAngle}
- 標題類型：${style.titleStyle}
- 開頭方式：${style.openingStyle}
- H2 數量：約 ${style.h2Count} 個
- 目標字數：約 ${style.wordTarget} 個中文字

【結構規則】
${structureRules}

【內容品質規則】
1. 從參考資料中選出 1 至 2 個具體技術名詞、流程步驟或明確做法，以自己的話重新說明。
2. 不可整段照抄原文，也不可只是改幾個字。
3. 不可虛構價格、數據、法規、療效、案例、優惠或保證。
4. 不要冒充親自使用過產品或服務；沒有實際經驗時，請使用「整理資料後」「從流程來看」等中性說法。
5. 不要寫成新聞稿、百科或官網宣傳文。
6. 關鍵字自然出現即可，不要重複堆疊。
7. 禁止使用以下罐頭句：
${BANNED_PHRASES.map((phrase) => `- ${phrase}`).join("\n")}
8. 結尾可自然引導讀者查看完整資料，但不得自行加入網址或 a 標籤。

【title 規則】
- 純文字一行。
- 不要包含 h1 或其他 HTML。
- 自然包含關鍵字。
- 不要太正式，像部落格文章標題。
- 建議 18 至 36 個中文字。

【html 規則】
- 必須以 <div class="article-content"> 開始並以 </div> 結束。
- 不可包含 h1。
- 第一個元素必須是：
  <img src="${escapeHtmlAttr(imageUrl)}" alt="文章標題 ${escapeHtmlAttr(
    keyword
  )}" />
- 圖片後可使用 h2、h3、p、ul、li、strong、br。
- 禁止使用 a、script、style、iframe、object、embed。
- 禁止輸出 Markdown 標題符號，例如 ## 標題。
- 不要在 html 欄位外再輸出文章內容。
`;
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json().catch(() => null);

    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "請求內容不是有效 JSON",
          apiVersion: "article-route-v3",
        },
        { status: 400 }
      );
    }

    const prompt =
      typeof requestBody.prompt === "string"
        ? requestBody.prompt.trim()
        : "";

    const keyword =
      typeof requestBody.keyword === "string"
        ? requestBody.keyword.trim()
        : "";

    const sourceTitle =
      typeof requestBody.sourceTitle === "string"
        ? requestBody.sourceTitle.trim()
        : "";

    const sourceText =
      typeof requestBody.sourceText === "string"
        ? requestBody.sourceText.trim()
        : "";

    const imageUrl =
      typeof requestBody.imageUrl === "string"
        ? requestBody.imageUrl.trim()
        : "";

    const officialUrl =
      typeof requestBody.officialUrl === "string"
        ? requestBody.officialUrl.trim()
        : "";

    const gsOfficialUrl =
      typeof requestBody.gsOfficialUrl === "string"
        ? requestBody.gsOfficialUrl.trim()
        : "";

    const finalKeyword = keyword || prompt;
    const finalOfficialUrl = gsOfficialUrl || officialUrl;

    let finalOfficialUrlDecode = "";

    try {
      finalOfficialUrlDecode = decodeURIComponent(finalOfficialUrl);
    } catch {
      finalOfficialUrlDecode = finalOfficialUrl;
    }

    if (!finalKeyword) {
      return NextResponse.json(
        {
          ok: false,
          error: "缺少 keyword 或 prompt",
          apiVersion: "article-route-v3",
        },
        { status: 400 }
      );
    }

    if (!sourceText) {
      return NextResponse.json(
        {
          ok: false,
          error: "缺少 sourceText",
          apiVersion: "article-route-v3",
        },
        { status: 400 }
      );
    }

    const safeSourceText = limitText(
      sourceText,
      SOURCE_TEXT_MAX_LENGTH
    );

    let parsed: GeneratedArticle | null = null;
    let lastRaw = "";
    let lastFailReason: unknown = null;
    let lastUsedKeyIndex: number | null = null;
    let lastFinishReason: string | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const style = makeWritingStyle();
      const finalPrompt = buildPrompt({
        keyword: finalKeyword,
        sourceText: safeSourceText,
        imageUrl,
        style,
      });

      const groqBody: Record<string, unknown> = {
        model: PRIMARY_MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是台灣繁體中文內容編輯。你只能輸出有效 JSON，且 JSON 必須包含 title 與 html 兩個字串欄位。",
          },
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        response_format: {
          type: "json_object",
        },
        temperature: 0.65,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
      };

      // GPT-OSS 推理模型專用設定
      if (PRIMARY_MODEL.includes("gpt-oss")) {
        groqBody.reasoning_effort = "low";
        groqBody.reasoning_format = "hidden";
      }

      const groqResult = await callGroqWithRotation(groqBody);

      lastUsedKeyIndex = groqResult.usedKeyIndex;

      if (!groqResult.ok) {
        lastFailReason = {
          attempt,
          reason: "Groq API 呼叫失敗",
          status: groqResult.status,
          response: groqResult.data,
        };
        continue;
      }

      const choice = groqResult.data?.choices?.[0];
      const message = choice?.message;

      lastFinishReason =
        typeof choice?.finish_reason === "string"
          ? choice.finish_reason
          : null;

      const answer = extractMessageContent(message);
      lastRaw = answer;

      if (!answer) {
        lastFailReason = {
          attempt,
          reason: "模型回傳空 content",
          finishReason: lastFinishReason,
          reasoningLength:
            typeof message?.reasoning === "string"
              ? message.reasoning.length
              : 0,
          usage: groqResult.data?.usage || null,
        };
        continue;
      }

      const result = extractTitleAndHtml(
        answer,
        finalKeyword
      );

      if (!result) {
        lastFailReason = {
          attempt,
          reason: "JSON、舊格式及備援格式皆無法解析",
          finishReason: lastFinishReason,
          rawPreview: answer.slice(0, 1500),
          usage: groqResult.data?.usage || null,
        };
        continue;
      }

      let candidateTitle = toTaiwanTraditional(
        cleanTitle(result.title)
      );

      let candidateHtml = toTaiwanTraditional(
        result.html.trim()
      );

      candidateTitle = decodeStrayEntities(candidateTitle);
      candidateHtml = decodeStrayEntities(candidateHtml);

      candidateHtml = stripMarkdownCodeFence(candidateHtml);
      candidateHtml = removeDangerousTags(candidateHtml);
      candidateHtml = removeAllLinks(candidateHtml);
      candidateHtml = ensureImageAtBeginning(
        candidateHtml,
        imageUrl,
        finalKeyword
      );
      candidateHtml = ensureArticleWrapper(candidateHtml);

      if (!candidateTitle || !candidateHtml) {
        lastFailReason = {
          attempt,
          reason: "清理後標題或文章內容為空",
          rawPreview: answer.slice(0, 1500),
        };
        continue;
      }

      if (
        hasBadText(candidateTitle) ||
        hasBadText(candidateHtml)
      ) {
        lastFailReason = {
          attempt,
          reason: "偵測到疑似亂碼，準備重試",
          rawPreview: answer.slice(0, 1500),
        };
        continue;
      }

      parsed = {
        title: candidateTitle,
        html: candidateHtml,
      };

      break;
    }

    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          apiVersion: "article-route-v3",
          error: "AI 回傳格式無法解析或內容含有亂碼（已重試多次）",
          raw: lastRaw,
          lastFailReason,
          finishReason: lastFinishReason,
          usedModel: PRIMARY_MODEL,
          usedKeyIndex: lastUsedKeyIndex,
        },
        { status: 500 }
      );
    }

    const title = parsed.title;
    let html = parsed.html;

    if (finalOfficialUrl) {
      const safeUrl = escapeHtmlAttr(finalOfficialUrl);
      const safeLinkText = escapeHtmlText(
        sourceTitle || title
      );

      const linkHtml = `
<hr>
<p><strong>延伸閱讀</strong></p>
<p>
  <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeLinkText}</a>
</p>`;

      if (/<\/div>\s*$/i.test(html)) {
        html = html.replace(
          /<\/div>\s*$/i,
          `${linkHtml}\n</div>`
        );
      } else {
        html = `${html}\n${linkHtml}`;
      }
    }

    // 最後再檢查完整組合後的內容
    if (hasBadText(title) || hasBadText(html)) {
      return NextResponse.json(
        {
          ok: false,
          apiVersion: "article-route-v3",
          error: "內容含有疑似亂碼",
          title,
          html,
          usedModel: PRIMARY_MODEL,
          usedKeyIndex: lastUsedKeyIndex,
          titleBase64: toBase64Utf8(title),
          htmlBase64: toBase64Utf8(html),
        },
        { status: 500 }
      );
    }

    // Redis 失敗不應讓已成功生成的文章一起報錯
    try {
      await redis.set("latest_generate_post", html);
    } catch (redisError) {
      console.error("Redis 儲存失敗：", redisError);
    }

    return NextResponse.json({
      ok: true,
      apiVersion: "article-route-v3",

      gsOfficialUrl: finalOfficialUrl,
      gsOfficialUrlDecode: finalOfficialUrlDecode,
      sourceTitle,

      title,
      html,

      usedModel: PRIMARY_MODEL,
      usedKeyIndex: lastUsedKeyIndex,

      titleBase64: toBase64Utf8(title),
      htmlBase64: toBase64Utf8(html),
    });
  } catch (error) {
    console.error("AI 產文 API 發生錯誤：", error);

    return NextResponse.json(
      {
        ok: false,
        apiVersion: "article-route-v3",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
