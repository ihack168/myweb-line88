import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MODE = "publish-random-3-labels";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "api works",
    mode: MODE,
  });
}

function selectLabels(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const labels = Array.from(
    new Set(
      input
        .filter((label): label is string => typeof label === "string")
        .map((label) => label.trim())
        .filter((label) => label.length > 0)
    )
  );

  if (labels.length <= 3) {
    return labels;
  }

  // Fisher–Yates 隨機洗牌，再取 3 個不重複標籤。
  for (let i = labels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [labels[i], labels[j]] = [labels[j], labels[i]];
  }

  return labels.slice(0, 3);
}

async function getAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("Google 沒有回傳 access_token");
  }

  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blogId, title, content, labels, account } = body;

    if (!blogId || !title || !content || !account) {
      return NextResponse.json(
        {
          ok: false,
          error: "缺少參數",
        },
        { status: 400 }
      );
    }

    const refreshToken =
      process.env[`GOOGLE_REFRESH_TOKEN_${account}`];

    if (!refreshToken) {
      return NextResponse.json(
        {
          ok: false,
          error: `找不到 GOOGLE_REFRESH_TOKEN_${account}`,
        },
        { status: 400 }
      );
    }

    const selectedLabels = selectLabels(labels);
    const accessToken = await getAccessToken(refreshToken);

    // 直接公開發文，最多使用 3 個標籤。
    const bloggerRes = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?isDraft=false`,
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
          labels: selectedLabels,
        }),
      }
    );

    const text = await bloggerRes.text();

    console.log("Blogger HTTP Status:", bloggerRes.status);
    console.log("Blogger selected labels:", selectedLabels);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          stage: "blogger",
          mode: MODE,
          error: "Google 回傳非 JSON",
          upstreamStatus: bloggerRes.status,
          response: text.substring(0, 1000),
        },
        { status: 502 }
      );
    }

    if (!bloggerRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          stage: "blogger",
          mode: MODE,
          upstreamStatus: bloggerRes.status,
          selectedLabels,
          error: data,
        },
        { status: bloggerRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: MODE,
      selectedLabels,
      postId: data.id,
      url: data.url,
      title: data.title,
      status: data.status,
      published: data.published,
      updated: data.updated,
      selfLink: data.selfLink,
      blog: data.blog,
      raw: data,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: String(e),
      },
      { status: 500 }
    );
  }
}