import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram 流量增長服務｜IG 按愛心、追蹤、留言互動',

  description:
    '提供 Instagram 按愛心、增加追蹤、留言互動、貼文曝光與社群流量增長服務，協助提升 IG 帳號人氣與品牌曝光。',

  alternates: {
    canonical: 'https://www.line88.tw/content/instagram-services',
  },

  openGraph: {
    title: 'Instagram 流量增長服務｜IG 按愛心與追蹤提升',

    description:
      '專業 IG 愛心、追蹤、留言互動與社群曝光增長服務。',

    url: 'https://www.line88.tw/content/instagram-services',

    type: 'website',
  },

  twitter: {
    card: 'summary',

    title: 'Instagram 流量增長服務｜IG 按愛心與追蹤提升',

    description:
      'IG 愛心、追蹤、留言互動與流量曝光服務。',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function InstagramServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}