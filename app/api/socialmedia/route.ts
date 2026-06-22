import { NextResponse } from "next/server";
import { Converter } from "opencc-js";

export const dynamic = "force-dynamic";

const toTaiwanTraditional = Converter({ from: "cn", to: "twp" });

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limitText(text: string, maxLength = 1800) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) : text;
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
    return { ok: false, status: 500, data: { error: "缺少 API KEY" } };
  }

  const start = Math.floor(Math.random() * keys.length);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[(start + i) % keys.length];

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json().catch(() => null);

    if (res.ok) {
      return { ok: true, status: 200, data };
    }
  }

  return { ok: false, status: 500, data: { error: "全部 key 失敗" } };
}

function extract(text: string) {
  const cleaned = text
    .replace(/^```[\s\S]*?\n/, "")
    .replace(/```$/, "");

  const post = cleaned.match(/\[POST\]([\s\S]*?)\[HASHTAGS\]/i);
  const tags = cleaned.match(/\[HASHTAGS\]([\s\S]*?)(\[END\]|$)/i);

  if (!post) return null;

  return {
    post: post[1].trim(),
    hashtags: tags ? tags[1].trim() : "",
  };
}

// 🚨 只做「輕度清理」，不再殺掉整個結果
function cleanText(text: string) {
  return text
    .replace(/\uFFFD/g, "")   // 亂碼符號
    .replace(/#+\s*$/gm, "")  // 行尾奇怪 hashtag
    .trim();
}

export async function POST(req: Request) {
  try {
    const { keyword, sourceText } = await req.json();

    if (!keyword || !sourceText) {
      return NextResponse.json(
        { ok: false, error: "缺少參數" },
        { status: 400 }
      );
    }

    const safeSourceText = limitText(sourceText);

    let lastRaw = "";

    for (let i = 0; i < 3; i++) {
      const prompt = `
你是社群小編。

【關鍵字】
${keyword}

【原文】
${safeSourceText}

【規則】
- 繁體中文（台灣）
- hashtag 只能在 HASHTAGS
- POST 不可以出現 #

【輸出】
[POST]
...
[HASHTAGS]
#tag #tag
[END]
`;

      const res = await callGroqWithRotation({
        model: "qwen/qwen3-32b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1200,
      });

      if (!res.ok) continue;

      const text = res.data?.choices?.[0]?.message?.content || "";
      lastRaw = text;

      const parsed = extract(text);
      if (!parsed) continue;

      let post = cleanText(parsed.post);
      let hashtags = cleanText(parsed.hashtags);

      try {
        post = toTaiwanTraditional(post);
        hashtags = toTaiwanTraditional(hashtags);
      } catch {}

      // 🚨 最重要：不要讓 hashtag 汙染 post
      if (post.includes("#")) {
        post = post.split("#")[0].trim();
      }

      if (!post) continue;

      return NextResponse.json({
        ok: true,
        post,
        hashtags,
        fullPost: `${post}\n\n${hashtags}`,
      });
    }

    return NextResponse.json(
      { ok: false, error: "AI 無有效輸出", raw: lastRaw },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}