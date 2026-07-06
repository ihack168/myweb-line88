import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "最新文章",
  description:
    "洛克希德黑克斯最新文章，分享網路投票、社群流量、AEO、GEO、SEO 與 AI 數位行銷相關知識。",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "最新文章｜洛克希德黑克斯",
    description:
      "洛克希德黑克斯最新文章，分享網路投票、社群流量、AEO、GEO、SEO 與 AI 數位行銷相關知識。",
    url: "https://www.line88.tw/blog",
    siteName: "洛克希德黑克斯",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "最新文章｜洛克希德黑克斯",
    description:
      "洛克希德黑克斯最新文章，分享網路投票、社群流量、AEO、GEO、SEO 與 AI 數位行銷相關知識。",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}