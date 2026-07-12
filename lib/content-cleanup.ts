/**
 * 去除 htmlContent 開頭跟頁面自己渲染的標題/主圖重複的部分
 */
export function stripDuplicateLeadContent(html: string, title: string): string {
  if (!html) return html;

  let result = html.trim();

  // 正規化字串比對用(去空白、標點差異)
  const normalize = (s: string) =>
    s.replace(/\s+/g, "").replace(/[「」『』"'：:，,。.]/g, "");

  const normalizedTitle = normalize(title || "");

  // 1) 開頭如果是 <h1>...</h1>,且文字跟 title 相同或高度相似 -> 砍掉
  const h1Match = result.match(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*/i);
  if (h1Match) {
    const h1Text = h1Match[1].replace(/<[^>]+>/g, ""); // 去掉內層標籤取純文字
    const normalizedH1 = normalize(h1Text);
    if (
      normalizedTitle &&
      (normalizedH1 === normalizedTitle ||
        normalizedH1.includes(normalizedTitle) ||
        normalizedTitle.includes(normalizedH1))
    ) {
      result = result.slice(h1Match[0].length).trim();
    }
  }

  // 2) 開頭如果緊接著是圖片(<img> 或 <figure><img>...</figure>) -> 砍掉
  //    因為主圖 mainImage 已經在頁面上方渲染過一次
  const figureMatch = result.match(/^\s*<figure[^>]*>[\s\S]*?<\/figure>\s*/i);
  if (figureMatch) {
    result = result.slice(figureMatch[0].length).trim();
  } else {
    const imgMatch = result.match(/^\s*<img[^>]*\/?>\s*/i);
    if (imgMatch) {
      result = result.slice(imgMatch[0].length).trim();
    }
  }

  // 3) 有些 AI 產文會把 <p><img ...></p> 當作第一段,也一併處理
  const pWrappedImgMatch = result.match(/^\s*<p>\s*<img[^>]*\/?>\s*<\/p>\s*/i);
  if (pWrappedImgMatch) {
    result = result.slice(pWrappedImgMatch[0].length).trim();
  }

  return result;
}

/**
 * 把內文開頭第一個 <h1> 降級成 <h2>
 * 避免頁面上方已經有一個 <h1>{post.title}</h1>,內文又帶一個 <h1>,造成一頁兩個 H1
 */
export function demoteLeadingH1(html: string): string {
  if (!html) return html;
  const h1Match = html.match(/^\s*<h1([^>]*)>([\s\S]*?)<\/h1>/i);
  if (!h1Match) return html;

  const [fullMatch, attrs, innerText] = h1Match;
  const replaced = `<h2${attrs}>${innerText}</h2>`;
  return html.slice(0, h1Match.index) + replaced + html.slice((h1Match.index || 0) + fullMatch.length);
}

/**
 * 轉換內容中殘留、未被正確轉成 <strong> 的 markdown 粗體語法 **text**
 * 只處理標籤「外面」的文字節點,避免污染到屬性(如 alt="**xxx**")或既有標籤結構
 */
export function convertLeftoverMarkdownBold(html: string): string {
  if (!html) return html;

  // 用標籤切開字串,只處理非標籤片段(index 為偶數的部分是純文字)
  const parts = html.split(/(<[^>]+>)/);

  return parts
    .map((part, i) => {
      const isTag = i % 2 === 1;
      if (isTag) return part;

      // 純文字節點:轉換 **text** -> <strong>text</strong>
      return part.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    })
    .join("");
}

/**
 * 整合處理:清洗完整的 htmlContent
 */
export function sanitizePostHtml(html: string, title: string): string {
  if (!html) return html;
  let result = stripDuplicateLeadContent(html, title); // 標題文字相同 → 整段砍掉
  result = demoteLeadingH1(result);                    // 標題文字不同 → 降級成 <h2>,避免雙 H1
  result = convertLeftoverMarkdownBold(result);
  return result;
}