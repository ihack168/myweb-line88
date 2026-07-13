import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.line88.tw";

const PAGE_TITLE =
  "關於洛克希德黑克斯｜AI 自動化、AEO GEO SEO 與數位行銷";

const PAGE_DESCRIPTION =
  "洛克希德黑克斯創立於 2016 年，專注於網路行銷自動化系統、AEO、GEO、SEO、LINE AI 串接、社群經營與品牌數位行銷服務。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/about`,
    siteName: "洛克希德黑克斯",
    locale: "zh_TW",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

const expertise = [
  {
    title: "AEO、GEO、SEO 優化",
    description:
      "從網站架構、搜尋意圖、內容規劃、結構化資料與內外部訊號著手，協助品牌提升在 Google 搜尋與生成式 AI 平台中的能見度。",
  },
  {
    title: "網路行銷自動化",
    description:
      "將內容發布、帳號管理、資料整理與重複性行銷工作系統化，降低人工操作成本並提升執行效率。",
  },
  {
    title: "社群自動化經營",
    description:
      "依照 Facebook、Instagram、Threads、LINE 與部落格等不同平台需求，規劃社群內容、自動發布與日常維護流程。",
  },
  {
    title: "LINE 官方帳號 AI 串接",
    description:
      "協助 LINE 官方帳號串接 ChatGPT、Gemini、RAG 知識庫及企業資料，建立自動回答、客服輔助與真人轉接流程。",
  },
  {
    title: "品牌內容與代操",
    description:
      "協助品牌規劃網站文章、搜尋內容、社群經營與多平台曝光，建立能持續累積的品牌數位資產。",
  },
  {
    title: "客製化網路應用",
    description:
      "依照不同產業與行銷情境，開發資料處理、內容管理、發布流程與營運輔助相關的客製化網路工具。",
  },
];

const systems = [
  "Facebook 社群內容與發文管理工具",
  "Facebook 社團經營與日常管理系統",
  "部落格內容產生與自動發布系統",
  "多網站內容同步與排程工具",
  "社群平台帳號管理與任務流程工具",
  "AI 文章產生與內容整理系統",
  "LINE 官方帳號 AI 客服整合",
  "品牌內容發布與成效追蹤流程",
  "SEO、AEO、GEO 內容管理工具",
  "網路行銷資料整理與自動化程式",
];

