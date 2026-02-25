import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const maxResults = 10;
  const startIndex = (page - 1) * maxResults + 1;

  // 使用 www.line88.tw 抓取後台資料
  const targetUrl = `https://www.line88.tw/feeds/posts/default?alt=json&max-results=${maxResults}&start-index=${startIndex}`;
  
  try {
    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    const data = await response.json();
    const entries = data.feed?.entry || [];
    const totalResults = parseInt(data.feed?.openSearch$totalResults?.$t || '0');

    const posts = entries.map((entry: any) => {
      const content = entry.content?.$t || "";
      
      // 1. 抓取 YouTube ID
      const ytMatch = content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const videoId = ytMatch ? ytMatch[1] : null;
      
      // 2. 抓取第一張圖
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const firstImage = imgMatch ? imgMatch[1] : null;

      // 3. 修正導向網址至 blog.line88.tw
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}