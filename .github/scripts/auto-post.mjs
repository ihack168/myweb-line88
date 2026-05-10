import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv';
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
  const lines = text.split(/\r?\n/);
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
  return encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, '') // 支援中文標題
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  ).substring(0, 96) || `post-${Date.now()}`;
}

// 用檔名查詢 Sanity 圖片 asset
async function findSanityAsset(filename) {
  if (!filename || filename.trim() === "") return null;
  const query = encodeURIComponent(`*[_type == "sanity.imageAsset" && originalFilename match "${filename.split('.')[0]}*"][0]{ _id }`);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`;
  
  try {
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
  } catch (e) {
    return null;
  }
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

// 主程式
async function main() {
  console.log('📥 讀取 Google 試算表 (CSV 模式)...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  
  console.log(`📊 掃描到 ${rows.length} 行資料（含標題）`);

  const pending = [];
  // 從第 2 行開始讀取 (i=1)，跳過標題列
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // 欄位對應：B=1, C=2, D=3, F=5, G=6
    const title = row[1]?.trim();     
    const html = row[2]?.trim();      
    const tags = row[3]?.trim();      
    const image = row[5]?.trim();     
    const published = row[6]?.trim(); 

    // 如果這行沒有標題也沒有內容，就跳過這行（不停止讀取）
    if (!title && !html) continue;

    // 如果 G 欄已經有 "published" 字樣，跳過
    if (published && published.toLowerCase().includes('published')) continue;

    // 只要有標題，就加入待發布清單
    if (title) {
      pending.push({ rowIndex: i, title, html, tags, image });
    }
  }

  if (pending.length === 0) {
    console.log('✅ 沒有發現需要發布的文章（請檢查 B 欄是否有標題，且 G 欄是否空白）');
    return;
  }

  const limit = Math.min(POSTS_PER_RUN, pending.length);
  console.log(`📝 待發布總數: ${pending.length}，本次執行前 ${limit} 篇`);

  const toPost = pending.slice(0, POSTS_PER_RUN);

  for (const item of toPost) {
    try {
      console.log(`🚀 正在發布: ${item.title}`);
      const result = await createPost(item.title, item.html, item.tags, item.image);
      
      if (result.results || result.mutations) {
        console.log(`✅ 成功建立文章 (試算表第 ${item.rowIndex + 1} 行)`);
      } else {
        console.error(`❌ API 回傳異常:`, JSON.stringify(result));
      }
    } catch (err) {
      console.error(`❌ 執行失敗: ${item.title}`, err.message);
    }
  }

  console.log('🎉 本次發布流程結束');
  console.log('⚠️ 請記得手動在試算表 G 欄填寫 "published" 以免重複發布。');
}

main().catch(err => {
  console.error('💥 程式崩潰:', err);
  process.exit(1);
});