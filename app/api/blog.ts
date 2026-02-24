import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
  
  try {
    const response = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 } 
    });

    if (!response.ok) return NextResponse.json({ error: 'Blogger 無回應' }, { status: 500 });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}