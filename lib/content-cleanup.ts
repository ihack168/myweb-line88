/**
 * 去除 htmlContent 開頭跟頁面自己渲染的標題/主圖重複的部分
 * @param hasMainImage 頁面上方是否已經渲染過 mainImage 主圖 —— 只有在有主圖時,才砍掉內文開頭的圖片
 */
export function stripDuplicateLeadContent(
  html: string,
  title: string,
  hasMainImage: boolean
): string {
  if (!html) return html;

  let result = html.trim();

  // 正規化字串比對用(去空白、標點差異)
  const normalize = (s: string) =>
    s.replace(/\s+/g, "").replace(/[「」『』"'：:，,。.]/g, "");

  const normalizedTitle = normalize(title || "");

  // 1) 開頭如果是 <h1>...</h1>,且文字跟 title 相同或高度相似 -> 砍掉
  const h1Match = result.match(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*/i);
  if (h1Match) {
    const h1Text = h1Match[1].replace(/<[^>]+>/g, "");
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

  // 2) 只有「頁面上方確實有渲染主圖」時,才砍掉內文開頭重複的圖片
  //    沒有主圖的文章,內文開頭的圖片是需要保留的內容,不能砍
  if (hasMainImage) {
    const figureMatch = result.match(/^\s*<figure[^>]*>[\s\S]*?<\/figure>\s*/i);
    if (figureMatch) {
      result = result.slice(figureMatch[0].length).trim();
    } else {
      const imgMatch = result.match(/^\s*<img[^>]*\/?>\s*/i);
      if (imgMatch) {
        result = result.slice(imgMatch[0].length).trim();
      }
    }

    const pWrappedImgMatch = result.match(/^\s*<p>\s*<img[^>]*\/?>\s*<\/p>\s*/i);
    if (pWrappedImgMatch) {
      result = result.slice(pWrappedImgMatch[0].length).trim();
    }
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

  const parts = html.split(/(<[^>]+>)/);

  return parts
    .map((part, i) => {
      const isTag = i % 2 === 1;
      if (isTag) return part;
      return part.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    })
    .join("");
}

/**
 * 整合處理:清洗完整的 htmlContent
 * @param hasMainImage 頁面上方是否已渲染主圖,決定要不要砍內文開頭的重複圖片
 */
export function sanitizePostHtml(
  html: string,
  title: string,
  hasMainImage: boolean
): string {
  if (!html) return html;
  let result = stripDuplicateLeadContent(html, title, hasMainImage);
  result = demoteLeadingH1(result);
  result = convertLeftoverMarkdownBold(result);
  return result;
}