import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LINE 投票支援服務｜LINE 帳號大量投票、人氣投票灌票',
  
  description:
    '提供 LINE 投票支援、人氣投票、活動衝票與大量 LINE 帳號投票服務，適用各類網路票選、比賽與社群活動。',

  alternates: {
    canonical: 'https://www.line88.tw/content/line-voting-services',
  },

  openGraph: {
    title: 'LINE 投票支援服務｜LINE 帳號大量投票',
    
    description:
      '專業 LINE 投票支援與人氣票選服務，提供大量 LINE 帳號投票與活動衝票方案。',

    url: 'https://www.line88.tw/content/line-voting-services',

    type: 'website',
  },

  twitter: {
    card: 'summary',

    title: 'LINE 投票支援服務｜LINE 帳號大量投票',

    description:
      'LINE 投票支援、人氣投票與活動衝票服務。',

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

export default function LineVotingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}