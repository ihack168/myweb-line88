import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

export async function GET() {
  const content = await redis.get<string>("latest_post");
  return NextResponse.json({ ok: true, content: content || "" });
}