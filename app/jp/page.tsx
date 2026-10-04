import type { Metadata } from "next"

import { ServicesSection } from "@/components/services-section"
import { LatestPostsSection } from "@/components/latest-posts-section"
import { ContactSection } from "@/components/contact-section"

const SITE_URL = "https://www.line88.tw"
const PAGE_URL = `${SITE_URL}/jp`

const SITE_NAME = "洛克希德黑克斯"
const SITE_NAME_EN = "Lockhead Hex"

const PAGE_TITLE =
  "ネット投票代行・得票数アップ｜大量 Google・LINE・Facebook アカウント投票｜洛克希德黑克斯"

const PAGE_DESCRIPTION =
  "ネット投票の得票数アップ・投票代行・票購入・水増しサポート！大量の Google、LINE、Facebook アカウントを使用して迅速に票数を伸ばし、各種オンライン投票イベントやコンテストでの勝利を強力にサポートします。"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: PAGE_TITLE,

  description: PAGE_DESCRIPTION,

  keywords: [
    "Googleアカウント投票サポート",
    "Google投票購入",
    "Google投票水増し",
    "LINEアカウント投票サポート",
    "LINE投票購入",
    "LINE投票水増し",
    "Facebookアカウント投票サポート",
    "Facebook投票購入",
    "Facebook投票水増し",
    "ネット投票代行",
    "ネット投票買い票",
    "ネット投票水増し",
    "得票数増加",
    "大量アカウント投票",
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
        alt: "ネット投票代行・票購入・水増しサポート｜洛克希德黑克斯",
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
  /*
   * ============================================================
   * Organization
   * ============================================================
   */

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
      "Googleアカウント投票サポート",
      "Google投票購入",
      "Google投票水増し",
      "LINEアカウント投票サポート",
      "LINE投票購入",
      "LINE投票水増し",
      "Facebookアカウント投票サポート",
      "Facebook投票購入",
      "Facebook投票水増し",
      "ネット投票代行",
      "得票数増加",
    ],

    makesOffer: [
      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "ネット投票代行・票購入・水増しサポート",

          serviceType: "ネット投票活動サポート",

          areaServed: ["JP", "TW"],

          description:
            "大量の Google、LINE、Facebook アカウントを活用して迅速に得票数を伸ばし、各種オンライン投票イベントでの勝利をサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "Googleアカウント投票サポート・票購入・水増し",

          serviceType: "Google投票代行",

          areaServed: ["JP", "TW"],

          description:
            "大量の Google アカウントを使用してフォームやWebサイトの投票を迅速に伸ばします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "LINEアカウント投票サポート・票購入・水増し",

          serviceType: "LINE投票代行",

          areaServed: ["JP", "TW"],

          description:
            "大量の LINE アカウントを活用し、投票キャンペーンでの票数を一気に引き上げます。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },

      {
        "@type": "Offer",

        itemOffered: {
          "@type": "Service",

          name: "Facebookアカウント投票サポート・票購入・水増し",

          serviceType: "Facebook投票代行",

          areaServed: ["JP", "TW"],

          description:
            "大量の Facebook アカウントを使用して投票イベントでの確実な1位獲得をサポートします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
    ],
  }

  /*
   * ============================================================
   * WebSite
   * ============================================================
   */

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

  /*
   * ============================================================
   * WebPage
   * ============================================================
   */

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

  /*
   * ============================================================
   * Services
   * ============================================================
   */

  const serviceListJsonLd = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    "@id": `${PAGE_URL}/#services`,

    name: "ネット投票代行・票購入・水増しサービス",

    description: "大量の Google、LINE、Facebook アカウントを活用したネット投票代行・得票数アップサービス",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,

        item: {
          "@type": "Service",

          name: "Googleアカウント投票サポート・票購入・水増し",

          description:
            "大量の実在 Google アカウントを使って代行投票・水増しを行い、得票数を急上昇させます。",

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

          name: "LINEアカウント投票サポート・票購入・水増し",

          description:
            "大量の LINE アカウントを投入して投票イベントで他者と一気に差をつけます。",

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

          name: "Facebookアカウント投票サポート・票購入・水増し",

          description:
            "大量の Facebook アカウントで迅速に投票を行い、1位獲得を強力にアシストします。",

          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
    ],
  }

  /*
   * ============================================================
   * FAQ
   * ============================================================
   */

  const faqJsonLd = {
    "@context": "https://schema.org",

    "@type": "FAQPage",

    "@id": `${PAGE_URL}/#faq`,

    mainEntity: [
      {
        "@type": "Question",

        name: "ネット投票での票購入や水増し（大量投票）に対応していますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい、対応可能です！大量の高品質な Google、LINE、Facebook アカウントを保有しており、お客様の指定する投票ページへ迅速に大量投票を行い、圧倒的な票数差を作り出します。",
        },
      },

      {
        "@type": "Question",

        name: "Googleアカウント投票サポートはどのように機能しますか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "Google フォームや Google ログインが必要な各種投票サイトに対し、保有する大量のアカウントを使って一括投票・代理投票を実行します。",
        },
      },

      {
        "@type": "Question",

        name: "LINEアカウントでの投票代行・水増しは可能ですか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "はい。LINE 連携や LINE 公式アカウントを利用した投票キャンペーンに対し、大量の LINE アカウントを用いて確実に得票数を引き上げます。",
        },
      },

      {
        "@type": "Question",

        name: "Facebookアカウントでの投票代行は安全ですか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "当社の Facebook アカウントは適切に管理されており、自然な投票ペースを再現しながら安全かつ確実に票数を伸ばします。",
        },
      },

      {
        "@type": "Question",

        name: "日本からの相談や注文は可能ですか？",

        acceptedAnswer: {
          "@type": "Answer",

          text:
            "もちろん可能です。日本国内の各種コンテストやネット投票イベントにも多数対応しております。まずはお気軽にお問い合わせください。",
        },
      },
    ],
  }
