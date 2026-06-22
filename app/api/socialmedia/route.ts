import { NextResponse } from "next/server";
import { Converter } from "opencc-js";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

// ✔ 簡體 → 台灣繁體
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

// ✔ base64
function toBase64Utf8(value: string) {
  return Buffer.from(value || "", "utf8").toString("base64");
}

// ✔ 亂碼檢測（加強版）
function hasBadText(value: string) {
  return (
    value.includes("\uFFFD") ||
    /\?{2,}/.test(value) ||
    /□+/.test(value)
  );
}

function getGroqApiKeys() {
  return String(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

// ✔ Groq fallback
async function callGroqWithRotation(body: any) {
  const keys = getGroqApiKeys();

  if (!keys.length) {
    return {
      ok: false,
      status: 500,
      data: { ok: false, error: "缺少 GROQ API KEY" },
      usedKeyIndex: null,
    };
  }

  const startIndex = Math.floor(Math.random() * keys.length);

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

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        return {
          ok: true,
          status: res.status,
          data,
          usedKeyIndex: keyIndex + 1,
        };
      }

      if (![401, 403, 429, 500, 502, 503, 504].includes(res.status)) {
        return {
          ok: false,
          status: res.status,
          data,
          usedKeyIndex: keyIndex + 1,
        };
      }
    } catch {}
  }

  return {
    ok: false,
    status: 500,
    data: { ok: false, error: "所有 GROQ API KEY 都失敗" },
    usedKeyIndex: null,
  };
}

function makeSocialStyle(platform: "fb" | "threads") {
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
    emojiDensity: pick([
      "適度使用 2～4 個 emoji 增加視覺節奏",
      "每個重點前放一個 emoji",
    ]),
    hashtagCount: isThreads ? rand(2, 3) : rand(2, 3),
    maxWords: isThreads ? rand(120, 200) : rand(180, 280),
  };
}

function extractPostAndHashtags(text: string) {
  if (!text) return null;

  const cleaned = text
    .trim()
    .replace(/^```[a-zA-Z]*\s*/m, "")
    .replace(/```\s*$/m, "");

  const postMatch = cleaned.match(/\[POST\]([\s\S]*?)(\[HASHTAGS\]|$)/i);
  const hashtagsMatch = cleaned.match(/\[HASHTAGS\]([\s\S]*?)(\[END\]|$)/i);

  if (!postMatch) return null;

  return {
    post: postMatch[1].trim(),
    hashtags: hashtagsMatch?.[1]?.trim() || "",
  };
}

function removeHashtagsFromPost(text: string) {
  return text.replace(/#[\p{L}0-9_]+/gu, "").trim();
}

export async function POST(req: Request) {
  try {
    const {
      keyword,
      sourceText,
      platform = "fb",
      officialUrl,
    } = await req.json();

    if (!keyword || !sourceText) {
      return NextResponse.json(
        { ok: false, error: "缺少參數" },
        { status: 400 }
      );
    }

    const safeSourceText = limitText(sourceText, 1800);
    const finalPlatform = platform === "threads" ? "threads" : "fb";

    let parsed: any = null;
    let lastRaw = "";

    const MAX_ATTEMPTS = 5;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const style = makeSocialStyle(finalPlatform);

      const prompt = `
你是社群小編（Facebook / Threads）。

【關鍵字】
${keyword}

【資料】
${safeSourceText}

【規則】
- 繁體中文（台灣）
- 不可簡體
- POST 與 HASHTAGS 必須分開
- hashtag 只能在 HASHTAGS
- 不可亂碼

【風格】
hook：${style.hook}
angle：${style.angle}
tone：${style.tone}
cta：${style.cta}
structure：${style.structure}
emoji：${style.emojiDensity}
字數：${style.maxWords}

【輸出格式】
[POST]
...
[HASHTAGS]
#aaa #bbb
[END]
`;

      const res = await callGroqWithRotation({
        model: "qwen/qwen3-32b",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.1,
        top_p: 0.95,
        max_tokens: 1200,
      });

      if (!res.ok) {
        return NextResponse.json(res, { status: 500 });
      }

      const answer = res.data?.choices?.[0]?.message?.content || "";
      lastRaw = answer;

      const result = extractPostAndHashtags(answer);
      if (!result) continue;

      let post = toTaiwanTraditional(result.post);
      let hashtags = toTaiwanTraditional(result.hashtags);

      post = removeHashtagsFromPost(post);

      if (hasBadText(post) || hasBadText(hashtags)) continue;

      parsed = { post, hashtags };
      break;
    }

    if (!parsed) {
      return NextResponse.json(
        { ok: false, error: "解析失敗", raw: lastRaw },
        { status: 500 }
      );
    }

    const fullPost =
      parsed.post +
      (officialUrl ? `\n\n${officialUrl}` : "") +
      (parsed.hashtags ? `\n\n${parsed.hashtags}` : "");

    // ✔ 存入 Redis
    await redis.set("latest_post", fullPost);

    return NextResponse.json({
      ok: true,
      post: parsed.post,
      hashtags: parsed.hashtags,
      fullPost,
      postBase64: toBase64Utf8(parsed.post),
      hashtagsBase64: toBase64Utf8(parsed.hashtags),
      fullPostBase64: toBase64Utf8(fullPost),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}