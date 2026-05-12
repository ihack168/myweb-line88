import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Facebook 投票與社團人數增長服務｜FB 投票、社團衝人數',

  description:
    '提供 Facebook 投票支援、人氣票選、FB 社團衝人數、貼文互動與社群流量增長服務，協助提升活動曝光與社群熱度。',

  alternates: {
    canonical: 'https://www.line88.tw/content/facebook-services',
  },

  openGraph: {
    title: 'Facebook 投票與社群流量增長服務',

    description:
      '專業 Facebook 投票支援、FB 社團衝人數與社群互動增長服務。',

    url: 'https://www.line88.tw/content/facebook-services',

    type: 'website',
  },

  twitter: {
    card: 'summary',

    title: 'Facebook 投票與社群流量增長服務',

    description:
      'FB 投票、社團衝人數與社群曝光增長服務。',
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

export default function FacebookServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}