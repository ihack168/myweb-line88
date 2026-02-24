// app/api/blog/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
  try {
    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}