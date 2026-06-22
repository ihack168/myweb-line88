import type { Metadata } from 'next'
import { Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { useEffect } from 'react'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  verification: {
    google: 'nU4axksZUmOI-MZr0WLspqPAY4elIf9NNx_zg89tfsM',
  },
  title: '洛克希德黑克斯｜網路投票、社群流量、AEO GEO SEO 與 AI數位網路行銷資訊站',
  description:
    '洛克希德黑克斯提供網路投票支援、Facebook/Instagram/Threads 社群流量增長、AEO SEO 關鍵字優化與 Line 官方帳號 AI 客服串接服務。',
  metadataBase: new URL('https://www.line88.tw'),
  alternates: {
    canonical: 'https://www.line88.tw',
  },
  icons: {
    icon: '/images/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '洛克希德黑克斯｜網路投票、社群流量與 AI 自動化服務',
    description:
      '提供 LINE/FB/Google 投票支援、社群流量增長、AEO SEO 優化與 Line AI 客服建置服務。',
    url: 'https://www.line88.tw',
    siteName: '洛克希德黑克斯',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '洛克希德黑克斯｜網路投票、社群流量與 AI 自動化服務',
    description:
      '投票支援、社群流量增長、AEO SEO 與 Line AI 客服建置服務。',
  },
}

/**
 * 🔥 關鍵修正：關掉 Next.js / browser scroll restoration
 */
function ScrollFix() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])
  return null
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

        {/* 🔥 加這行 */}
        <ScrollFix />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2X29DPN458"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2X29DPN458', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="febf1b62-e4ea-449e-af9b-dd91619e1116"
          strategy="afterInteractive"
        />

        {/* Cloudflare Web Analytics */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"9fec8e6d90b447db9c6726ce57ddbbad"}'
          strategy="afterInteractive"
        />

        {children}
      </body>
    </html>
  )
}