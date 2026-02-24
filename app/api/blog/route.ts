import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // 取得前端傳來的頁碼，預設為第 1 頁
  const page = parseInt(searchParams.get('page') || '1');
  const maxResults = 10;
  const startIndex = (page - 1) * maxResults + 1;

  const targetUrl = `https://www.line88.tw/feeds/posts/default?alt=json&max-results=${maxResults}&start-index=${startIndex}`;
  
  try {
    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    const data = await response.json();
    
    // 計算總文章數 (Blogger 會回傳 totalResults)
    const totalResults = parseInt(data.feed?.openSearch$totalResults?.$t || '0');
    
    return NextResponse.json({
      feed: data.feed,
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