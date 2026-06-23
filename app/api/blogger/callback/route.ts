import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "沒有授權碼" }, { status: 400 });
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "https://www.line88.tw/api/blogger/callback",
      grant_type: "authorization_code",
    }).toString(),
  });

  const data = await res.json();

  if (!data.refresh_token) {
    return NextResponse.json({ error: "沒有拿到 refresh_token", data }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    refresh_token: data.refresh_token,
    message: "請把 refresh_token 存到 Vercel 環境變數",
  });
}