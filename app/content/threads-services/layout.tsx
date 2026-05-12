import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facebook 社群行銷服務 | 洛克希德黑克斯",

  description:
    "提供 Facebook 按讚、粉絲增長、社群互動與流量提升服務。",

  alternates: {
    canonical: "https://www.line88.tw/content/facebook-services",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}