import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google 投票支援服務｜Google 帳號大量投票、人氣投票',

  description:
    '提供 Google 投票支援、Google 表單投票、人氣票選與大量 Google 帳號投票服務，協助提升活動票數與曝光。',

  alternates: {
    canonical: 'https://www.line88.tw/content/google-voting-services',
  },

  openGraph: {
    title: 'Google 投票支援服務｜Google 帳號大量投票',

    description:
      '專業 Google 投票支援與 Google 表單人氣票選服務。',

    url: 'https://www.line88.tw/content/google-voting-services',

    type: 'website',
  },

  twitter: {
    card: 'summary',

    title: 'Google 投票支援服務｜Google 帳號大量投票',

    description:
      'Google 表單投票、人氣票選與活動衝票服務。',
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

export default function GoogleVotingServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}