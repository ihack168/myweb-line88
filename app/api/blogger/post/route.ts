export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "api works"
  });
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  try {
const body = await req.json();

console.log("收到資料:", body);

const { blogId, title, content, labels, account } = body;

if (!blogId || !title || !content || !account) {
  return NextResponse.json(
    {
      ok: false,
      error: "缺少參數",
      received: body,
      check: {
        blogId: !!blogId,
        title: !!title,
        content: !!content,
        account: !!account,
      }
    },
    { status: 400 }
  );
}

    const refreshToken = process.env[`GOOGLE_REFRESH_TOKEN_${account}`];
    if (!refreshToken) {
      return NextResponse.json(
        { ok: false, error: `找不到 GOOGLE_REFRESH_TOKEN_${account}` },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken(refreshToken);

    const res = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "blogger#post",
          title,
          content,
          labels: Array.isArray(labels) ? labels : [],
        }),
      }
    );

    const text = await res.text();

console.log("Blogger Response:");
console.log(text);

let data;

try {
  data = JSON.parse(text);
} catch {
  return NextResponse.json(
    {
      ok: false,
      error: "Google 回傳非 JSON",
      response: text.substring(0, 1000)
    },
    { status: 500 }
  );
}

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      postId: data.id,
      url: data.url,
      title: data.title,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}