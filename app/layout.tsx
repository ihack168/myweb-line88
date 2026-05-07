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

// 優化後的 Metadata 設定
export const metadata: Metadata = {
  title: '洛克希德黑克斯 | 全台最強網路投票支援、買票灌票、社群流量數據增長中心',
  description: '專業處理各類網路投票支援：LINE 投票、FB 臉書投票、Google 表單。提供 Threads、IG、FB 大量按讚、追蹤、增粉服務，技術領先，業界首選。',
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
    title: '洛克希德黑克斯 | 特殊網路技術支援中心',
    description: 'LINE/FB/Google 投票買票灌票、社群數據增長專業服務。',
    url: 'https://www.line88.tw',
    siteName: '洛克希德黑克斯',
    locale: 'zh_TW',
    type: 'website',
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
        {/* GA4 追蹤碼 */}
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