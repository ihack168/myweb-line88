import https from 'https';

const SANITY_PROJECT_ID = 'oo1n2doq';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

// 只要改這裡，就能切換不同 sheet
const SHEET_NAME = 'line88';

// Google Apps Script 網址
const GOOGLE_SCRIPT_BASE_URL =
  'https://script.google.com/macros/s/AKfycbzJO4OjtVfURgK-s5KT9v4zVtUbwFFyzpmeSNBDlMg2Ka155-wSztYr7PJ4ZwH2VOtC/exec';

const GOOGLE_SCRIPT_URL =
  `${GOOGLE_SCRIPT_BASE_URL}?sheet=${encodeURIComponent(SHEET_NAME)}`;

async function fetchNextPost() {
  return new Promise((resolve, reject) => {
    https
      .get(GOOGLE_SCRIPT_URL, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https
            .get(res.headers.location, (res2) => {
              let data = '';
              res2.on('data', (chunk) => (data += chunk));
              res2.on('end', () => {
                try {
                  resolve(JSON.parse(data));
                } catch (err) {
                  reject(new Error(`Apps Script JSON 解析失敗: ${data}`));
                }
              });
            })
            .on('error', reject);

          return;
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error(`Apps Script JSON 解析失敗: ${data}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function markAsPublishedOnSheet(rowNumber) {
  const data = JSON.stringify({ row: rowNumber });

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
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https
            .get(res.headers.location, (res2) => {
              res2.on('data', () => {});
              res2.on('end', () => resolve());
            })
            .on('error', (e) => {
              console.error('❌ 回填 redirect 失敗:', e.message);
              resolve();
            });

          return;
        }

        res.on('data', () => {});
        res.on('end', () => resolve());
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

function getSafePostCount(value) {
  const count = Number(value);

  if (!count || isNaN(count) || count < 1) {
    return 1;
  }

  return Math.floor(count);
}

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

async function createPost(title, htmlContent, tags, imageRaw) {
  const cleanTitle =
    title
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');

  const shortTitle = cleanTitle.substring(0, 15);
  const uniqueId = Math.floor(Date.now() / 1000).toString().slice(-6);
  const finalSlug = encodeURIComponent(shortTitle) + `-${uniqueId}`;

  let finalHtml = htmlContent || '';
  const imageUrl = parseSanityImageUrl(imageRaw);

  if (imageUrl) {
    finalHtml = `<img src="${imageUrl}" alt="${title}">\n` + finalHtml;
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
  console.log(`📥 從 Apps Script 讀取 sheet：${SHEET_NAME}`);

  const firstPost = await fetchNextPost();

  if (!firstPost || firstPost.error) {
    console.log('✅ 無待處理文章');
    console.log(firstPost);
    return;
  }

  const postCount = getSafePostCount(firstPost.postCount);

  console.log(`📝 A6 設定本次發文數量：${firstPost.postCount}`);
  console.log(`🚀 本次實際預計發 ${postCount} 篇`);

  for (let i = 0; i < postCount; i++) {

    console.log(`\n====================`);
    console.log(`🚀 第 ${i + 1} 篇 / 共 ${postCount} 篇`);
    console.log(`====================`);

    const post =
      i === 0
        ? firstPost
        : await fetchNextPost();

    if (!post || post.error) {
      console.log('✅ 無待處理文章');
      console.log(post);
      break;
    }

    console.log(`📄 目前 sheet：${post.sheetName || SHEET_NAME}`);
    console.log(`📌 目前列號：${post.row}`);
    console.log(`📌 A4 指定列：${post.a4}`);

    const title = String(post.a4title || '').trim();
    const html = String(post.a4html || '').trim();
    const tags = String(post.a4tags || '').trim();
    const imageRaw = String(post.a4image || '').trim();

    if (!title || !html) {
      console.log('⚠️ 標題或 HTML 內容是空的，停止發文');
      console.log(post);
      break;
    }

    console.log(`🚀 發布: ${title}`);

    const result =
      await createPost(
        title,
        html,
        tags,
        imageRaw
      );

    if (result.results || result.mutations) {
      console.log('✅ Sanity 成功，執行回填...');
      await markAsPublishedOnSheet(post.row);
      console.log('✅ Google Sheet 回填完成');
    } else {
      console.warn('⚠️ Sanity 回傳異常:', JSON.stringify(result));
      break;
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