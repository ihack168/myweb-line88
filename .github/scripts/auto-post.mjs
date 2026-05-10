import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
// 加上 t= 參數嘗試強制重新抓取，避開緩存
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv&t=' + Date.now();
const POSTS_PER_RUN = 5;

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// 強化版解析：精準處理 HTML 內容中的逗號與引號
function parseCSV(text) {
  const rows = [];
  let currentField = '';
  let inQuotes = false;
  let currentRow = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentField += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentField = '';
        currentRow = [];
      }
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      currentField += char;
    }
  }
  if (currentRow.length > 0 || currentField) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  return rows;
}

function toSlug(title) {
  return encodeURIComponent(
    title.toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  ).substring(0, 96) || `post-${Date.now()}`;
}

async function findSanityAsset(filename) {
  if (!filename || filename.trim() === "") return null;
  const cleanName = filename.split('.')[0];
  const query = encodeURIComponent(`*[_type == "sanity.imageAsset" && originalFilename match "${cleanName}*"][0]{ _id }`);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`;
  try {
    const data = await new Promise((resolve, reject) => {
      https.get(url, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });
    return data?.result?._id || null;
  } catch (e) { return null; }
}

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
  const body = JSON.stringify({ mutations: [{ create: doc }] });
  return new Promise((resolve, reject) => {
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
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('📥 讀取 Google 試算表...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  
  // 過濾掉真正的空行
  const validRows = rows.filter(r => r.length > 1);
  console.log(`📊 原始資料共 ${rows.length} 行，有效資料共 ${validRows.length} 行`);

  const pending = [];
  // 遍歷所有行，尋找 B 欄有資料且 G 欄未發布的內容
  for (let i = 0; i < validRows.length; i++) {
    const row = validRows[i];
    const title = row[1]?.trim();     // B 欄
    const html = row[2]?.trim();      // C 欄
    const tags = row[3]?.trim();      // D 欄
    const image = row[5]?.trim();     // F 欄
    const published = row[6]?.trim(); // G 欄

    // 1. 跳過沒有標題的行
    if (!title) continue;
    // 2. 跳過可能是標題列或註記列的行
    if (title === "標題" || title === "註記" || title.includes("欄位說明")) continue;
    // 3. 跳過已發布文章
    if (published && published.toLowerCase().includes('published')) continue;

    pending.push({ rowIndex: i, title, html, tags, image });
  }

  if (pending.length === 0) {
    console.log('✅ 目前沒有待發布的文章。');
    console.log('檢查建議：');
    console.log('1. 請確認 B 欄(標題) 是否有內容');
    console.log('2. 請確認 G 欄(狀態) 是否為空白');
    console.log('3. 嘗試在瀏覽器打開 CSV 網址，看是否能看到那 100 行資料');
    return;
  }

  const limit = Math.min(POSTS_PER_RUN, pending.length);
  console.log(`📝 發現 ${pending.length} 篇待發，準備處理前 ${limit} 篇...`);

  for (let i = 0; i < limit; i++) {
    const item = pending[i];
    try {
      console.log(`🚀 正在發布: ${item.title}`);
      const result = await createPost(item.title, item.html, item.tags, item.image);
      if (result.results || result.mutations) {
        console.log(`✅ 成功 (索引行號 ${item.rowIndex + 1})`);
      } else {
        console.error(`❌ API 錯誤:`, JSON.stringify(result));
      }
    } catch (err) {
      console.error(`❌ 執行失敗: ${item.title}`, err.message);
    }
  }
  console.log('🎉 本次任務結束');
}

main().catch(err => {
  console.error('💥 程式崩潰:', err);
  process.exit(1);
});