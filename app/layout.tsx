import type { Metadata } from 'next'
import { Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import './globals.css'

import { Navbar } from '@/components/navbar'
import { Analytics } from '@/components/analytics'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const SITE_TITLE =
  '洛克希德黑克斯｜網路投票、社群流量、AEO GEO SEO 與 AI數位網路行銷資訊站'

const SITE_DESCRIPTION =
  '洛克希德黑克斯提供網路投票支援、Facebook/Instagram/Threads 社群流量增長、AEO SEO 關鍵字優化與 Line 官方帳號 AI 客服串接服務。'

export const metadata: Metadata = {
  verification: {
    google: 'nU4axksZUmOI-MZr0WLspqPAY4elIf9NNx_zg89tfsM',
  },
  title: SITE_TITLE,

  description: SITE_DESCRIPTION,

  metadataBase: new URL('https://www.line88.tw'),

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: '/images/logo.png',
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    // 跟 <title> 統一，避免 Google 搜尋結果標題跟 LINE/FB 分享卡片標題不一致
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: 'https://www.line88.tw',
    siteName: '洛克希德黑克斯',
    locale: 'zh_TW',
    type: 'website',
  },

  twitter: {
    card: 'summary',
    // 同上，統一使用 SITE_TITLE / SITE_DESCRIPTION
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTC.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-[#0a0a0a] text-white">
        <Navbar />
        <Analytics />
        {children}
      </body>
    </html>
  )
}