import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Line AI 官方帳號客服系統｜ChatGPT 自動回覆串接",
  
  description:
    "協助企業將 Line 官方帳號串接 ChatGPT、Gemini 與 RAG 知識庫，打造 24 小時 AI 自動客服系統。",

  alternates: {
    canonical: "https://www.line88.tw/content/line-ai-services",
  },

  openGraph: {
    title: "Line AI 官方帳號客服系統",
    
    description:
      "企業級 Line AI 客服串接服務，整合 ChatGPT、Gemini 與企業知識庫。",

    url: "https://www.line88.tw/content/line-ai-services",

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