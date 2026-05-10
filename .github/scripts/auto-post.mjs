import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

// 換回原本的 pub 連結，但我們用程式強制它不使用快取
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv';
const POSTS_PER_RUN = 5;

function fetchCSV(url) {
  // 在網址後方加上時間戳記，這對 Google pub 連結非常有效
  const finalUrl = `${url}&t=${Date.now()}`;
  return new Promise((resolve, reject) => {
    https.get(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/csv'
      }
    }, (res) => {
      // 處理重新導向
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

async function createPost(title, htmlContent, tags) {
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
  console.log('📥 正在讀取 Google Sheets...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  
  if (csv.includes('<!DOCTYPE html>') || csv.includes('<HTML>')) {
    console.log('--- 抓取內容片段 ---');
    console.log(csv.substring(0, 200));
    console.error('❌ 依然抓到 HTML 網頁。這通常是 Google 的安全阻擋。');
    return;
  }

  const rows = parseCSV(csv);
  console.log(`📊 成功抓取資料，共 ${rows.length} 行`);

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