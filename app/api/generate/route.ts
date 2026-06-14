import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function limitText(text: string, maxLength = 3000) {
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

function hasBadText(value: string) {
  return (
    value.includes("�") ||
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
    data: {
      ok: false,
      error: "所有 GROQ API KEY 都失敗",
      lastError,
    },
    usedKeyIndex: null,
  };
}

function makeWritingStyle() {
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
    ]),
    structure: pick([
      "先說自己的需求再帶出重點",
      "用生活情境開場",
      "用問題開場再分享心得",
      "先講簡單結論再補充",
      "用比較輕鬆的段落分享",
      "像寫部落格心得文",
    ]),
    articleAngle: pick([
      "使用前可以先了解什麼",
      "怎麼挑比較不容易踩雷",
      "一般人會在意的幾個重點",
      "簡單整理心得與注意事項",
      "從消費者角度看這件事",
      "適合新手快速了解",
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
    h2Count: rand(3, 5),
    faqCount: rand(2, 3),
    wordTarget: rand(800, 1200),
    linkText: pick([
      "可以參考這篇整理",
      "這裡有更完整的介紹",
      "想看完整資訊可以看這篇",
      "相關整理可以看這裡",
      "延伸閱讀可以看這篇",
    ]),
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
    const { prompt, keyword, sourceText, imageUrl, officialUrl } =
      await req.json();

    const finalKeyword = keyword || prompt || "";
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

    const safeSourceText = limitText(sourceText, 2400);

    let parsed: { title: string; html: string } | null = null;
    let lastRaw = "";
    let lastUsedKeyIndex: number | null = null;
    let lastFailReason: any = null;
    let style = makeWritingStyle();

    const MAX_ATTEMPTS = 3;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // 每次重試重新隨機一組風格，避免重複生成同一份壞輸出
      style = makeWritingStyle();

      const finalPrompt = `
你是一位會寫外部部落格文章的內容寫手。

這篇文章用途：
發在外部部落格、生活網站、心得型文章平台，用來自然介紹主題，輔助官網 SEO / AEO。

請根據關鍵字與原文資料，寫一篇「輕鬆、自然、像真人分享」的短篇部落格文章。

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
FAQ數量：約 ${style.faqCount} 個
文章字數：約 ${style.wordTarget} 字

【寫作重點】
1. 文章要像部落客、消費者、一般使用者在分享。
2. 不要寫得太像官網文、新聞稿、百科文。
3. 內容不用太長，簡單好讀即可。
4. 自然帶入關鍵字，不要硬塞。
5. 保留原文重點，但要重新用自己的話寫。
6. 不可照抄原文句子。
7. 不要虛構價格、數據、法規、療效、保證或優惠。
8. 不要用太多專業術語。
9. 不要過度推銷。
10. 不要自行產生任何網址。
11. 不要輸出任何 <a> 連結，外部連結會由程式自動加入。
12. 不要輸出 ???、????、亂碼、替代符號或無意義字元。
13. 如果資料不足，請保守描述，不要硬補。

【HTML規則】
1. html 不要包含 h1。
2. html 第一行先放圖片。
3. 圖片格式：
<img src="${imageUrl || ""}" alt="文章標題 ${finalKeyword}" />
4. 圖片後文章從 p 或 h2 開始都可以。
5. 可使用 h2、h3、p、ul、li、strong。
6. 禁止使用 a 標籤。
7. FAQ 可以有，但不要太長。
8. 不要輸出 markdown。
9. 不要輸出程式碼區塊。
10. <div class="article-content">開始，</div>結束。

【輸出格式（非常重要，請嚴格遵守）】
請只用下面這個純文字格式輸出，不要輸出 JSON、不要加任何說明文字：

[TITLE]
這裡放文章標題（純文字一行，不含 h1）
[HTML]
這裡放完整 HTML 內容
[END]

【title 規則】
1. title 只放純文字。
2. title 不要包含 h1。
3. title 要自然包含關鍵字。
4. title 不要太正式，像部落格標題。
`;

      const groqResult = await callGroqWithRotation({
        model: "qwen/qwen3-32b",
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        temperature: 1.2,
        top_p: 0.95,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
        max_tokens: 3200,
      });

      if (!groqResult.ok) {
        // Groq 整體失敗（key 用盡、額度問題等），直接中止，不重試
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

      parsed = extractTitleAndHtml(answer);

      if (parsed) break;

      lastFailReason = "格式解析失敗，準備重試";
    }

    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: "AI 回傳格式無法解析（已重試多次）",
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

    if (finalOfficialUrl) {
      const safeUrl = escapeHtmlAttr(finalOfficialUrl);
      const safeLinkText = escapeHtmlAttr(style.linkText);

      const linkHtml = `<p><a href="${safeUrl}" target="_blank" rel="nofollow noopener">${safeLinkText}</a></p>`;

      if (/<\/div>\s*$/.test(html)) {
        html = html.replace(/<\/div>\s*$/, linkHtml + "\n</div>");
      } else {
        html += "\n" + linkHtml;
      }
    }

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