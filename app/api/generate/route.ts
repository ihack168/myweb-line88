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
    wordTarget: rand(700, 1100),
    linkText: pick([
      "可以參考這篇整理",
      "這裡有更完整的介紹",
      "想看完整資訊可以看這篇",
      "相關整理可以看這裡",
      "延伸閱讀可以看這篇",
    ]),
  };
}

function extractJsonObject(text: string) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first === -1 || last === -1 || last <= first) return null;

  try {
    return JSON.parse(text.slice(first, last + 1));
  } catch {
    return null;
  }
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

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "缺少 GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const safeSourceText = limitText(sourceText, 3000);
    const style = makeWritingStyle();

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

【輸出格式】
只能輸出 JSON。
不要輸出說明文字。

JSON 格式必須完全符合：

{
  "title": "文章標題",
  "html": "完整HTML內容"
}

【title 規則】
1. title 只放純文字。
2. title 不要包含 h1。
3. title 要自然包含關鍵字。
4. title 不要太正式，像部落格標題。
`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
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
          max_tokens: 2200,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: data,
        },
        { status: groqRes.status }
      );
    }

    const answer = data?.choices?.[0]?.message?.content || "{}";
    const parsed = extractJsonObject(answer);

    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: "AI 回傳不是合法 JSON",
          raw: answer,
        },
        { status: 500 }
      );
    }

    const title = String(parsed.title || "").trim();
    let html = String(parsed.html || "").trim();

    html = removeAllLinks(html);

if (finalOfficialUrl) {
  const safeUrl = escapeHtmlAttr(finalOfficialUrl);
  const safeLinkText = escapeHtmlAttr(style.linkText);

  const linkHtml =
    `<p><a href="${safeUrl}" target="_blank" rel="nofollow noopener">${safeLinkText}</a></p>`;

  if (html.includes("</div>")) {
    html = html.replace(
      "</div>",
      linkHtml + "\n</div>"
    );
  } else {
    html += "\n" + linkHtml;
  }
}

    if (!title || !html) {
      return NextResponse.json(
        {
          ok: false,
          error: "AI 回傳缺少 title 或 html",
          raw: parsed,
        },
        { status: 500 }
      );
    }

    if (hasBadText(title) || hasBadText(html)) {
      return NextResponse.json(
        {
          ok: false,
          error: "內容含有疑似亂碼",
          title,
          html,
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