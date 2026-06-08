import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function limitText(text: string, maxLength = 4500) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) : text;
}

function makeWritingStyle() {
  return {
    tone: pick([
      "專業可信",
      "自然口語",
      "中性客觀",
      "新手友善",
      "品牌官網感",
      "顧問解說感",
      "知識型文章",
      "AEO問答導向",
      "SEO內容風格",
      "百科說明風格",
    ]),
    structure: pick([
      "先講結論再展開",
      "問題開場再說明",
      "重點條列再補充",
      "情境導入再解析",
      "FAQ導向架構",
      "步驟流程架構",
      "痛點解決架構",
      "購買決策架構",
      "比較分析架構",
      "完整攻略架構",
    ]),
    articleAngle: pick([
      "完整攻略",
      "常見問題",
      "選擇指南",
      "費用解析",
      "注意事項",
      "優缺點比較",
      "流程說明",
      "實用建議",
      "懶人包",
      "專家解析",
      "使用指南",
      "新手入門",
    ]),
    titleStyle: pick([
      "疑問句標題",
      "完整攻略標題",
      "數字型標題",
      "比較型標題",
      "解答型標題",
      "避坑型標題",
      "懶人包標題",
      "專家解析標題",
      "新手指南標題",
    ]),
    openingStyle: pick([
      "直接回答",
      "問題切入",
      "情境切入",
      "重點摘要",
      "需求導向",
    ]),
    h2Count: rand(4, 7),
    faqCount: rand(3, 6),
  };
}

function extractJsonObject(text: string) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first === -1 || last === -1 || last <= first) {
    return null;
  }

  try {
    return JSON.parse(text.slice(first, last + 1));
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, keyword, sourceText, imageUrl, officialUrl } =
      await req.json();

    const finalKeyword = keyword || prompt || "";

    if (!finalKeyword) {
      return NextResponse.json(
        { error: "缺少 keyword 或 prompt" },
        { status: 400 }
      );
    }

    if (!sourceText) {
      return NextResponse.json(
        { error: "缺少 sourceText" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "缺少 GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const safeSourceText = limitText(sourceText, 4500);
    const style = makeWritingStyle();

    const finalPrompt = `
你是一位專業 SEO / AEO 內容編輯。

請根據提供的關鍵字與原文資料，重新撰寫一篇適合網站發布的原創文章。

【關鍵字】
${finalKeyword}

【原文資料】
${safeSourceText}

【參考圖片】
${imageUrl || ""}

【來源網址】
${officialUrl || ""}

【本次文章風格】
語氣：${style.tone}
文章架構：${style.structure}
文章角度：${style.articleAngle}
標題類型：${style.titleStyle}
開頭方式：${style.openingStyle}
H2數量：約 ${style.h2Count} 個
FAQ數量：約 ${style.faqCount} 個

【寫作規則】
1. 改寫為全新原創內容。
2. 不可照抄原文句子。
3. 保留原文重點。
4. 重新整理段落與結構。
5. 合理代入關鍵字。
6. 不要虛構價格、數據、法規、療效或保證內容。
7. 不要使用過度誇張語氣。
8. 適用所有產業。
9. 文章需符合 SEO 與 AEO 需求。

【輸出格式】
只能輸出 JSON。
不要輸出 markdown。
不要輸出說明文字。
不要輸出程式碼區塊。

JSON 格式必須完全符合：

{
  "title": "文章標題",
  "html": "完整HTML內容"
}

【title 規則】
1. title 只放純文字標題。
2. title 不要包含 h1。
3. title 要合理包含關鍵字。

【html 規則】
1. html 不要包含 h1。
2. html 第一行先放圖片。
3. 圖片格式如下：
<img src="${imageUrl || ""}" alt="文章標題 ${finalKeyword}" />
4. 圖片後文章從 h2 開始。
5. 可使用 h2、h3、p、ul、li、strong、a。
6. 如果有來源網址，請合理插入一個外部連結：
<a href="${officialUrl || ""}" target="_blank" rel="nofollow noopener">相關資訊</a>
7. html 必須是一個 JSON 字串，換行請使用 \\n，不要讓 JSON 壞掉。
`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          temperature: 1.05,
          top_p: 0.95,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          max_tokens: 3000,
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
    const html = String(parsed.html || "").trim();

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

    return NextResponse.json({
      title,
      html,
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