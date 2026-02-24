import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
  
  try {
    // 伺服器端請求，不受瀏覽器 CORS 限制
    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // 每分鐘更新一次快取
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Blogger API 無法回應' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: '伺服器內部錯誤' }, { status: 500 });
  }
}