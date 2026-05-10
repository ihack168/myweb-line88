import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv';
// 貼上你剛才產生的 Google Apps Script 網址
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVOx_tENXE12RhIaY05GcOCfACNBbv956EP7pjDhf8-wgfZOkVtX3hSe6VGfLomlD0/exec';
const POSTS_PER_RUN = 5;

// 發文成功後，呼叫 Google Script 標記 G 欄
async function markAsPublishedOnSheet(rowIndex) {
  const url = GOOGLE_SCRIPT_URL;
  const data = JSON.stringify({ row: rowIndex });

  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.write(data);
    req.end();
  });
}

function fetchCSV(url) {
  const finalUrl = `${url}&t=${Date.now()}`;
  return new Promise((resolve, reject) => {
    https.get(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/csv'
      }
    }, (res) => {
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
    if (char === '"' && inQuotes && text[i+1] === '"') { currentField += '"'; i++; }
    else if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { currentRow.push(currentField.trim()); currentField = ''; }
    else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentField = ''; currentRow = [];
      }
      if (char === '\r' && text[i+1] === '\n') i++;
    } else { currentField += char; }
  }
  if (currentRow.length > 0 || currentField) { currentRow.push(currentField.trim()); rows.push(currentRow); }
  return rows;
}

async function createPost(title, htmlContent, tags, imageRaw) {
  // 加入隨機尾綴解決 Slug 重複問題
  const uniqueId = Math.floor(Date.now() / 1000).toString().slice(-4);
  const slug = encodeURIComponent(title.toLowerCase().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, '').replace(/[\s_]+/g, '-')).substring(0, 80) + `-${uniqueId}`;

  // 處理圖片
  let finalHtml = htmlContent;
  if (imageRaw && imageRaw.includes(',')) {
    const imageAssetId = imageRaw.split(',')[1].trim().replace(/^image-/, '');
    const lastDash = imageAssetId.lastIndexOf('-');
    const imgUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${imageAssetId.substring(0, lastDash)}.${imageAssetId.substring(lastDash + 1)}`;
    finalHtml = `<img src="${imgUrl}" alt="${title}">\n` + htmlContent;
  }

  const doc = {
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
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

async function main() {
  console.log('📥 正在讀取試算表...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  
  const pending = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = row[1]?.trim();
    const published = row[6]?.trim();
    if (!title || title === "標題" || (published && published.toLowerCase().includes('published'))) continue;
    pending.push({ rowIndex: i, title, html: row[2], tags: row[3], imageRaw: row[5] });
  }

  if (pending.length === 0) {
    console.log('✅ 沒有待處理的文章。');
    return;
  }

  const toPost = pending.slice(0, POSTS_PER_RUN);
  for (const item of toPost) {
    console.log(`🚀 發布: ${item.title}`);
    const result = await createPost(item.title, item.html, item.tags, item.imageRaw);
    if (result.results || result.mutations) {
      console.log(`✅ Sanity 成功，正在回填試算表...`);
      await markAsPublishedOnSheet(item.rowIndex);
    }
  }
}

main().catch(console.error);