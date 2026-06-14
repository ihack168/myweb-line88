import { NextResponse } from "next/server";
import { Converter } from "opencc-js";

export const dynamic = "force-dynamic";

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

function toBase64Utf8(value: string) {
  return Buffer.from(value || "", "utf8").toString("base64");
}

function hasBadText(value: string) {
  return (
    value.includes("\uFFFD") ||
    value.includes("????") ||
    value.includes("???")
  );
}

function getGroqApiKeys() {
  return String(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function callGroqWithRotation(body: any) {
  const keys = getGroqApiKeys();

  if (!keys.length) {
    return {
      ok: false,
      status: 500,
      data: { ok: false, error: "缺少 GROQ_API_KEYS 或 GROQ_API_KEY" },
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
        data = { error: "Groq 回傳不是 JSON" };
      }

      if (res.ok) {
        return { ok: true, status: res.status, data, usedKeyIndex: keyIndex + 1 };
      }

      lastError = data;
      lastStatus = res.status;

      if ([401, 403, 429, 500, 502, 503, 504].includes(res.status)) {
        continue;
      }

      return { ok: false, status: res.status, data, usedKeyIndex: keyIndex + 1 };
    } catch (error) {
      lastError = String(error);
      lastStatus = 500;
      continue;
    }
  }

  return {
    ok: false,
    status: lastStatus || 500,
    data: { ok: false, error: "所有 GROQ API KEY 都失敗", lastError },
    usedKeyIndex: null,
  };
}

// ─── 社群媒體專用隨機風格變數 ────────────────────────────────────────────────

type Platform = "fb" | "threads";

function makeSocialStyle(platform: Platform) {
  const isThreads = platform === "threads";

  return {
    hook: pick([
      "用一個反直覺的問題開場",
      "用讓人意外的數字或事實開場",
      "用短短一句話製造懸念",
      "用生活中常見的誤解開場",
      "用情境代入感開場（你是不是也…）",
      "用挑戰常識的說法開場",
    ]),
    angle: pick([
      "踩雷提醒",
      "冷知識分享",
      "個人經驗心得",
      "懶人包整理",
      "比較分析",
      "常見迷思破解",
      "實用小技巧",
    ]),
    tone: pick([
      "像朋友聊天，輕鬆隨性",
      "簡短有力，直接講重點",
      "帶點幽默但不刻意搞笑",
      "親切分享感，沒有距離感",
      "略帶個人主觀觀點",
    ]),
    cta: pick([
      "最後用一個開放問題邀請留言",
      "最後問讀者有沒有類似經驗",
      "最後留一個讓人想回答的選擇題",
      "最後說歡迎分享給有需要的人",
      "最後問大家同不同意這個觀點",
    ]),
    structure: pick([
      "一段鉤子 + 兩三個重點 + 互動結尾",
      "情境代入 + 核心資訊 + 呼籲互動",
      "問題拋出 + 解答 + 延伸思考",
      "短句堆疊製造節奏感",
    ]),
    hashtagCount: isThreads ? rand(3, 5) : rand(4, 7),
    maxWords: isThreads ? rand(120, 200) : rand(180, 280),
    emojiDensity: pick(["適度使用 2～4 個 emoji 增加視覺節奏", "每個重點前放一個 emoji"]),
  };
}

// ─── 輸出格式解析 ─────────────────────────────────────────────────────────────

function extractPostAndHashtags(
  text: string
): { post: string; hashtags: string } | null {
  if (!text) return null;

  const cleaned = text
    .trim()
    .replace(/^```[a-zA-Z]*\s*/m, "")
    .replace(/```\s*$/m, "")
    .trim();

  const postMatch = cleaned.match(/\[POST\]([\s\S]*?)\[HASHTAGS\]/i);
  const hashtagsMatch = cleaned.match(/\[HASHTAGS\]([\s\S]*?)(\[END\]|$)/i);

  if (!postMatch || !hashtagsMatch) return null;

  const post = postMatch[1].trim();
  const hashtags = hashtagsMatch[1].trim();

  if (!post) return null;

  return { post, hashtags };
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const {
      prompt,
      keyword,
      sourceText,
      officialUrl,
      platform = "fb",
    } = await req.json();

    const finalKeyword = keyword || prompt || "";
    const finalPlatform: Platform = platform === "threads" ? "threads" : "fb";
    const finalOfficialUrl = String(officialUrl || "").trim();

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

    let parsed: { post: string; hashtags: string } | null = null;
    let lastRaw = "";
    let lastUsedKeyIndex: number | null = null;
    let lastFailReason: any = null;

    const MAX_ATTEMPTS = 5; // 亂碼重試也算在內，拉高到 5 次

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const style = makeSocialStyle(finalPlatform);
      const platformLabel = finalPlatform === "threads" ? "Threads" : "Facebook";

      const finalPrompt = `
你是一位擅長經營 ${platformLabel} 的社群小編。

任務：根據以下關鍵字與原文資料，寫一則適合在 ${platformLabel} 發布的貼文。

【語言規則（非常重要）】
請全程使用繁體中文（台灣用語、正體字），絕對不要使用任何簡體字或大陸用語。

【關鍵字】
${finalKeyword}

【原文資料】
${safeSourceText}

【本次貼文風格】
開場鉤子：${style.hook}
內容角度：${style.angle}
語氣：${style.tone}
結尾互動：${style.cta}
段落結構：${style.structure}
Emoji 使用：${style.emojiDensity}
字數目標：${style.maxWords} 字以內

【寫作規則】
1. 貼文要能在前兩行就抓住人，因為平台會折疊超過兩行的內容。
2. 不要寫得像官網公告或新聞稿，要像真人在分享。
3. 自然帶入關鍵字，不要硬塞。
4. 不可照抄原文句子，用自己的話說。
5. 不要虛構任何價格、數據、法規、療效、保證或優惠。
6. 不要在貼文內容裡自行放網址（網址會由程式另外加入）。
7. 絕對不要輸出 ???、????、亂碼、替代符號（如 □ 或 \uFFFD）或無意義字元。
8. 資料不足時請保守描述，不要硬補內容。
9. 貼文長度要精準控制在 ${style.maxWords} 字以內，不要超過。

【Hashtag 規則】
1. 只輸出 ${style.hashtagCount} 個 hashtag。
2. 選與主題高度相關、有機會被搜尋的 tag。
3. 全部 hashtag 放在 [HASHTAGS] 區塊，不要混入貼文內容裡。
4. 格式：每個 hashtag 用空格分隔，例如 #關鍵字 #台灣 #生活

【輸出格式（嚴格遵守，不要輸出任何說明文字）】

[POST]
這裡放貼文內容（純文字，可含換行與 emoji，不含 hashtag）
[HASHTAGS]
這裡放所有 hashtag（空格分隔）
[END]
`;

      const groqResult = await callGroqWithRotation({
        model: "qwen/qwen3-32b",
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 1.2,
        top_p: 0.95,
        frequency_penalty: 0.7,
        presence_penalty: 0.6,
        max_tokens: 1000,
      });

      // Groq 整體失敗（key 用盡等），直接中止不重試
      if (!groqResult.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: groqResult.data,
            usedKeyIndex: groqResult.usedKeyIndex || null,
          },
          { status: groqResult.status }
        );
      }

      lastUsedKeyIndex = groqResult.usedKeyIndex || null;

      const answer = groqResult.data?.choices?.[0]?.message?.content || "";
      lastRaw = answer;

      const result = extractPostAndHashtags(answer);

      if (!result) {
        lastFailReason = `第 ${attempt + 1} 次：格式解析失敗，重試`;
        continue;
      }

      const convertedPost = toTaiwanTraditional(result.post);
      const convertedHashtags = toTaiwanTraditional(result.hashtags);

      // 亂碼檢查：有問題就繼續下一次重試，不直接回傳 500
      if (hasBadText(convertedPost) || hasBadText(convertedHashtags)) {
        lastFailReason = `第 ${attempt + 1} 次：內容含亂碼，重試`;
        continue;
      }

      parsed = {
        post: convertedPost,
        hashtags: convertedHashtags,
      };
      break;
    }

    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: "AI 回傳格式無法解析或含亂碼（已重試多次）",
          raw: lastRaw,
          lastFailReason,
          usedKeyIndex: lastUsedKeyIndex,
        },
        { status: 500 }
      );
    }

    // 組合最終貼文：貼文本文 + 官網連結（若有）+ hashtag
    let fullPost = parsed.post;

    if (finalOfficialUrl) {
      fullPost += `\n\n${finalOfficialUrl}`;
    }

    if (parsed.hashtags) {
      fullPost += `\n\n${parsed.hashtags}`;
    }

    return NextResponse.json({
      ok: true,
      platform: finalPlatform,

      post: parsed.post,
      hashtags: parsed.hashtags,
      fullPost,

      usedKeyIndex: lastUsedKeyIndex,

      postBase64: toBase64Utf8(parsed.post),
      hashtagsBase64: toBase64Utf8(parsed.hashtags),
      fullPostBase64: toBase64Utf8(fullPost),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}