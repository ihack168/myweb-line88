import type { Metadata } from "next";
import Image from "next/image";

import { ServicesSection } from "@/components/services-section";
import { LatestPostsSection } from "@/components/latest-posts-section";
import { ContactSection } from "@/components/contact-section";

const SITE_URL = "https://www.line88.tw";

const PAGE_TITLE =
  "洛克希德黑克斯｜網路投票協助、AEO GEO SEO、LINE AI 串接與社群行銷";

const PAGE_DESCRIPTION =
  "洛克希德黑克斯提供網路投票協助、AEO、GEO、SEO 網路行銷優化、LINE 官方帳號 AI 串接，以及 Facebook、Instagram、Threads 社群行銷優化服務。";

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
        url: "/images/logo.png",
        alt: "洛克希德黑克斯 Lockhead Hex",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/images/logo.png"],
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
        {/* 首頁主視覺與唯一 H1 */}
        <section className="px-5 pb-12 pt-28 md:px-6 md:pb-16 md:pt-32">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <div className="group relative">
              <div className="absolute -inset-10 rounded-full bg-[#ff8800]/10 blur-[80px] transition-all duration-1000 group-hover:bg-[#ff8800]/20" />

              <div className="absolute inset-0 rounded-full bg-[#ff8800]/5 opacity-0 blur-[40px] transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative z-10">
                <Image
                  src="/images/logo.png"
                  alt="洛克希德黑克斯 Lockhead Hex"
                  width={500}
                  height={500}
                  priority
                  className="h-auto w-64 drop-shadow-[0_0_15px_rgba(255,136,0,0.2)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_35px_rgba(255,136,0,0.6)] md:w-[400px]"
                />
              </div>

              <div className="mx-auto mt-4 h-[3px] w-20 bg-gradient-to-r from-transparent via-[#ff8800] to-transparent shadow-[0_0_15px_#ff8800] transition-all duration-700 group-hover:w-40" />
            </div>

            <div className="mt-7">
              <h1 className="max-w-5xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
                <span className="block italic">
                  LOCKHEAD <span className="text-[#ff8800]">HEX</span>
                </span>

                <span className="mt-4 block text-xl font-black not-italic leading-relaxed tracking-normal text-white md:text-3xl">
                  網路投票協助、AEO、GEO、SEO、LINE AI 串接與社群行銷優化
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-4xl text-sm leading-7 text-gray-400 md:text-lg md:leading-8">
                提供各類網路票選活動協助、AEO 答案引擎優化、GEO
                生成式引擎優化、SEO 搜尋引擎優化、LINE 官方帳號 AI
                客服串接，以及 Facebook、Instagram、Threads
                社群行銷與流量優化服務。
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="#services"
                  className="rounded-full bg-[#ff8800] px-6 py-3 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff9d2e]"
                >
                  查看服務項目
                </a>

                <a
                  href="/contact"
                  className="rounded-full border border-[#ff8800]/40 bg-white/5 px-6 py-3 text-sm font-black text-[#ff8800] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ff8800] hover:bg-[#ff8800]/10"
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
                  LINE 官方帳號 AI 串接
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                  協助 LINE 官方帳號串接 ChatGPT、Gemini、企業資料與 RAG
                  知識庫，建立自動回覆、問題解答與客服輔助系統。
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