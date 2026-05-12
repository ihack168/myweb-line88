import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Line AI 官方帳號客服系統 | ChatGPT / Gemini 串接 | 洛克希德黑克斯",

  description:
    "提供企業級 Line AI 客服串接服務，整合 ChatGPT、Gemini 與 RAG 知識庫，自動回覆客戶訊息並降低客服成本。",

  keywords: [
    "Line AI",
    "Line AI 客服",
    "Line ChatGPT 串接",
    "Line Gemini",
    "RAG 知識庫",
    "AI 客服"
  ],

  alternates: {
    canonical: "https://www.line88.tw/content/line-ai-services",
  },

  openGraph: {
    title: "Line AI 官方帳號客服系統",
    description:
      "企業級 Line AI 串接方案，支援 ChatGPT、Gemini、RAG 知識庫與全天候自動客服。",
    url: "https://www.line88.tw/content/line-ai-services",
    siteName: "洛克希德黑克斯",
    locale: "zh_TW",
    type: "website",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}