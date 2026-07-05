"use client";

import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { LatestPostsSection } from "@/components/latest-posts-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "洛克希德黑克斯 AI數位網路行銷資訊站",
    url: "https://www.line88.tw",
    description:
      "提供網路投票支援、LINE/FB/Google 投票、社群流量增長、AEO GEO SEO 關鍵字優化與 Line AI 客服串接服務。",
    areaServed: "TW",
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "網路投票買票灌票服務",
          description:
            "提供 LINE、Facebook、Google 表單與各類網路票選活動投票支援。",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "社群流量增長服務",
          description:
            "提供 Facebook、Instagram、Threads 按讚、追蹤、留言與曝光提升服務。",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AEO SEO 關鍵字優化服務",
          description:
            "提供 AI 搜尋優化、SEO 內容規劃與關鍵字策略服務。",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Line 官方帳號 AI 客服串接",
          description:
            "提供 Line 官方帳號串接 ChatGPT、Gemini 與 RAG 知識庫的 AI 客服建置服務。",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white selection:bg-[#ff8800]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative bg-[radial-gradient(circle_at_top,rgba(255,136,0,0.14),transparent_26%),linear-gradient(to_bottom,#0a0a0a,#080808_45%,#0a0a0a)]">
        <section className="px-4 pt-24 pb-8 md:px-6 md:pt-28 md:pb-10">
          <HeroSection />
        </section>

        <ServicesSection />
        <LatestPostsSection />
        <ContactSection />

        <section className="sr-only">
          <h2>全台專業網路投票買票灌票與社群流量增長服務</h2>
          <p>
            洛克希德黑克斯提供 LINE 投票買票、Facebook 投票灌票、
            Google 表單投票支援，以及各類網站票選活動數據優化服務。
          </p>
          <p>
            我們同時提供 Facebook、Instagram、Threads、
            Line 官方帳號等社群平台的大量按讚、追蹤、留言與社團人數增長服務。
          </p>
          <p>
            此外也提供 AEO、GEO、SEO、AI 關鍵字優化、Line 官方帳號 AI 客服串接、
            ChatGPT Gemini 自動回覆系統與企業 AI 知識庫建置服務。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}