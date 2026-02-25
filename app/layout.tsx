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
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: '洛克希德黑克斯 | 全台最強網路投票支援、買票灌票、社群流量數據增長中心',
  description: '專業處理各類網路投票支援：LINE 投票、FB 臉書投票、Google 表單、買票灌票。同步提供 FB、IG、Threads 大量按讚追蹤，穩定提升社群曝光量。',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: '洛克希德黑克斯 - 網路投票數據支援與社群增長',
    description: '安全、快速、高效的網路投票解決方案。',
    url: 'https://www.line88.tw/',
    siteName: '洛克希德黑克斯',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    locale: 'zh_TW',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.line88.tw/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-[#0a0a0a]">
        {/* Google Analytics (GA4) - 已徹底修正空格與 ID 問題 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2X29DPN458"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2X29DPN458');
          `}
        </Script>

        {children}
      </body>
    </html>
  )
}