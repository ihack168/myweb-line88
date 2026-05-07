import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const maxResults = 6;
  const startIndex = (page - 1) * maxResults + 1;

  // 加上 timestamp 防止快取導致抓不到資料
  const targetUrl = `https://blog.line88.tw/feeds/posts/default?alt=json&max-results=${maxResults}&start-index=${startIndex}&t=${Date.now()}`;
  
  try {
    // 這裡改用 cache: 'no-store' 確保資料即時抓取，不被舊的 10 篇資料快取擋住
    const response = await fetch(targetUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Blogger API response was not ok');
    }

    const data = await response.json();
    
    // 檢查是否有文章，如果沒有 entry 則給予空陣列避免 map 噴錯
    const entries = data.feed?.entry || [];
    const totalResults = parseInt(data.feed?.openSearch$totalResults?.$t || '0');

    const posts = entries.map((entry: any) => {
      const content = entry.content?.$t || "";
      
      const ytMatch = content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const videoId = ytMatch ? ytMatch[1] : null;
      
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const firstImage = imgMatch ? imgMatch[1] : null;

      let originalLink = entry.link?.find((l: any) => l.rel === 'alternate')?.href || "";
      const correctLink = originalLink.replace("www.line88.tw", "blog.line88.tw");

      return {
        id: entry.id?.$t,
        title: entry.title?.$t,
        content: content,
        link: correctLink,
        thumbnail: videoId 
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
          : (firstImage || "/blog-placeholder.jpg"),
        videoId: videoId,
        tags: entry.category?.map((c: any) => c.term) || []
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
    return NextResponse.json({ posts: [], error: 'Internal Server Error' }, { status: 500 });
  }
}