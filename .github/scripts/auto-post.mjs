import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFA7B3pmx70YP1kXfiQj0eLCsJmcN9mfFtVwJtzM5nTLqubzpMPEpNxdtpYYYJrAwobyNg1AAfZhLH/pub?output=csv';

// Google Apps Script 網址
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVOx_tENXE12RhIaY05GcOCfACNBbv956EP7pjDhf8-wgfZOkVtX3hSe6VGfLomlD0/exec';

const POSTS_PER_RUN = 1;

// 1. 抓取 CSV，加時間戳避免快取
function fetchCSV(url) {
  const finalUrl = `${url}&t=${Date.now()}`;

  return new Promise((resolve, reject) => {
    https
      .get(
        finalUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/csv',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return fetchCSV(res.headers.location).then(resolve).catch(reject);
          }

          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      )
      .on('error', reject);
  });
}

// 2. 解析 CSV
function parseCSV(text) {
  const rows = [];
  let currentField = '';
  let inQuotes = false;
  let currentRow = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"' && inQuotes && text[i + 1] === '"') {
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

      if (char === '\r' && text[i + 1] === '\n') i++;
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

// 3. 發文成功後回填標記
async function markAsPublishedOnSheet(rowIndex) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.length < 10) {
    console.warn('⚠️ GOOGLE_SCRIPT_URL 無效，跳過回填。');
    return;
  }

  const data = JSON.stringify({ row: rowIndex });

  return new Promise((resolve) => {
    const req = https.request(
      GOOGLE_SCRIPT_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        if (res.statusCode === 302 && res.headers.location) {
          https
            .get(res.headers.location, (res2) => {
              res2.on('data', () => {});
              res2.on('end', () => resolve());
            })
            .on('error', (e) => {
              console.error('❌ 回填 redirect 失敗:', e.message);
              resolve();
            });
        } else {
          res.on('data', () => {});
          res.on('end', () => resolve());
        }
      }
    );

    req.on('error', (e) => {
      console.error('❌ 回填失敗:', e.message);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

// 4. 解析 Sanity 圖片網址
function parseSanityImageUrl(imageRaw) {
  if (!imageRaw || !imageRaw.includes(',')) return null;

  const parts = imageRaw.split(',');
  const imageAssetId = parts[1].trim().replace(/^image-/, '');
  const lastDashIndex = imageAssetId.lastIndexOf('-');

  if (lastDashIndex === -1) return null;

  const finalString =
    imageAssetId.substring(0, lastDashIndex) +
    '.' +
    imageAssetId.substring(lastDashIndex + 1);

  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${finalString}`;
}

// 5. 建立文章
async function createPost(title, htmlContent, tags, imageRaw) {
  const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').substring(0, 15);
  const uniqueId = Math.floor(Date.now() / 1000).toString().slice(-6);
  const finalSlug = encodeURIComponent(cleanTitle) + `-${uniqueId}`;

  let finalHtml = htmlContent;
  const imageUrl = parseSanityImageUrl(imageRaw);

  if (imageUrl) {
    finalHtml = `<img src="${imageUrl}" alt="${title}">\n` + htmlContent;
  }

  const doc = {
    _type: 'post',
    title,
    slug: {
      _type: 'slug',
      current: finalSlug,
    },
    htmlContent: finalHtml,
    publishedAt: new Date().toISOString(),
    ...(tags
      ? {
          tags: tags
            .split(/[,，]/)
            .map((t) => t.trim())
            .filter(Boolean),
        }
      : {}),
  };

  const body = JSON.stringify({
    mutations: [
      {
        create: doc,
      },
    ],
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: `${SANITY_PROJECT_ID}.api.sanity.io`,
        path: `/v2024-01-01/data/mutate/${SANITY_DATASET}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SANITY_TOKEN}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => (data += chunk));

        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Sanity 回傳 JSON 解析失敗: ${data}`));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('📥 執行中...');

  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);

  const pending = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const title = row[1]?.trim();
    const published = row[6]?.trim();

    if (
      !title ||
      title === '標題' ||
      title === '註記' ||
      (published && published.toLowerCase().includes('published'))
    ) {
      continue;
    }

    pending.push({
      rowIndex: i,
      title,
      html: row[2],
      tags: row[3],
      imageRaw: row[5],
    });
  }

  if (pending.length === 0) {
    console.log('✅ 無待處理文章');
    return;
  }

  const toPost = pending.slice(0, POSTS_PER_RUN);

  for (const item of toPost) {
    console.log(`🚀 發布: ${item.title}`);

    const result = await createPost(item.title, item.html, item.tags, item.imageRaw);

    if (result.results || result.mutations) {
      console.log('✅ Sanity 成功，執行回填...');
      await markAsPublishedOnSheet(item.rowIndex);
      console.log('✅ Google Sheet 回填完成');
    } else {
      console.warn('⚠️ Sanity 回傳異常:', JSON.stringify(result));
    }
  }
}

main()
  .then(() => {
    console.log('✅ 全部流程完成，準備結束');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 主流程失敗:', error);
    process.exit(1);
  });

// Last Update: GitHub Actions explicit exit version