import type { Metadata } from "next"

const SITE_URL = "https://www.line88.tw"
const PAGE_URL = `${SITE_URL}/jp`

const SITE_NAME = "洛克希德黑克斯"
const SITE_NAME_EN = "Lockhead Hex"

const PAGE_TITLE =
  "ネット投票サポート｜Google・LINE・Facebook投票｜洛克希德黑克ス"

const PAGE_DESCRIPTION =
  "Google、LINE、Facebookなどを利用したネット投票活動をサポート。投票方法の確認、参加手順、投票イベントの運用など、各種オンライン投票をサポートします。"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: PAGE_TITLE,

  description: PAGE_DESCRIPTION,

  keywords: [
    "ネット投票",
    "ネット投票サポート",
    "ネット投票活動",
    "オンライン投票",
    "投票イベント",
    "投票キャンペーン",
    "Google投票",
    "Googleフォーム投票",
    "Google投票サポート",
    "LINE投票",
    "LINE投票サポート",
    "Facebook投票",
    "Facebook投票サポート",
    "投票活動サポート",
    "投票イベントサポート",
    "洛克希德黑克斯",
    "Lockhead Hex",
  ],

  alternates: {
    canonical: PAGE_URL,

    languages: {
      "ja-JP": PAGE_URL,
      "zh-TW": SITE_URL,
      "x-default": SITE_URL,
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",

    images: [
      {
        url: "/images/hero-desktop.png",
        width: 2560,
        height: 1080,
        alt: "ネット投票サポート｜洛克希德黑克ス",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/images/hero-desktop.png"],
  },
}

export default function JapanPage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",

    "@id": `${SITE_URL}/#organization`,

    name: SITE_NAME,

    alternateName: SITE_NAME_EN,

    url: SITE_URL,

    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/images/logo.png`,
      contentUrl: `${SITE_URL}/images/logo.png`,
      caption: SITE_NAME,
    },

    image: {
      "@id": `${SITE_URL}/#logo`,
    },

    description: PAGE_DESCRIPTION,

    areaServed: [
      {
        "@type": "Country",
        name: "Japan",
      },
      {
        "@type": "Country",
        name: "Taiwan",
      },
    ],

    knowsAbout: [
      "ネット投票",
      "オンライン投票",
      "投票イベント",
      "投票キャンペーン",
      "Google投票",
      "Googleフォーム投票",
      "LINE投票",
      "Facebook投票",
      "投票活動サポート",
      "デジタルマーケティング",
      "ソーシャルメディアマーケティング",
    ],

    makesOffer: [
      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "ネット投票活動サポート",

          serviceType: "ネット投票活動サポート",

          areaServed: [
            {
              "@type": "Country",
              name: "Japan",
            },
            {
              "@type": "Country",
              name: "Taiwan",
            },
          ],

          description:
            "Google、LINE、Facebookなどを利用したネット投票活動について、投票方法の確認、参加手順、投票イベントの運用などをサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "Google投票サポート",

          serviceType: "Google投票サポート",

          areaServed: "JP",

          description:
            "Googleフォームなどを利用したネット投票について、投票ページの確認、参加方法、投票手順などをサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "LINE投票サポート",

          serviceType: "LINE投票サポート",

          areaServed: "JP",

          description:
            "LINEを利用した投票キャンペーンについて、参加方法、投票手順、イベント運用などをサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "Facebook投票サポート",

          serviceType: "Facebook投票サポート",

          areaServed: "JP",

          description:
            "Facebook上で実施される投票イベントについて、投票方法、参加手順、イベント運用などをサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
    ],
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    url: SITE_URL,

    name: SITE_NAME,

    alternateName: SITE_NAME_EN,

    description: PAGE_DESCRIPTION,

    inLanguage: "ja-JP",

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  }

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",

    "@id": `${PAGE_URL}/#webpage`,

    url: PAGE_URL,

    name: PAGE_TITLE,

    description: PAGE_DESCRIPTION,

    inLanguage: "ja-JP",

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },

    about: {
      "@id": `${SITE_URL}/#organization`,
    },

    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/hero-desktop.png`,
      width: 2560,
      height: 1080,
    },
  }

  const serviceListJsonLd = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    "@id": `${PAGE_URL}/#services`,

    name: "ネット投票サービス",

    description:
      "Google、LINE、Facebookなどのネット投票活動をサポートするサービス",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,

        item: {
          "@type": "Service",

          name: "Google投票サポート",

          description:
            "Googleフォームなどを利用したネット投票について、投票方法や参加手順をサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "ListItem",
        position: 2,

        item: {
          "@type": "Service",

          name: "LINE投票サポート",

          description:
            "LINEを利用した投票イベントについて、参加方法や投票手順をサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "ListItem",
        position: 3,

        item: {
          "@type": "Service",

          name: "Facebook投票サポート",

          description:
            "Facebook上で実施される投票イベントについて、投票方法や参加手順をサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
    ],
  }

  const faqJsonLd = {
    "@context": "https://schema.org",

    "@type": "FAQPage",

    "@id": `${PAGE_URL}/#faq`,

    mainEntity: [
      {
        "@type": "Question",

        name: "ネット投票のサポートには対応していますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい。Google、LINE、Facebookなどを利用したネット投票活動について、投票方法の確認、参加手順、投票イベントの運用などをサポートしています。",
        },
      },

      {
        "@type": "Question",

        name: "Googleフォームを利用した投票にも対応していますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい。Googleフォームなどを利用したネット投票について、投票ページの確認、参加方法、投票手順などをサポートしています。",
        },
      },

      {
        "@type": "Question",

        name: "LINEを利用した投票イベントにも対応していますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい。LINEを利用した投票キャンペーンについて、参加方法や投票手順などをサポートしています。",
        },
      },

      {
        "@type": "Question",

        name: "Facebookの投票イベントにも対応していますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい。Facebook上で実施される投票イベントについて、投票方法や参加手順などをサポートしています。",
        },
      },

      {
        "@type": "Question",

        name: "日本から問い合わせできますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい。日本からのお問い合わせにも対応しています。サービス内容や投票イベントについて、お気軽にお問い合わせください。",
        },
      },
    ],
  }

  return (
    <div className="overflow-hidden bg-[#0a0a0a] text-white selection:bg-[#ff8800]/30">
      {/* ============================================================
          Structured Data
      ============================================================ */}

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceListJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      <main className="relative bg-[radial-gradient(circle_at_top,rgba(255,136,0,0.14),transparent_26%),linear-gradient(to_bottom,#0a0a0a,#080808_45%,#0a0a0a)]">

        {/* ============================================================
            Hero
        ============================================================ */}

        <section
          aria-labelledby="jp-page-title"
          className="relative h-[650px] overflow-hidden sm:h-[680px] lg:h-[600px]"
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(max-width: 767px)"
              srcSet="/images/hero-mobile.png"
            />

            <img
              src="/images/hero-desktop.png"
              alt="ネット投票活動をサポートする洛克希德黑克斯"
              className="absolute inset-0 h-full w-full object-cover object-center"
              width={2560}
              height={1080}
              fetchPriority="high"
            />
          </picture>

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
            <div className="max-w-2xl">

              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff8800] drop-shadow-lg md:text-base">
                LOCKHEAD HEX
              </p>

              <h1
                id="jp-page-title"
                className="mt-3 text-4xl font-black leading-tight tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl"
              >
                ネット投票活動を
                <br />
                <span className="text-[#ff8800]">
                  サポートします
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg sm:leading-8">
                Google、LINE、Facebookなどを利用した
                ネット投票イベントについて、
                投票方法の確認、参加手順、
                投票イベントの運用などをサポートします。
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#services"
                  className="rounded-full bg-[#ff8800] px-6 py-3 text-sm font-black text-black shadow-[0_8px_30px_rgba(255,136,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff9d2e] hover:shadow-[0_12px_35px_rgba(255,136,0,0.45)]"
                >
                  サービスを見る
                </a>

                <a
                  href="/jp/contact"
                  className="rounded-full border border-white/40 bg-black/20 px-6 py-3 text-sm font-black text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/15"
                >
                  お問い合わせ
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            Services
        ============================================================ */}

        <section
          id="services"
          aria-labelledby="service-heading"
          className="px-5 py-14 md:py-20"
        >
          <div className="mx-auto max-w-6xl">

            <div className="text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800] md:text-sm">
                NET VOTING SUPPORT
              </p>

              <h2
                id="service-heading"
                className="text-3xl font-black leading-tight text-white md:text-4xl"
              >
                ネット投票サービス
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-gray-400 md:text-base md:leading-8">
                各種オンライン投票・投票キャンペーンについて、
                プラットフォームごとの投票方法や参加手順を確認し、
                スムーズな投票活動をサポートします。
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">

              {/* Google */}

              <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff8800]/40">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff8800]">
                  GOOGLE
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  Google投票サポート
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400 md:text-base">
                  Googleフォームなどを利用したネット投票について、
                  投票ページの確認、参加方法、投票手順などをサポートします。
                </p>
              </article>

              {/* LINE */}

              <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff8800]/40">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff8800]">
                  LINE
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  LINE投票サポート
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400 md:text-base">
                  LINEを利用した投票キャンペーンについて、
                  参加方法や投票手順などを確認し、
                  投票活動をスムーズに進めるためのサポートを行います。
                </p>
              </article>

              {/* Facebook */}

              <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff8800]/40">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff8800]">
                  FACEBOOK
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  Facebook投票サポート
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400 md:text-base">
                  Facebook上で実施される投票イベントについて、
                  投票方法や参加手順を確認し、
                  投票活動をサポートします。
                </p>
              </article>

              {/* Online */}

              <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff8800]/40">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff8800]">
                  ONLINE VOTING
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  オンライン投票・投票イベント
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400 md:text-base">
                  各種ウェブサイトやオンラインサービスで開催される
                  投票イベントについて、
                  投票方法や参加手順などを確認し、
                  必要なサポートを提供します。
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* ============================================================
            Support
        ============================================================ */}

        <section
          aria-labelledby="support-heading"
          className="border-y border-white/5 bg-white/[0.02] px-5 py-14 md:py-20"
        >
          <div className="mx-auto max-w-5xl">

            <div className="text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800]">
                SUPPORT
              </p>

              <h2
                id="support-heading"
                className="text-2xl font-black text-white md:text-4xl"
              >
                ネット投票をスムーズに
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">

              <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <h3 className="text-lg font-black text-[#ff8800]">
                  投票方法の確認
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  投票ページや投票システムを確認し、
                  必要な参加手順をわかりやすく整理します。
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <h3 className="text-lg font-black text-[#ff8800]">
                  各プラットフォーム対応
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Google、LINE、Facebookなど、
                  利用するプラットフォームに合わせて
                  投票方法を確認します。
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <h3 className="text-lg font-black text-[#ff8800]">
                  投票活動サポート
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  投票イベントの内容や条件を確認し、
                  スムーズに参加できるようサポートします。
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* ============================================================
            FAQ
        ============================================================ */}

        <section
          aria-labelledby="faq-heading"
          className="px-5 py-14 md:py-20"
        >
          <div className="mx-auto max-w-4xl">

            <div className="text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800]">
                FAQ
              </p>

              <h2
                id="faq-heading"
                className="text-2xl font-black text-white md:text-4xl"
              >
                よくある質問
              </h2>
            </div>

            <div className="mt-10 space-y-4">

              <details className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                  ネット投票のサポートには対応していますか？
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  はい。Google、LINE、Facebookなどを利用した
                  ネット投票活動について、投票方法の確認、
                  参加手順、投票イベントの運用などをサポートしています。
                </p>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                  Googleフォームを利用した投票にも対応していますか？
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  はい。Googleフォームなどを利用したネット投票について、
                  投票ページの確認や参加方法、投票手順などをサポートしています。
                </p>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                  LINEを利用した投票イベントにも対応していますか？
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  はい。LINEを利用した投票キャンペーンについて、
                  参加方法や投票手順などをサポートしています。
                </p>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                  Facebookの投票イベントにも対応していますか？
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  はい。Facebook上で実施される投票イベントについて、
                  投票方法や参加手順などをサポートしています。
                </p>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                  日本から問い合わせできますか？
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  はい。日本からのお問い合わせにも対応しています。
                  サービス内容や投票イベントについて、
                  お気軽にお問い合わせください。
                </p>
              </details>

            </div>
          </div>
        </section>

        {/* ============================================================
            CTA
        ============================================================ */}

        <section className="px-5 pb-20 pt-6">
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#ff8800]/20 bg-[#ff8800]/[0.06] p-8 text-center md:p-12">

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800]">
              CONTACT
            </p>

            <h2 className="mt-3 text-2xl font-black text-white md:text-4xl">
              投票イベントについてご相談ください
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
              投票方法、参加手順、対応プラットフォームなど、
              ネット投票に関するご相談を承っています。
            </p>

            <a
              href="/jp/contact"
              className="mt-7 inline-flex rounded-full bg-[#ff8800] px-7 py-3 text-sm font-black text-black shadow-[0_8px_30px_rgba(255,136,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff9d2e]"
            >
              お問い合わせ
            </a>

          </div>
        </section>

      </main>
    </div>
  )
}