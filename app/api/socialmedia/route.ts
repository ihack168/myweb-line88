import { NextResponse } from "next/server";
import { Converter } from "opencc-js";

export const dynamic = "force-dynamic";

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

// ✔ 更安全 base64
function toBase64Utf8(value: string) {
  return Buffer.from(value || "", "utf8").toString("base64");
}

// ✔ 你原本漏掉的真正亂碼來源
function hasBadText(value: string) {
  return (
    value.includes("\uFFFD") || // �
    /\?{2,}/.test(value) ||     // ???
    /□+/.test(value)            // 方塊字
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
      data: { ok: false, error: "缺少 GROQ API KEY" },
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
        return {
          ok: true,
          status: res.status,
          data,
          usedKeyIndex: keyIndex + 1,
        };
      }

      lastError = data;
      lastStatus = res.status;

      if ([401, 403, 429, 500, 502, 503, 504].includes(res.status)) {
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
    data: { ok: false, error: "所有 GROQ API KEY 都失敗", lastError },
    usedKeyIndex: null,
  };
}

// ✔ 社群風格
function makeSocialStyle(platform: "fb" | "threads") {
  const isThreads = platform === "threads";

  return {
    hook: pick([
      "用反直覺問題開場",
      "用數字衝擊開場",
      "一句話埋懸念",
      "用誤解切入",
      "用生活情境切入",
    ]),
    angle: pick([
      "踩雷提醒",
      "冷知識",
      "經驗分享",
      "懶人包",
      "實用技巧",
    ]),
    tone: pick([
      "像朋友聊天",
      "簡短直接",
      "輕鬆分享",
      "真實口吻",
    ]),
    cta: pick([
      "最後問讀者想法",
      "最後丟問題互動",
      "最後請大家分享經驗",
    ]),
    structure: pick([
      "鉤子 + 重點 + 結尾互動",
      "情境 + 解釋 + 問題",
    ]),
    hashtagCount: isThreads ? rand(2, 3) : rand(2, 3),
    maxWords: isThreads ? rand(120, 200) : rand(180, 280),
  };
}

// ✔ 解析
function extractPostAndHashtags(text: string) {
  if (!text) return null;

  const cleaned = text
    .trim()
    .replace(/^```[a-zA-Z]*\s*/m, "")
    .replace(/```\s*$/m, "");

  const postMatch = cleaned.match(/\[POST\]([\s\S]*?)\[HASHTAGS\]/i);
  const hashtagsMatch = cleaned.match(/\[HASHTAGS\]([\s\S]*?)(\[END\]|$)/i);

  if (!postMatch || !hashtagsMatch) return null;

  return {
    post: postMatch[1].trim(),
    hashtags: hashtagsMatch[1].trim(),
  };
}

// ✔ 偵測 hashtag 混入內文（你這個問題關鍵）
function postHasMixedHashtags(post: string) {
  return /#[\p{L}0-9_]+/gu.test(post);
}

export async function POST(req: Request) {
  try {
    const { keyword, sourceText, platform = "fb" } = await req.json();

    const finalKeyword = keyword || "";
    const finalPlatform = platform === "threads" ? "threads" : "fb";

    if (!finalKeyword || !sourceText) {
      return NextResponse.json(
        { ok: false, error: "缺少參數" },
        { status: 400 }
      );
    }

    const safeSourceText = limitText(sourceText, 1800);

    let parsed: any = null;
    let lastRaw = "";

    const MAX_ATTEMPTS = 5;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const style = makeSocialStyle(finalPlatform);

      const prompt = `
你是社群小編，寫 FB / Threads 貼文。

【關鍵字】
${finalKeyword}

【原文】
${safeSourceText}

【規則】
- 必須繁體中文（台灣）
- 不可簡體
- 不可亂碼
- 不可 hashtag 出現在 POST
- hashtag 只能在 HASHTAGS

【輸出格式】
[POST]
...
[HASHTAGS]
#xxx #yyy
[END]
`;

      const res = await callGroqWithRotation({
        model: "qwen/qwen3-32b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 1200,
      });

      if (!res.ok) {
        return NextResponse.json(res, { status: res.status });
      }

      const answer = res.data?.choices?.[0]?.message?.content || "";
      lastRaw = answer;

      const result = extractPostAndHashtags(answer);

      if (!result) continue;

      // ✔ OpenCC（保留，但安全）
      let post = result.post;
      let hashtags = result.hashtags;

      try {
        post = toTaiwanTraditional(post);
        hashtags = toTaiwanTraditional(hashtags);
      } catch {}

      // ✔ 亂碼檢查
      if (hasBadText(post) || hasBadText(hashtags)) continue;

      // ✔ hashtag 混入檢查（你原本問題）
      if (postHasMixedHashtags(post)) continue;

      parsed = { post, hashtags };
      break;
    }

    if (!parsed) {
      return NextResponse.json(
        { ok: false, error: "解析失敗", raw: lastRaw },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      post: parsed.post,
      hashtags: parsed.hashtags,
      fullPost: `${parsed.post}\n\n${parsed.hashtags}`,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}