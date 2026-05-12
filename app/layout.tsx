import type { Metadata } from 'next'
import { Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

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
  title: '洛克希德黑克斯｜網路投票、社群流量、AEO SEO 與 Line AI 客服服務',

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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white">
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

        {children}
      </body>
    </html>
  )
}