import { NextResponse } from "next/server";
import { Converter } from "opencc-js";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";
const redis = Redis.fromEnv();

// 簡體 -> 台灣繁體（含詞彙轉換，例如 网络 -> 網路、信息 -> 訊息）
// 模組層級建立一次即可重複使用
const toTaiwanTraditional = Converter({ from: "cn", to: "twp" });

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function limitText(text: string, maxLength = 1800) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) : text;
}

function escapeHtmlAttr(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toBase64Utf8(value: string) {
  return Buffer.from(value || "", "utf8").toString("base64");
}

// ============================================================
// 亂碼防線：偵測殘留的 HTML numeric entity（例如 &#xff1f; &#65311;）
// 這種字串一旦出現在最終輸出裡，代表某個環節做了「編碼但沒解碼」，
// 貼到外部平台後就會變成看得到的亂碼文字。
// 正常文章內容裡「不應該」出現這種 pattern，出現就直接判定壞掉、重試。
// ============================================================
function hasBadText(value: string) {
  if (!value) return false;
  if (value.includes("�")) return true;
  if (value.includes("????") || value.includes("???")) return true;
  // 殘留的 hex / decimal HTML entity 字串（&#xff1f; 或 &#65311; 這種）
  if (/&#x?[0-9a-fA-F]{2,6};/i.test(value)) return true;
  // 被二次轉義的 entity（&amp;#x... 或 &amp;#...）
  if (/&amp;#x?[0-9a-fA-F]{2,6};/i.test(value)) return true;
  return false;
}

// 保險起見：即便偵測到全形符號被轉成 entity，也嘗試自動解碼救回來
// （HTML numeric entity -> 實際字元），解碼後再跑一次 hasBadText 判斷
function decodeStrayEntities(value: string) {
  if (!value) return value;
  return value
    // &amp;#x2019; 這種先還原一層 &amp; -> &
    .replace(/&amp;(#x?[0-9a-fA-F]{2,6};)/gi, "&$1")
    // &#xFF1F; / &#65311; -> 真正的字元
    .replace(/&#x([0-9a-fA-F]{2,6});/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d{2,7});/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    );
}

function getGroqApiKeys() {
  return String(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

// ============================================================
// 多模型輪替：
// 1) qwen/qwen3-32b 在 Groq 上即將/已經下架，改用 openai/gpt-oss-120b 當主力
// 2) 同時混用第二顆模型，分散「單一模型文字指紋」，降低被平台/演算法
//    判定為同一批機器生成內容的機率
// 3) 若某個模型在 Groq 上被下架或回傳錯誤，會自動跳過，不會整體壞掉
// ============================================================
const MODEL_POOL = [
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
];

function pickModel() {
  return pick(MODEL_POOL);
}

async function callGroqWithRotation(body: any) {
  const keys = getGroqApiKeys();

  if (!keys.length) {
    return {
      ok: false,
      status: 500,
      data: {
        ok: false,
        error: "缺少 GROQ_API_KEYS 或 GROQ_API_KEY",
      },
      usedKeyIndex: null,
    };
  }

  const startIndex = Math.floor(Math.random() * keys.length);
  let lastError: any = null;
  let lastStatus = 500;

  for (let i = 0; i < keys.length; i++) {
    const keyIndex = (startIndex + i) % keys.length;
    const apiKey = keys[keyIndex];

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        data = {
          error: "Groq 回傳不是 JSON",
        };
      }

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

      // model 被下架 (400/404) 也視為可重試（換下一把 key，外層迴圈會重挑 model）
      if ([400, 401, 403, 404, 429, 500, 502, 503, 504].includes(res.status)) {
        continue;
      }

      return {
        ok: false,
        status: res.status,
        data,
        usedKeyIndex: keyIndex + 1,
      };
    } catch (error) {
      lastError = String(error);
      lastStatus = 500;
      continue;
    }
  }

  return {
    ok: false,
    status: lastStatus || 500,
    data: {
      ok: false,
      error: "所有 GROQ API KEY 都失敗",
      lastError,
    },
    usedKeyIndex: null,
  };
}

// ============================================================
// 禁用的 AI 罐頭金句 / 內容農場感開場結尾
// 這些是 LLM 產文最容易出現、也最容易被平台或搜尋引擎判定為
// 「低資訊密度行銷內容」的固定句型，直接寫進 prompt 裡明確禁止
// ============================================================
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
  const useTable = Math.random() < 0.35; // 只有部分文章會用比較表格，避免每篇骨架都一樣
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
    faqCount: rand(0, 2), // 允許 0，不是每篇都要有 FAQ
    wordTarget: rand(500, 900),
    useTable,
    useBulletList,
  };
}

/**
 * 改用分隔符格式解析模型輸出，不再依賴 JSON.parse。
 * 預期格式：
 * [TITLE]
 * ...標題...
 * [HTML]
 * ...html...
 * [END]
 */
function extractTitleAndHtml(text: string): { title: string; html: string } | null {
  if (!text) return null;

  let cleaned = text.trim();

  // 移除模型偶爾仍會加上的 markdown code fence
  cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/m, "").replace(/```\s*$/m, "").trim();

  const titleMatch = cleaned.match(/\[TITLE\]([\s\S]*?)\[HTML\]/i);
  const htmlMatch = cleaned.match(/\[HTML\]([\s\S]*?)(\[END\]|$)/i);

  if (!titleMatch || !htmlMatch) return null;

  const title = titleMatch[1].trim();
  const html = htmlMatch[1].trim();

  if (!title || !html) return null;

  return { title, html };
}

function removeAllLinks(html: string) {
  return html.replace(/<a\b[^>]*>(.*?)<\/a>/gis, "$1");
}

export async function POST(req: Request) {
  try {
const {
  prompt,
  keyword,
  sourceTitle,
  sourceText,
  imageUrl,
  officialUrl,
  gsOfficialUrl
} = await req.json();
const finalKeyword = keyword || prompt || "";

let finalOfficialUrl = String(gsOfficialUrl || officialUrl || "").trim();

let finalOfficialUrlDecode = "";

try {
  finalOfficialUrlDecode = decodeURIComponent(finalOfficialUrl);
} catch {
  finalOfficialUrlDecode = finalOfficialUrl;
}

    if (!finalKeyword) {
      return NextResponse.json(
        { ok: false, error: "缺少 keyword 或 prompt" },
        { status: 400 }
      );
    }

    if (!sourceText) {
      return NextResponse.json(
        { ok: false, error: "缺少 sourceText" },
        { status: 400 }
      );
    }

    const safeSourceText = limitText(sourceText, 1800);

    let parsed: { title: string; html: string } | null = null;
    let lastRaw = "";
    let lastUsedKeyIndex: number | null = null;
    let lastFailReason: any = null;
    let style = makeWritingStyle();

    const MAX_ATTEMPTS = 4;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // 每次重試重新隨機一組風格，避免重複生成同一份壞輸出
      style = makeWritingStyle();
      const model = pickModel();

      const structureRules = [
        style.useBulletList
          ? "可視情況使用條列（ul/li）"
          : "本次不要使用條列（ul/li），全部用段落文字表達",
        style.useTable
          ? "如果內容適合，可以用一個簡單比較概念（但不必用 table 標籤，優先用文字敘述比較差異）"
          : "本次不要使用任何表格（table）",
        style.faqCount > 0
          ? `文末可加約 ${style.faqCount} 則簡短 FAQ`
          : "本次不要加 FAQ 段落",
      ].join("\n");

      const finalPrompt = `
你是一位會寫外部部落格文章的內容寫手。

這篇文章用途：
發在外部部落格、生活網站、心得型文章平台，用來自然介紹主題，輔助官網 SEO / AEO / GEO（希望內容有機會被 AI 答案引擎如 ChatGPT、Perplexity 引用或推薦）。

請根據關鍵字與原文資料，寫一篇「輕鬆、自然、像真人分享」的短篇部落格文章。

【語言規則（非常重要）】
請全程使用繁體中文（台灣用語、正體字），絕對不要使用任何簡體字或大陸用語。
絕對不要輸出任何 HTML entity 或編碼符號（例如 &#x... 或 &amp; 這類東西），全形標點符號（？！，。）請直接用該符號本身，不要用任何形式的編碼表示。

【關鍵字】
${finalKeyword}

【原文資料】
${safeSourceText}

【圖片網址】
${imageUrl || ""}

【本次寫作風格】
語氣：${style.tone}
文章架構：${style.structure}
文章角度：${style.articleAngle}
標題類型：${style.titleStyle}
開頭方式：${style.openingStyle}
H2數量：約 ${style.h2Count} 個
文章字數：約 ${style.wordTarget} 字

【本次結構規則】
${structureRules}

【內容品質要求（非常重要）】
1. 從【原文資料】裡挑出 1-2 個具體的技術名詞、流程步驟、或明確做法，用自己的話重新說明，不要只寫空泛的形容詞（例如「大幅提升」「顯著改善」「全方位」這種話術，寫了等於沒寫）。
2. 絕對不要使用以下這類內容農場慣用句型（開場、結尾都不行）：
${BANNED_PHRASES.map((p) => `- ${p}`).join("\n")}
3. 文章要像一個真的用過/了解這件事的人在講細節，而不是產品文案語氣。
4. 不要寫得太像官網文、新聞稿、百科文。
5. 自然帶入關鍵字，不要硬塞、不要重複堆疊關鍵字。
6. 保留原文重點，但要重新用自己的話寫，不可照抄原文句子。
7. 不要虛構價格、數據、法規、療效、保證或優惠。
8. 最後一段請自然留下閱讀動機，不要直接結束文章，例如：
「如果想了解完整內容、更多案例、完整流程或最新資訊，可以繼續閱讀官方整理。」
但不要自行加入網址，也不要輸出 <a> 標籤。

【HTML規則】
1. html 不要包含 h1。
2. html 第一行先放圖片。
3. 圖片格式：
<img src="${imageUrl || ""}" alt="文章標題 ${finalKeyword}" />
4. 圖片後文章從 p 或 h2 開始都可以。
5. 可使用 h2、h3、p、ul、li、strong（依照上面【本次結構規則】決定要不要用 ul/table）。
6. 禁止使用 a 標籤。
7. 不要輸出 markdown。
8. 不要輸出程式碼區塊。
9. 不要輸出任何 HTML entity 編碼（例如 &#x2019; 這類），標點符號請直接輸出原始文字符號。
10. <div class="article-content">開始，</div>結束。

【輸出格式（非常重要，請嚴格遵守）】
請只用下面這個純文字格式輸出，不要輸出 JSON、不要加任何說明文字：

[TITLE]
這裡放文章標題（純文字一行，不含 h1）
[HTML]
這裡放完整 HTML 內容
[END]

【title 規則】
1. title 只放純文字，不要有任何 HTML entity 編碼。
2. title 不要包含 h1。
3. title 要自然包含關鍵字。
4. title 不要太正式，像部落格標題。
`;

      const groqResult = await callGroqWithRotation({
        model,
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        temperature: 1.15,
        top_p: 0.95,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
        max_tokens: 2500,
      });

      if (!groqResult.ok) {
        // 這次挑到的 model/key 全部失敗，換下一輪重新挑 model 再試
        lastFailReason = groqResult.data;
        continue;
      }

      lastUsedKeyIndex = groqResult.usedKeyIndex || null;

      const answer = groqResult.data?.choices?.[0]?.message?.content || "";
      lastRaw = answer;

      const result = extractTitleAndHtml(answer);

      if (!result) {
        lastFailReason = "格式解析失敗，準備重試";
        continue;
      }

      // 先做繁體轉換
      let candidateTitle = toTaiwanTraditional(result.title);
      let candidateHtml = toTaiwanTraditional(result.html);

      // 亂碼防線：先嘗試自動解碼一次，救回被意外編碼成 entity 的符號
      candidateTitle = decodeStrayEntities(candidateTitle);
      candidateHtml = decodeStrayEntities(candidateHtml);

      // 解碼後還是有問題，代表輸出本身壞掉，直接重試而不是放行
      if (hasBadText(candidateTitle) || hasBadText(candidateHtml)) {
        lastFailReason = "偵測到殘留亂碼 / HTML entity，直接重試";
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
          error: "AI 回傳格式無法解析或內容含有亂碼（已重試多次）",
          raw: lastRaw,
          lastFailReason,
          usedKeyIndex: lastUsedKeyIndex,
        },
        { status: 500 }
      );
    }

    const title = parsed.title;
    let html = parsed.html;

  html = removeAllLinks(html);

// decode href 裡的中文編碼，讓按鍵精靈不用自己處理
html = html.replace(/href="([^"]+)"/g, (match, url) => {
  try {
    return `href="${decodeURIComponent(url)}"`;
  } catch {
    return match;
  }
});

if (finalOfficialUrl) {
      const safeUrl = escapeHtmlAttr(finalOfficialUrl);
const safeLinkText = escapeHtmlAttr(sourceTitle || title);

const linkHtml = `
<hr>

<p><strong>延伸閱讀</strong></p>

<p>
<a href="${safeUrl}" target="_blank" rel="noopener">
${safeLinkText}
</a>
</p>`;

      if (/<\/div>\s*$/.test(html)) {
        html = html.replace(/<\/div>\s*$/, linkHtml + "\n</div>");
      } else {
        html += "\n" + linkHtml;
      }
    }

    await redis.set("latest_generate_post", html);

    // 最後再檢查一次完整組合後的內容（含延伸閱讀連結區塊）
    if (hasBadText(title) || hasBadText(html)) {
      return NextResponse.json(
        {
          ok: false,
          error: "內容含有疑似亂碼",
          title,
          html,
          usedKeyIndex: lastUsedKeyIndex,
          titleBase64: toBase64Utf8(title),
          htmlBase64: toBase64Utf8(html),
        },
        { status: 500 }
      );
    }

return NextResponse.json({
  gsOfficialUrl: finalOfficialUrl,
  gsOfficialUrlDecode: finalOfficialUrlDecode,
  sourceTitle: sourceTitle || "",
  ok: true,

  title,
  html,

  usedKeyIndex: lastUsedKeyIndex,

  titleBase64: toBase64Utf8(title),
  htmlBase64: toBase64Utf8(html),
});
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}