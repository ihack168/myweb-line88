import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
  
  try {
    const response = await fetch(targetUrl, {
      // 伺服器端抓取可以設定快取，效能更好
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) throw new Error('Blogger response was not ok');
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogger data' }, { status: 500 });
  }
}