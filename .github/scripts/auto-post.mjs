import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv';

/**
 * [重要] 請在此處貼上你從 Google Apps Script 部署得到的「網頁應用程式 URL」
 */
const GOOGLE_SCRIPT_URL = '你的_APPS_SCRIPT_網頁應用程式網址_貼在這裡';

const POSTS_PER_RUN = 5;

// 1. 抓取 CSV (加上時間戳記避免 Google 快取)
function fetchCSV(url) {
  const finalUrl = `${url}&t=${Date.now()}`;
  return new Promise((resolve, reject) => {
    https.get(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

// 2. 解析 CSV (處理 HTML 內容中的引號與逗號)
function parseCSV(text) {
  const rows = [];
  let currentField = '';
  let inQuotes = false;
  let currentRow = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && inQuotes && text[i + 1] === '"') { currentField += '"'; i++; }
    else if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { currentRow.push(currentField.trim()); currentField = ''; }
    else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentField = ''; currentRow = [];
      }
      if (char === '\r' && text[i + 1] === '\n') i++;
    } else { currentField += char; }
  }
  if (currentRow.length > 0 || currentField) { currentRow.push(currentField.trim()); rows.push(currentRow); }
  return rows;
}

// 3. 發文成功後，回填「published」標記到 Google 試算表
async function markAsPublishedOnSheet(rowIndex) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('貼在這裡')) {
    console.warn('⚠️ 未設定 GOOGLE_SCRIPT_URL，跳過回填標記步驟。');
    return;
  }
  const data = JSON.stringify({ row: rowIndex });
  return new Promise((resolve) => {
    const req = https.request(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      // 處理 Google Script 的重新導向
      if (res.statusCode === 302 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          res2.on('data', () => {});
          res2.on('end', () => resolve());
        });
      } else {
        res.on('data', () => {});
        res.on('end', () => resolve());
      }
    });
    req.on('error', (e) => {
      console.error('❌ 回填標記失敗:', e.message);
      resolve();
    });
    req.write(data);
    req.end();
  });
}

// 4. 解析 F 欄位中的圖片 ID 並轉換為網址
function parseSanityImageUrl(imageRaw) {
  if (!imageRaw || !imageRaw.includes(',')) return null;
  const parts = imageRaw.split(',');
  const imageAssetId = parts[1].trim().replace(/^image-/, '');
  const lastDashIndex = imageAssetId.lastIndexOf('-');
  if (lastDashIndex === -1) return null;
  const finalString = imageAssetId.substring(0, lastDashIndex) + '.' + imageAssetId.substring(lastDashIndex + 1);
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${finalString}`;
}

// 5. 建立 Sanity 文章
async function createPost(title, htmlContent, tags, imageRaw) {
  // 生成短縮且唯一的 Slug，避免 ERR_HTTP2_PROTOCOL_ERROR
  const cleanTitle = title
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '') // 僅保留中英數
    .substring(0, 15); // 限制長度
  const uniqueId = Math.floor(Date.now() / 1000).toString().slice(-6);
  const finalSlug = encodeURIComponent(cleanTitle) + `-${uniqueId}`;

  // 處理 HTML 前置圖片
  let finalHtml = htmlContent;
  const imageUrl = parseSanityImageUrl(imageRaw);
  if (imageUrl) {
    finalHtml = `<img src="${imageUrl}" alt="${title}">\n` + htmlContent;
    console.log(`📸 圖片已插入: ${imageUrl}`);
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

// 主執行流程
async function main() {
  console.log('📥 正在獲取最新試算表資料...');
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  console.log(`📊 掃描完成，共 ${rows.length} 行`);

  const pending = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = row[1]?.trim();
    const published = row[6]?.trim();

    // 跳過標題列、空標題或已發布的文章
    if (!title || title === "標題" || title === "註記" || (published && published.toLowerCase().includes('published'))) {
      continue;
    }

    pending.push({
      rowIndex: i,
      title,
      html: row[2]?.trim(),
      tags: row[3]?.trim(),
      imageRaw: row[5]?.trim()
    });
  }

  if (pending.length === 0) {
    console.log('✅ 目前沒有待處理的新文章。');
    return;
  }

  const toPost = pending.slice(0, POSTS_PER_RUN);
  console.log(`🚀 準備處理 ${toPost.length} 篇文章...`);

  for (const item of toPost) {
    try {
      console.log(`📝 正在發布: ${item.title}`);
      const result = await createPost(item.title, item.html, item.tags, item.imageRaw);
      
      if (result.results || result.mutations) {
        console.log(`✅ Sanity 發布成功，執行試算表標記...`);
        await markAsPublishedOnSheet(item.rowIndex);
      } else {
        console.error(`❌ Sanity API 錯誤:`, JSON.stringify(result));
      }
    } catch (err) {
      console.error(`❌ 處理第 ${item.rowIndex + 1} 行時發生錯誤:`, err.message);
    }
  }
  console.log('🎉 任務結束');
}

main().catch(console.error);