import type { Metadata } from 'next'
import { Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script' // 匯入 Script 元件用於 GA4
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
  // 核心 SEO 標題
  title: '洛克希德黑克斯 | 全台最強網路投票支援、買票灌票、流量數據增長中心',
  description: '專業處理各類網路投票支援：LINE 投票、FB 臉書投票、Google 表單、網站投票買票灌票。提供 100% 擬真流量與不重複 IP 隱蔽技術。同步提供 FB、IG、Threads、TikTok 大量按讚追蹤，穩定提升社群曝光量，技術領先，業界首選。',
  
  // 網站圖標
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },

  // SEO 關鍵字
  keywords: [
    '網路投票買票', '網路投票灌票', 'LINE投票買票', 'FB投票灌票', 
    'Google表單投票', '網站投票破解', '增加投票數', 'Threads增粉', 
    'FB大量按讚', 'IG買追蹤', '流量優化', '網路投票數據支援'
  ],

  // OpenGraph 社群分享設定
  openGraph: {
    title: '洛克希德黑克斯 - 網路投票數據支援與社群增長',
    description: '安全、快速、高效的網路投票解決方案。不論是 LINE、FB 或網頁投票，我們提供最專業的數據推進服務。',
    // ✨ 修正點：更新為正式網域
    url: 'https://www.line88.tw/',
    siteName: '洛克希德黑克斯',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '洛克希德黑克斯數據支援中心',
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
  // ✨ 新增：定義標準網址，防止重複內容扣分
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
      <body className="font-sans antialiased">
        {/* Google Analytics (GA4) 🚀 */}
        {/* 請將下方兩處 G-XXXXXXXXXX 替換為你的 GA 評量 ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=	G-2X29DPN458"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '	G-2X29DPN458');
          `}
        </Script>

        {children}
        <Analytics />
      </body>
    </html>
  )
}