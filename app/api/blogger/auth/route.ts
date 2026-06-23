import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = "https://www.line88.tw/api/blogger/callback";

  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/blogger",
      access_type: "offline",
      prompt: "consent",
    }).toString();

  return NextResponse.redirect(url);
}