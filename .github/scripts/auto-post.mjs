import https from 'https';

const SANITY_PROJECT_ID = 't0di9pwy';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

// 只要改這裡，就能切換不同 sheet
const SHEET_NAME = 'line88';

// Google Apps Script 網址
const GOOGLE_SCRIPT_BASE_URL =
  'https://script.google.com/macros/s/AKfycbwFpZDhMveHhdOYdDkh02JpWk28jUCBqikyM-Urg_6Uw2jTH7d8ZluKxinKTWh5_20N/exec';

const GOOGLE_SCRIPT_URL =
  `${GOOGLE_SCRIPT_BASE_URL}?sheet=${encodeURIComponent(SHEET_NAME)}`;

async function fetchNextPost() {
  return new Promise((resolve, reject) => {
    https
      .get(GOOGLE_SCRIPT_URL, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
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
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
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

function parseSanityImageUrl(imageRaw) {
  if (!imageRaw) return null;

  try {
    // 支援：
    // xxx.png, image-xxxxx-1200x800-png
    // 或只有 image-xxxxx-1200x800-png

    const parts = imageRaw.split(',');

    const assetRef = (parts[1] || parts[0]).trim();

    const match = assetRef.match(
      /^image-([a-f0-9]+)-(\d+x\d+)-([a-zA-Z0-9]+)$/
    );

    if (!match) {
      console.warn('⚠️ 無法解析圖片 asset:', imageRaw);
      return null;
    }

    const [, assetId, size, ext] = match;

    return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${assetId}-${size}.${ext}`;
  } catch (error) {
    console.error('❌ parseSanityImageUrl 失敗:', error);
    return null;
  }
}

async function createPost(title, htmlContent, tags, imageRaw) {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]/g, '');

  const shortTitle = cleanTitle.substring(0, 15);

  const uniqueId = Math.floor(Date.now() / 1000)
    .toString()
    .slice(-6);

  const finalSlug =
    encodeURIComponent(shortTitle) + `-${uniqueId}`;

  let finalHtml = htmlContent || '';

  const imageUrl = parseSanityImageUrl(imageRaw);

  console.log('🖼 imageRaw:', imageRaw);
  console.log('🖼 imageUrl:', imageUrl);

  // SEO / AEO 圖片 alt
  const imageAlt = `${title} 示意圖`;

  // 首圖 prepend
  if (imageUrl) {
    finalHtml = `
<p>
  <img
    src="${imageUrl}"
    alt="${imageAlt}"
    loading="lazy"
  />
</p>

${finalHtml}
`;
  }

  console.log(
    '📝 finalHtml preview:',
    finalHtml.substring(0, 500)
  );

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
            reject(
              new Error(`Sanity 回傳 JSON 解析失敗: ${data}`)
            );
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

  const post = await fetchNextPost();
  console.log('🧾 Apps Script 回傳完整 post:', JSON.stringify(post, null, 2));

  if (!post || post.error) {
    console.log('✅ 無待處理文章');
    console.log(post);
    return;
  }

  console.log(`📄 目前 sheet：${post.sheetName || SHEET_NAME}`);
  console.log(`📌 目前列號：${post.row}`);

  const title = post.tabb?.trim();

  const html = post.tabc || '';

  const tags = post.tabd || '';

  const imageRaw = post.tabe || '';

  if (!title || !html) {
    console.log('⚠️ 標題或 HTML 內容是空的，停止發文');
    console.log(post);
    return;
  }

  console.log(`🚀 發布: ${title}`);

  const result = await createPost(
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
    console.warn(
      '⚠️ Sanity 回傳異常:',
      JSON.stringify(result)
    );
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