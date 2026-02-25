import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const maxResults = 10;
  const startIndex = (page - 1) * maxResults + 1;

  // 使用你指定的 Blogger Feed URL
  const targetUrl = `https://www.line88.tw/feeds/posts/default?alt=json&max-results=${maxResults}&start-index=${startIndex}`;
  
  try {
    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    const data = await response.json();
    
    const totalResults = parseInt(data.feed?.openSearch$totalResults?.$t || '0');
    const entries = data.feed?.entry || [];

    // 處理每一篇文章的縮圖與內容
    const posts = entries.map((entry: any) => {
      const content = entry.content?.$t || entry.summary?.$t || "";
      
      // 1. 優先抓取 YouTube 影片 ID
      const ytMatch = content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const videoId = ytMatch ? ytMatch[1] : null;
      
      // 2. 抓取文章內的第一張圖片 (如果沒有 YT)
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const firstImage = imgMatch ? imgMatch[1] : null;

      // 決定最終縮圖 (優先順序: YT > 文章圖 > 預設圖)
      let finalThumbnail = "/blog-placeholder.jpg";
      if (videoId) {
        finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      } else if (firstImage) {
        finalThumbnail = firstImage;
      }

      return {
        id: entry.id?.$t,
        title: entry.title?.$t,
        content: content,
        published: entry.published?.$t,
        updated: entry.updated?.$t,
        link: entry.link?.find((l: any) => l.rel === 'alternate')?.href,
        author: entry.author?.[0]?.name?.$t,
        thumbnail: finalThumbnail,
        isVideo: !!videoId, // 標記是否為影片文章
        category: entry.category?.map((c: any) => c.term) || []
      };
    });
    
    return NextResponse.json({
      posts,
      pagination: {
        total: totalResults,
        currentPage: page,
        totalPages: Math.ceil(totalResults / maxResults)
      }
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}