import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}