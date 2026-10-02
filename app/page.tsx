import type { Metadata } from "next";

import { ServicesSection } from "@/components/services-section";
import { LatestPostsSection } from "@/components/latest-posts-section";
import { ContactSection } from "@/components/contact-section";

const SITE_URL = "https://www.line88.tw";

const PAGE_TITLE =
  "洛克希德黑克斯｜Google投票、LINE投票、Facebook投票協助與AEO、GEO、SEO等社群行銷";

const PAGE_DESCRIPTION =
  "洛克希德黑克斯提供 Google投票、LINE投票、Facebook投票、買票、灌票、投票協助與幫你投票服務，並提供AEO、GEO、SEO等社群行銷服務。。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
    siteName: "洛克希德黑克斯",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/images/hero-desktop.png",
        alt: "洛克希德黑克斯 Lockhead Hex",
        width: 2560,
        height: 1080,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/images/hero-desktop.png"],
  },
};

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "洛克希德黑克斯",
    alternateName: "Lockhead Hex",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/logo.png`,
    description: PAGE_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
    },
    knowsAbout: [
      "網路投票協助、幫助",
      "AEO 答案引擎優化",
      "GEO 生成式引擎優化",
      "SEO 搜尋引擎優化",
      "LINE 官方帳號 AI 串接",
      "社群行銷優化",
      "Facebook 行銷",
      "Instagram 行銷",
      "Threads 行銷",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "網路投票協助",
          serviceType: "網路票選活動協助",
          areaServed: "TW",
          description:
            "提供 LINE、Facebook、Google 表單及各類網路票選活動的投票流程與執行協助。",
          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AEO、GEO、SEO 網路行銷優化",
          serviceType: "搜尋與生成式引擎內容優化",
          areaServed: "TW",
          description:
            "提供 AEO、GEO、SEO 網站內容規劃、關鍵字策略、技術結構及 AI 搜尋可見度優化。",
          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "LINE 官方帳號 AI 串接",
          serviceType: "LINE AI 客服與自動回覆系統",
          areaServed: "TW",
          description:
            "提供 LINE 官方帳號串接 ChatGPT、Gemini、RAG 知識庫及 AI 自動回覆系統。",
          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "社群行銷優化",
          serviceType: "社群平台經營與流量優化",
          areaServed: "TW",
          description:
            "提供 Facebook、Instagram、Threads 等社群平台的曝光、互動、內容與流量優化服務。",
          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "洛克希德黑克斯",
    alternateName: "Lockhead Hex",
    description: PAGE_DESCRIPTION,
    inLanguage: "zh-Hant",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    inLanguage: "zh-Hant",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <div className="overflow-hidden bg-[#0a0a0a] text-white selection:bg-[#ff8800]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd),
        }}
      />

      <main className="relative bg-[radial-gradient(circle_at_top,rgba(255,136,0,0.14),transparent_26%),linear-gradient(to_bottom,#0a0a0a,#080808_45%,#0a0a0a)]">

        {/* =========================================
            首頁 Hero
            Desktop: 2560 × 1080
            Mobile: 1080 × 1440
            ========================================= */}
        <section className="relative h-[650px] overflow-hidden sm:h-[680px] lg:h-[600px]">

          {/* Hero 背景圖片 */}
          <picture className="absolute inset-0 block h-full w-full">
            {/* 手機版 */}
            <source
              media="(max-width: 767px)"
              srcSet="/images/hero-mobile.png"
            />

            {/* 桌機版 */}
            <img
              src="/images/hero-desktop.png"
              alt="洛克希德黑克斯網路投票協助與數位行銷服務"
              className="absolute inset-0 h-full w-full object-cover object-center"
              width={2560}
              height={1080}
              fetchPriority="high"
            />
          </picture>

          {/* 左側黑色漸層，讓 Hero 文字更清楚 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />

          {/* 下方漸層，讓畫面銜接網站內容 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          {/* Hero 內容 */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
            <div className="max-w-2xl">

              {/* 品牌英文 */}
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff8800] drop-shadow-lg md:text-base">
                LOCKHEAD HEX
              </p>

              {/* 唯一 H1 */}
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
                網路投票協助
                <br />
                <span className="text-[#ff8800]">
                  數位行銷與 AI 解決方案
                </span>
              </h1>

              {/* Hero 說明 */}
              <p className="mt-5 max-w-xl text-base leading-7 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg sm:leading-8">
                提供各類網路票選活動協助、AEO 答案引擎優化、GEO
                生成式引擎優化、SEO 搜尋引擎優化，以及 Facebook、Instagram、
                Threads 社群行銷與流量優化服務。
              </p>

              {/* Hero 按鈕 */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#services"
                  className="rounded-full bg-[#ff8800] px-6 py-3 text-sm font-black text-black shadow-[0_8px_30px_rgba(255,136,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff9d2e] hover:shadow-[0_12px_35px_rgba(255,136,0,0.45)]"
                >
                  查看服務項目
                </a>

                <a
                  href="/contact"
                  className="rounded-full border border-white/40 bg-black/20 px-6 py-3 text-sm font-black text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/15"
                >
                  聯絡我們
                </a>
              </div>

            </div>
          </div>
        </section>

        <ServicesSection />

        {/* 可見的網站與服務介紹，不再使用 sr-only 隱藏文字 */}
        <section
          aria-labelledby="home-service-introduction"
          className="px-5 py-12 md:py-16"
        >
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur md:p-10">
            <div className="text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800] md:text-sm">
                DIGITAL MARKETING SOLUTIONS
              </p>

              <h2
                id="home-service-introduction"
                className="text-2xl font-black leading-tight text-white md:text-4xl"
              >
                網路投票、AI 搜尋優化與社群行銷整合服務
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-lg font-black text-[#ff8800]">
                  網路投票協助
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                  提供 LINE、Facebook、Google
                  表單及各類網站票選活動的執行協助，依照不同平台規則、
                  活動流程與實際需求規劃適合的處理方式。
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-lg font-black text-[#ff8800]">
                  AEO、GEO、SEO 優化
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                  從網站技術架構、內容規劃、搜尋意圖、關鍵字布局與結構化資料著手，
                  提升網站在 Google 搜尋、AI
                  答案引擎及生成式搜尋服務中的能見度。
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-lg font-black text-[#ff8800]">
                  社群行銷優化
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                  提供 Facebook、Instagram、Threads
                  等平台的社群內容、曝光、互動與流量策略，強化品牌在不同社群渠道的觸及表現。
                </p>
              </article>

            </div>
          </div>
        </section>

        <LatestPostsSection />

        <ContactSection />

      </main>
    </div>
  );
}