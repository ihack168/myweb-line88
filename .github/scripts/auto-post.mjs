import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
// 加上隨機參數 t 嘗試破解 Google CSV 快取
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
  console.log('📥 嘗試抓取最新 CSV 資料...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  
  console.log(`📊 Google 伺服器回傳了 ${rows.length} 行資料`);

  // --- 除錯用：印出前三行的真實內容 ---
  for(let k=0; k<Math.min(3, rows.length); k++) {
    console.log(`DEBUG Row[${k}]:`, JSON.stringify(rows[k]));
  }

  const pending = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    // 如果 A 欄是空的，CSV 有時會從 B 欄當作 row[0]
    // 我們同時檢查 row[0] 跟 row[1]
    const title = (row[1] || row[0])?.trim(); 
    const html = (row[2] || row[1])?.trim();
    const published = (row[6] || row[5])?.trim(); // 檢查 G 欄

    if (!title || title === "標題" || title === "註記") continue;
    if (published && published.toLowerCase().includes('published')) continue;

    pending.push({ rowIndex: i, title, html });
  }

  if (pending.length === 0) {
    console.log('❌ 條件不符：可能標題為空、或 G 欄已有 "published"');
    return;
  }

  console.log(`🚀 發現 ${pending.length} 篇待發，開始處理第一篇: ${pending[0].title}`);
  const result = await createPost(pending[0].title, pending[0].html);
  console.log('✅ 處理結果:', JSON.stringify(result));
}

main().catch(console.error);