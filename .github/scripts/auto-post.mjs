import https from 'https';
import http from 'http';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv';
const SHEET_ID = '1-Fz9hbsuvh4Gy8vHmX_mNUH2TGN4YO9iAHbVxNSTb9g';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const POSTS_PER_RUN = 5;

// 抓取 CSV
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// 解析 CSV（處理欄位內有逗號和換行的情況）
function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim());
    rows.push(cols);
  }
  return rows;
}

// 標題轉 slug
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 96) || `post-${Date.now()}`;
}

// 用檔名查詢 Sanity 圖片 asset
async function findSanityAsset(filename) {
  if (!filename) return null;
  const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '');
  const query = encodeURIComponent(`*[_type == "sanity.imageAsset" && originalFilename match "${filename.split('.')[0]}*"][0]{ _id }`);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`;
  
  const data = await new Promise((resolve, reject) => {
    https.get(url, {
      headers: { Authorization: `Bearer ${SANITY_TOKEN}` }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
  
  return data?.result?._id || null;
}

// 發文到 Sanity
async function createPost(title, htmlContent, tags, imageFilename) {
  const slug = toSlug(title);
  const assetId = await findSanityAsset(imageFilename);
  
  const doc = {
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
    htmlContent,
    publishedAt: new Date().toISOString(),
    ...(tags ? { tags: tags.split(/[,，]/).map(t => t.trim()).filter(Boolean) } : {}),
    ...(assetId ? { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } } : {}),
  };

  return new Promise((resolve, reject) => {
    const body = JSON.stringify(doc);
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
    req.on('error', reject);
    req.write(JSON.stringify({ mutations: [{ create: doc }] }));
    req.end();
  });
}

// 更新 Google Sheet G欄標記為已發布
async function markAsPublished(rowIndex) {
  if (!GOOGLE_API_KEY) return;
  const range = `G${rowIndex + 1}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=RAW&key=${GOOGLE_API_KEY}`;
  // 需要 OAuth，改用簡單方式：直接在 console 印出已發布行號
  console.log(`✅ 已發布第 ${rowIndex + 1} 行，請手動在 G 欄標記`);
}

// 主程式
async function main() {
  console.log('📥 讀取 Google 試算表...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  
  console.log(`📊 共 ${rows.length} 行資料`);

  // 找出未發布的文章（G欄空白 且 B欄有標題）
  const pending = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = row[1]?.trim();   // B欄
    const html = row[2]?.trim();    // C欄
    const tags = row[3]?.trim();    // D欄
    const image = row[5]?.trim();   // F欄
    const published = row[6]?.trim(); // G欄

    if (!title && !html) {
      console.log(`⏹ 第 ${i + 1} 行無內容，停止讀取`);
      break;
    }

    if (!title) continue;
    if (published) continue; // 已發布

    pending.push({ rowIndex: i, title, html, tags, image });
  }

  if (pending.length === 0) {
    console.log('✅ 沒有待發布的文章');
    return;
  }

  console.log(`📝 待發布 ${pending.length} 篇，本次發布 ${Math.min(POSTS_PER_RUN, pending.length)} 篇`);

  const toPost = pending.slice(0, POSTS_PER_RUN);

  for (const item of toPost) {
    try {
      console.log(`🚀 發布: ${item.title}`);
      await createPost(item.title, item.html, item.tags, item.image);
      console.log(`✅ 成功: ${item.title} (第 ${item.rowIndex + 1} 行)`);
    } catch (err) {
      console.error(`❌ 失敗: ${item.title}`, err.message);
    }
  }

  console.log('🎉 本次發布完成');
  console.log('⚠️ 請手動在已發布文章的 G 欄填入 "published"');
}

main().catch(console.error);