const services = [
  "AEO 答案引擎優化",
  "GEO 生成式引擎優化",
  "SEO 搜尋引擎優化",
  "LINE 官方帳號 AI 串接",
  "社群媒體自動化經營",
  "品牌內容行銷",
  "Facebook、Instagram、Threads 品牌代操",
  "網站內容規劃與技術優化",
  "客製化網路行銷工具開發",
  "網路投票與社群流量相關服務",
];

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about/#webpage`,
    url: `${SITE_URL}/about`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    inLanguage: "zh-Hant",
    about: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "洛克希德黑克斯",
      alternateName: "Lockhead Hex",
      url: SITE_URL,
      foundingDate: "2016",
      description: PAGE_DESCRIPTION,
      areaServed: {
        "@type": "Country",
        name: "Taiwan",
      },
      knowsAbout: [
        "AEO 答案引擎優化",
        "GEO 生成式引擎優化",
        "SEO 搜尋引擎優化",
        "網路行銷自動化",
        "社群媒體經營",
        "LINE 官方帳號 AI 串接",
        "品牌內容行銷",
        "網路應用程式開發",
      ],
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-5 pb-24 pt-32 text-white md:px-6 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ff8800] md:text-sm">
            ABOUT LOCKHEAD HEX
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            關於
            <span className="ml-2 text-[#ff8800]">洛克希德黑克斯</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">
            從 2016 年開始，我們持續研究網路行銷、自動化程式、
            搜尋引擎優化、社群經營與 AI 應用，並將實際操作流程開發成
            可重複執行的網路工具與自動化系統。
          </p>
        </header>

        <section
          aria-labelledby="brand-story-title"
          className="mt-14 rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur md:p-10"
        >
          <p className="text-sm font-bold tracking-[0.18em] text-[#ff8800]">
            OUR STORY
          </p>

          <h2
            id="brand-story-title"
            className="mt-3 text-2xl font-black md:text-4xl"
          >
            從自動化程式開發開始的數位行銷實驗
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-gray-300">
            <p>
              洛克希德黑克斯創立於 2016
              年，早期主要投入網路行銷工具、自動化程式與社群平台操作流程的研究與開發。
              我們喜歡把傳統上需要大量人工處理的工作，重新拆解成可以由程式執行、
              排程、管理與追蹤的自動化流程。
            </p>

            <p>
              多年來，我們持續嘗試開發各種網路應用，包括社群發文管理、
              部落格內容發布、帳號管理、資料整理、行銷任務排程與多平台內容同步工具。
              這些系統的目的不是單純追求技術複雜度，而是解決品牌在實際經營過程中
              經常遇到的人力不足、操作重複、內容無法持續更新與平台管理效率低落等問題。
            </p>

            <p>
              隨著搜尋引擎與生成式 AI
              的發展，我們進一步將自動化技術延伸到 AEO、GEO、SEO、
              AI 內容管理、LINE 官方帳號 AI 客服、RAG
              知識庫與品牌多平台經營，協助企業建立能被搜尋引擎、
              生成式 AI 與潛在客戶理解的數位內容架構。
            </p>
          </div>
        </section>

        <section
          aria-labelledby="expertise-title"
          className="mt-16"
        >
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800] md:text-sm">
              CORE EXPERTISE
            </p>

            <h2
              id="expertise-title"
              className="mt-3 text-2xl font-black md:text-4xl"
            >
              核心專業領域
            </h2>

            <p className="mx-auto mt-4 max-w-3xl leading-8 text-gray-400">
              我們不只提供單一行銷服務，而是整合網站、搜尋、AI、
              社群與自動化技術，依品牌實際需求規劃可長期執行的數位流程。
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff8800]/50 hover:shadow-[0_0_30px_rgba(255,136,0,0.12)]"
              >
                <h3 className="text-xl font-black text-[#ff8800]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="systems-title"
          className="mt-16 grid gap-6 lg:grid-cols-2"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <p className="text-sm font-bold tracking-[0.18em] text-[#ff8800]">
              AUTOMATION DEVELOPMENT
            </p>

            <h2
              id="systems-title"
              className="mt-3 text-2xl font-black md:text-3xl"
            >
              長期研究與開發的系統類型
            </h2>

            <p className="mt-5 leading-8 text-gray-400">
              我們長期將實際行銷工作轉換成程式化流程，
              持續研究內容發布、平台管理、AI 應用與多站點營運相關工具。
            </p>

            <ul className="mt-6 space-y-3">
              {systems.map((system) => (
                <li
                  key={system}
                  className="flex items-start gap-3 text-sm leading-7 text-gray-300"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff8800]"
                  />

                  <span>{system}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <p className="text-sm font-bold tracking-[0.18em] text-[#ff8800]">
              OUR SERVICES
            </p>

            <h2 className="mt-3 text-2xl font-black md:text-3xl">
              目前主要服務
            </h2>

            <p className="mt-5 leading-8 text-gray-400">
              依照企業的網站條件、產業屬性、內容資源與營運目標，
              提供單項服務或跨平台整合規劃。
            </p>

            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 text-sm leading-7 text-gray-300"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff8800]"
                  />

                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="philosophy-title"
          className="mt-16 rounded-3xl border border-[#ff8800]/30 bg-[#ff8800]/[0.07] p-6 text-center md:p-10"
        >
          <p className="text-sm font-bold tracking-[0.18em] text-[#ff8800]">
            OUR PHILOSOPHY
          </p>

          <h2
            id="philosophy-title"
            className="mt-3 text-2xl font-black md:text-4xl"
          >
            行銷不只是曝光，而是建立可持續運作的系統
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-300">
            我們相信，品牌真正需要的不是一次性的流量，而是能長期產生內容、
            累積搜尋能見度、維持社群曝光並降低人工成本的營運系統。
            因此，我們會從內容、程式、自動化、搜尋與 AI
            多個面向共同規劃，而不是只處理單一平台上的短期問題。
          </p>
        </section>

        <section
          aria-labelledby="contact-title"
          className="mt-16 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800] md:text-sm">
            WORK WITH US
          </p>

          <h2
            id="contact-title"
            className="mt-3 text-2xl font-black md:text-4xl"
          >
            尋找適合品牌的數位成長方式
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
            無論你需要 AEO、GEO、SEO、LINE AI
            串接、社群自動化經營、品牌代操，或希望開發特定用途的網路行銷工具，
            都可以先提供目前的需求與目標。
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#ff8800] px-7 py-3.5 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff9d2e]"
            >
              聯絡我們
            </Link>

            <Link
              href="/#services"
              className="rounded-full border border-[#ff8800]/40 bg-white/5 px-7 py-3.5 text-sm font-black text-[#ff8800] transition duration-300 hover:-translate-y-0.5 hover:border-[#ff8800] hover:bg-[#ff8800]/10"
            >
              查看服務項目
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}