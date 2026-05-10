import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_ID = '1-Fz9hbsuvh4Gy8vHmX_mNUH2TGN4YO9iAHbVxNSTb9g';
// 強制導出最新的 CSV 格式
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0&t=${Date.now()}`;
const POSTS_PER_RUN = 5;

// 支援自動處理重新導向的抓取函式
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // 如果遇到重新導向 (301/302)，自動追蹤新網址
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchCSV(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCSV(text) {
  const rows = [];
  let currentField = '';
  let inQuotes = false;
  let currentRow = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"' && inQuotes && nextChar === '"') {
      currentField += '"'; i++;
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

async function createPost(title, htmlContent, tags, imageFilename) {
  const slug = encodeURIComponent(title.toLowerCase().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, '').replace(/[\s_]+/g, '-')).substring(0, 96);
  const doc = {
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug || `post-${Date.now()}` },
    htmlContent,
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

async function main() {
  console.log('📥 正在從 Google Sheets 導出資料...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  
  // 檢查是否抓到了真正的資料而不是 HTML
  if (csv.includes('<!DOCTYPE html>') || csv.includes('<HTML>')) {
    console.error('❌ 抓取失敗：Google 回傳了網頁內容而非 CSV 資料。請確認試算表共用權限為「知道連結的人皆可檢視」。');
    return;
  }

  console.log(`📊 成功抓取資料，共 ${rows.length} 行`);

  // 除錯：印出第一行資料確認欄位
  if (rows.length > 0) console.log(`DEBUG 第一行內容:`, JSON.stringify(rows[0]));

  const pending = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    const title = row[1]?.trim();     // B 欄
    const html = row[2]?.trim();      // C 欄
    const published = row[6]?.trim(); // G 欄

    if (!title || title === "標題" || title === "註記") continue;
    if (published && published.toLowerCase().includes('published')) continue;

    pending.push({ rowIndex: i, title, html });
  }

  if (pending.length === 0) {
    console.log('✅ 目前沒有待發布的文章。');
    return;
  }

  const limit = Math.min(POSTS_PER_RUN, pending.length);
  console.log(`🚀 準備發布 ${limit} 篇文章...`);

  for (let i = 0; i < limit; i++) {
    const item = pending[i];
    try {
      console.log(`📝 發布中: ${item.title}`);
      const result = await createPost(item.title, item.html);
      if (result.results || result.mutations) {
        console.log(`✅ 成功 (第 ${item.rowIndex + 1} 行)`);
      } else {
        console.error(`❌ API 錯誤:`, JSON.stringify(result));
      }
    } catch (err) {
      console.error(`❌ 執行失敗: ${item.title}`, err.message);
    }
  }
}

main().catch(console.error);