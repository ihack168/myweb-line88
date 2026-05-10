import https from 'https';
import { google } from 'googleapis'; // 需要在 package.json 加入 "googleapis"

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_ID = '1-Fz9hbsuvh4Gy8vHmX_mNUH2TGN4YO9iAHbVxNSTb9g';
const POSTS_PER_RUN = 5;

// 認證 Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// 1. 抓取資料 (改用 API 抓取更穩定，且無延遲)
async function getSheetData() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:G', // 讀取 A 到 G 欄
  });
  return res.data.values || [];
}

// 2. 標記為已發布 (寫回 G 欄)
async function markAsPublished(rowIndex) {
  const range = `G${rowIndex + 1}`; // 索引從 0 開始，所以 +1
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: range,
    valueInputOption: 'RAW',
    resource: { values: [['published']] },
  });
  console.log(`✅ 已在試算表第 ${rowIndex + 1} 行標記為已發布`);
}

// 3. 處理圖片網址
function parseSanityImageUrl(imageRaw) {
  if (!imageRaw || !imageRaw.includes(',')) return null;
  const parts = imageRaw.split(',');
  const imageAssetId = parts[1].trim().replace(/^image-/, '');
  const lastDashIndex = imageAssetId.lastIndexOf('-');
  const finalString = imageAssetId.substring(0, lastDashIndex) + '.' + imageAssetId.substring(lastDashIndex + 1);
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${finalString}`;
}

// 4. 發送到 Sanity (修正 Slug 重複問題)
async function createPost(title, htmlContent, tags, imageRaw) {
  // 加入隨機 4 碼確保 Slug 唯一
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const baseSlug = encodeURIComponent(title.toLowerCase().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, '').replace(/[\s_]+/g, '-')).substring(0, 80);
  const finalSlug = `${baseSlug}-${randomSuffix}`;

  let finalHtml = htmlContent;
  const imageUrl = parseSanityImageUrl(imageRaw);
  if (imageUrl) {
    finalHtml = `<img src="${imageUrl}" alt="${title}">\n` + htmlContent;
  }

  const doc = {
    _type: 'post',
    title,
    slug: { _type: 'slug', current: finalSlug },
    htmlContent: finalHtml,
    publishedAt: new Date().toISOString(),
    ...(tags ? { tags: tags.split(/[,，]/).map(t => t.trim()).filter(Boolean) } : {}),
  };

  const body = JSON.stringify({ mutations: [{ create: doc }] });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: `${SANITY_PROJECT_ID}.api.sanity.io`,
      path: `/v2024-01-01/data/mutate/${SANITY_DATASET}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SANITY_TOKEN}`,
        'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.write(body);
    req.end();
  });
}

// 主程式
async function main() {
  console.log('📥 透過 API 讀取試算表...');
  const rows = await getSheetData();
  console.log(`📊 共讀取到 ${rows.length} 行資料`);

  const pending = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = row[1]?.trim();     // B
    const html = row[2]?.trim();      // C
    const tags = row[3]?.trim();      // D
    const imageRaw = row[5]?.trim();  // F
    const published = row[6]?.trim(); // G

    if (!title || title === "標題" || published === "published") continue;

    pending.push({ rowIndex: i, title, html, tags, imageRaw });
  }

  if (pending.length === 0) {
    console.log('✅ 所有文章皆已發布，沒有新工作。');
    return;
  }

  const toPost = pending.slice(0, POSTS_PER_RUN);
  for (const item of toPost) {
    try {
      console.log(`🚀 正在發布: ${item.title}`);
      const result = await createPost(item.title, item.html, item.tags, item.imageRaw);
      
      if (result.results || result.mutations) {
        console.log(`✅ Sanity 發布成功`);
        // 關鍵：發布成功後，寫回試算表
        await markAsPublished(item.rowIndex);
      }
    } catch (err) {
      console.error(`❌ 失敗: ${item.title}`, err.message);
    }
  }
}

main().catch(console.error);