import { NextResponse } from "next/server";
import { Converter } from "opencc-js";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

// 簡體中文轉台灣繁體中文
const toTaiwanTraditional = Converter({ from: "cn", to: "twp" });

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL =
  process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

const MAX_ATTEMPTS = 5;
const SOURCE_TEXT_MAX_LENGTH = 1800;
const MAX_COMPLETION_TOKENS = 2400;

type Platform = "fb" | "threads";

type GroqCallResult = {
  ok: boolean;
  status: number;
  data: any;
  usedKeyIndex: number | null;
};

type GeneratedPost = {
  post: string;
  hashtags: string;
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

function toBase64Utf8(value: string) {
  return Buffer.from(value || "", "utf8").toString("base64");
}

function hasBadText(value: string) {
  return (
    value.includes("\uFFFD") ||
    /\?{2,}/.test(value) ||
    /□+/.test(value)
  );
}

function getGroqApiKeys() {
  return String(
    process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || ""
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizePlatform(value: unknown): Platform {
  return value === "threads" ? "threads" : "fb";
}

function makeSocialStyle(platform: Platform) {
  const isThreads = platform === "threads";

  return {
    hook: pick([
      "用一個反直覺的問題開場",
      "用讓人意外的數字或事實開場",
      "用短短一句話製造懸念",
      "用生活中常見的誤解開場",
      "用情境代入感開場，例如「你是不是也……」",
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
      "一段鉤子，加上兩至三個重點，再以互動問題結尾",
      "情境代入，加上核心資訊，再呼籲互動",
      "先拋出問題，再提供解答與延伸思考",
      "使用短句堆疊，製造閱讀節奏",
    ]),
    emojiDensity: pick([
      "適度使用 2 至 4 個 emoji 增加視覺節奏",
      "每個主要重點前放一個 emoji",
    ]),
    hashtagCount: rand(2, 3),
    maxWords: isThreads ? rand(120, 200) : rand(180, 280),
  };
}

function removeHashtagsFromPost(text: string) {
  return text.replace(/#[\p{L}\p{N}_]+/gu, "").trim();
}

function normalizeHashtags(text: string, maxCount: number) {
  const matches = text.match(/#[\p{L}\p{N}_]+/gu) || [];
  const unique = [...new Set(matches)];

  return unique.slice(0, maxCount).join(" ");
}

function extractMessageContent(message: any) {
  const content = message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

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

function stripMarkdownCodeFence(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseGeneratedPost(text: string): GeneratedPost | null {
  if (!text?.trim()) return null;

  const cleaned = stripMarkdownCodeFence(text);

  // 主要解析方式：JSON
  try {
    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed?.post === "string" &&
      typeof parsed?.hashtags === "string" &&
      parsed.post.trim()
    ) {
      return {
        post: parsed.post.trim(),
        hashtags: parsed.hashtags.trim(),
      };
    }
  } catch {
    // 繼續嘗試備援格式
  }

  // 備援解析方式：舊版 [POST] / [HASHTAGS] 格式
  const postMatch = cleaned.match(
    /\[POST\]\s*([\s\S]*?)(?=\[HASHTAGS\]|\[END\]|$)/i
  );
  const hashtagsMatch = cleaned.match(
    /\[HASHTAGS\]\s*([\s\S]*?)(?=\[END\]|$)/i
  );

  if (!postMatch?.[1]?.trim()) {
    return null;
  }

  return {
    post: postMatch[1].trim(),
    hashtags: hashtagsMatch?.[1]?.trim() || "",
  };
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
      error: "Groq 回傳的內容不是有效 JSON",
      rawResponse: rawText.slice(0, 2000),
    };
  }
}

async function callGroqWithRotation(body: Record<string, unknown>) {
  const keys = getGroqApiKeys();

  if (!keys.length) {
    return {
      ok: false,
      status: 500,
      data: {
        error: "缺少 GROQ_API_KEYS 或 GROQ_API_KEY 環境變數",
      },
      usedKeyIndex: null,
    } satisfies GroqCallResult;
  }

  const startIndex = Math.floor(Math.random() * keys.length);

  let lastError: unknown = null;
  let lastStatus = 500;
  let lastUsedKeyIndex: number | null = null;

  for (let i = 0; i < keys.length; i++) {
    const keyIndex = (startIndex + i) % keys.length;
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
        } satisfies GroqCallResult;
      }

      lastError = data;
      lastStatus = res.status;

      // 這些狀態碼可換下一把 API Key 重試
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
      } satisfies GroqCallResult;
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
  } satisfies GroqCallResult;
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json().catch(() => null);

    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "請求內容不是有效 JSON",
        },
        { status: 400 }
      );
    }

    const keyword =
      typeof requestBody.keyword === "string"
        ? requestBody.keyword.trim()
        : "";

    const sourceText =
      typeof requestBody.sourceText === "string"
        ? requestBody.sourceText.trim()
        : "";

    const officialUrl =
      typeof requestBody.officialUrl === "string"
        ? requestBody.officialUrl.trim()
        : "";

    const finalPlatform = normalizePlatform(requestBody.platform);

    if (!keyword || !sourceText) {
      return NextResponse.json(
        {
          ok: false,
          error: "缺少 keyword 或 sourceText",
        },
        { status: 400 }
      );
    }

    const safeSourceText = limitText(sourceText);

    let parsed: GeneratedPost | null = null;
    let lastRaw = "";
    let lastFailReason: unknown = null;
    let lastUsedKeyIndex: number | null = null;
    let lastUsedModel = GROQ_MODEL;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const style = makeSocialStyle(finalPlatform);
      const model = GROQ_MODEL;

      lastUsedModel = model;

      const prompt = `
請根據以下資料，撰寫一篇適合 ${
        finalPlatform === "threads" ? "Threads" : "Facebook"
      } 的台灣繁體中文社群貼文。

【關鍵字】
${keyword}

【參考資料】
${safeSourceText}

【寫作要求】
- 使用台灣繁體中文。
- 禁止使用簡體中文。
- 不可出現亂碼。
- 不可捏造參考資料中沒有的重要事實。
- 貼文正文不可包含 hashtag。
- hashtags 欄位只能放 hashtag。
- 不要加入網址。
- 不要輸出 Markdown 程式碼區塊。
- 不要輸出 JSON 以外的說明文字。

【文章風格】
- 開場方式：${style.hook}
- 內容角度：${style.angle}
- 語氣：${style.tone}
- 結尾方式：${style.cta}
- 結構：${style.structure}
- Emoji：${style.emojiDensity}
- 目標字數：約 ${style.maxWords} 字
- Hashtag 數量：${style.hashtagCount} 個

請輸出以下 JSON 結構：
{
  "post": "完整社群貼文正文",
  "hashtags": "#標籤一 #標籤二"
}
`;

      const groqResult = await callGroqWithRotation({
        model,
        messages: [
          {
            role: "system",
            content:
              "你是台灣社群內容編輯。請嚴格輸出符合指定 Schema 的 JSON，不要加入其他文字。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "social_post",
            strict: true,
            schema: {
              type: "object",
              properties: {
                post: {
                  type: "string",
                  description: "社群貼文正文，不可包含 hashtag",
                },
                hashtags: {
                  type: "string",
                  description: "以空格分隔的 hashtag",
                },
              },
              required: ["post", "hashtags"],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: "low",
        include_reasoning: false,
        temperature: 0.8,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
      });

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
      const answer = extractMessageContent(message);

      lastRaw = answer;

      if (!answer) {
        lastFailReason = {
          attempt,
          reason: "模型回傳空 content",
          finishReason: choice?.finish_reason || null,
          reasoningLength:
            typeof message?.reasoning === "string"
              ? message.reasoning.length
              : 0,
          usage: groqResult.data?.usage || null,
          responseKeys:
            groqResult.data && typeof groqResult.data === "object"
              ? Object.keys(groqResult.data)
              : [],
        };
        continue;
      }

      const result = parseGeneratedPost(answer);

      if (!result) {
        lastFailReason = {
          attempt,
          reason: "JSON 或標記格式解析失敗",
          finishReason: choice?.finish_reason || null,
          rawPreview: answer.slice(0, 1000),
          usage: groqResult.data?.usage || null,
        };
        continue;
      }

      let post = toTaiwanTraditional(result.post).trim();
      let hashtags = toTaiwanTraditional(result.hashtags).trim();

      post = removeHashtagsFromPost(post);
      hashtags = normalizeHashtags(hashtags, style.hashtagCount);

      if (!post) {
        lastFailReason = {
          attempt,
          reason: "解析後的貼文正文為空",
          rawPreview: answer.slice(0, 1000),
        };
        continue;
      }

      if (hasBadText(post) || hasBadText(hashtags)) {
        lastFailReason = {
          attempt,
          reason: "偵測到亂碼",
          rawPreview: answer.slice(0, 1000),
        };
        continue;
      }

      parsed = {
        post,
        hashtags,
      };

      break;
    }

    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: "解析失敗",
          raw: lastRaw,
          lastFailReason,
          usedModel: lastUsedModel,
          usedKeyIndex: lastUsedKeyIndex,
        },
        { status: 500 }
      );
    }

    const fullPost = [
      parsed.post,
      officialUrl,
      parsed.hashtags,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await redis.set("latest_post", parsed.post);
    } catch (redisError) {
      console.error("Redis 儲存失敗：", redisError);
    }

    return NextResponse.json({
      ok: true,
      post: parsed.post,
      hashtags: parsed.hashtags,
      fullPost,
      usedModel: lastUsedModel,
      usedKeyIndex: lastUsedKeyIndex,
      postBase64: toBase64Utf8(parsed.post),
      hashtagsBase64: toBase64Utf8(parsed.hashtags),
      fullPostBase64: toBase64Utf8(fullPost),
    });
  } catch (error) {
    console.error("產文 API 發生錯誤：", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
