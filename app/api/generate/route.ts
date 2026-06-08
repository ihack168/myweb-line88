import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomText(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function makeRandomVars() {
  const industries = [
    "醫療健康",
    "法律服務",
    "房地產",
    "室內設計",
    "科技產品",
    "餐飲美食",
    "旅遊住宿",
    "教育課程",
    "金融理財",
    "保險規劃",
    "電商零售",
    "美容保養",
    "健身運動",
    "汽車機車",
    "居家生活",
    "寵物服務",
    "工程維修",
    "企業顧問",
    "人力資源",
    "在地服務",
  ];

  const readerIntents = [
    "了解基礎知識",
    "比較不同方案",
    "尋找價格資訊",
    "確認是否適合自己",
    "查詢注意事項",
    "想知道優缺點",
    "尋找推薦選擇",
    "想解決問題",
    "想快速看懂重點",
    "準備購買或預約",
  ];

  const articleAngles = [
    "新手入門",
    "完整攻略",
    "常見問題",
    "選擇指南",
    "費用解析",
    "注意事項",
    "優缺點比較",
    "流程說明",
    "風險提醒",
    "實用建議",
    "懶人包",
    "專家解析",
    "使用情境",
    "服務比較",
    "決策指南",
  ];

  const tones = [
    "專業可信",
    "自然口語",
    "中性客觀",
    "新手友善",
    "在地化語氣",
    "品牌官網感",
    "顧問解說感",
    "知識型文章",
    "搜尋意圖導向",
    "AEO問答導向",
  ];

  const titleStyles = [
    "疑問句標題",
    "完整攻略標題",
    "數字型標題",
    "比較型標題",
    "解答型標題",
    "避坑型標題",
    "懶人包標題",
    "專家解析標題",
    "新手指南標題",
    "情境需求標題",
  ];

  const structures = [
    "先講結論再展開",
    "問題開場再說明",
    "重點條列再補充",
    "情境導入再解析",
    "FAQ導向架構",
    "比較表概念架構",
    "步驟流程架構",
    "痛點解決架構",
    "購買決策架構",
    "百科說明架構",
  ];

  const paragraphStyles = [
    "短段落",
    "中段落",
    "條列混合",
    "問答混合",
    "說明加提醒",
    "重點摘要式",
    "案例情境式",
    "比較分析式",
  ];

  const vars: string[] = [];

  for (let i = 1; i <= 100; i++) {
    vars.push(
      [
        `random_${i}: ${randomText(rand(16, 48))}`,
        `seed=${Date.now()}-${Math.random()}-${crypto.randomUUID()}`,
        `industry=${pick(industries)}`,
        `readerIntent=${pick(readerIntents)}`,
        `articleAngle=${pick(articleAngles)}`,
        `tone=${pick(tones)}`,
        `titleStyle=${pick(titleStyles)}`,
        `structure=${pick(structures)}`,
        `paragraphStyle=${pick(paragraphStyles)}`,
        `titleLength=${rand(18, 42)}`,
        `h2Count=${rand(4, 9)}`,
        `h3Count=${rand(2, 6)}`,
        `faqCount=${rand(3, 7)}`,
        `listDensity=${pick(["少量條列", "中等條列", "大量條列"])}`,
        `openingStyle=${pick([
          "直接回答",
          "問題切入",
          "情境切入",
          "重點摘要",
          "需求導向",
        ])}`,
        `endingStyle=${pick([
          "總結重點",
          "提醒注意",
          "行動建議",
          "選擇建議",
          "FAQ收尾",
        ])}`,
        `avoidPattern=${randomText(rand(10, 24))}`,
      ].join(" | ")
    );
  }

  return vars.join("\n");
}

export async function POST(req: Request) {
  try {
    const {
      prompt,
      keyword,
      sourceText,
      imageUrl,
      officialUrl,
    } = await req.json();

    const finalKeyword = keyword || prompt || "";

    if (!finalKeyword) {
      return NextResponse.json(
        { error: "缺少 keyword 或 prompt" },
        { status: 400 }
      );
    }

    if (!sourceText) {
      return NextResponse.json(
        { error: "缺少 sourceText 原文" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "缺少 GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const randomVars = makeRandomVars();

    const finalPrompt = `
你是一位專業 SEO / AEO 內容編輯，能撰寫各行各業的網站文章。

請根據「關鍵字」與「原文」重新產生一篇適合網站發布的原創文章。

關鍵字：
${finalKeyword}

原文：
${sourceText}

圖片網址：
${imageUrl || ""}

原文網址：
${officialUrl || ""}

寫作要求：
1. 請改寫成全新原創文章。
2. 不要照抄原文句子。
3. 保留原文重點，但重新組織段落。
4. 不要憑空補充原文沒有的具體數據、價格、法規、療效、保證、優惠或承諾。
5. 產生 SEO 友善標題。
6. 文章要符合搜尋者想知道的問題。
7. 文章可通用於各行各業，包括醫療、法律、房地產、餐飲、旅遊、電商、科技、教育、金融、工程、生活服務等。
8. 語氣自然、專業、可信，不要過度廣告。
9. 使用 h1、h2、h3、p、ul、li。
10. FAQ 請用 h2 加 h3。
11. 不要輸出 markdown。
12. 不要輸出程式碼區塊。
13. 不要輸出說明文字。
14. 直接輸出完整 HTML。

HTML 格式要求：
<h1>文章標題</h1>
<p>開頭段落</p>
<h2>主要段落</h2>
<p>內容</p>
<h2>常見問題</h2>
<h3>問題</h3>
<p>回答</p>

避免：
1. 避免每篇文章都用相同開頭。
2. 避免每篇文章都用相同 H2。
3. 避免每篇文章都用相同 FAQ。
4. 避免使用「近年來」、「隨著時代」、「你是否曾經」這類模板句。
5. 避免誇大、保證、絕對化語氣。
6. 避免寫出原文沒有提供的事實。

以下 100 組亂數變數只用來增加文章變化，不要出現在文章中：

${randomVars}
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
          temperature: 1.35,
          top_p: 0.98,
          frequency_penalty: 0.9,
          presence_penalty: 0.9,
          max_tokens: 8000,
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

    const answer =
      data?.choices?.[0]?.message?.content || "";

    return new Response(answer, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
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