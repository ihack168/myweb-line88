import type { Metadata } from 'next'
import { Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _notoSansTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700', '900'] })
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '洛克希德黑克斯 | Lockhead Hex 特殊網路服務中心',
  description: '特殊網路服務中心 買票、灌票、Line網路投票 Facebook網路投票 Google網路投票 Facebook、IG、Threads大量按讚、大量追蹤',
  icons: {
    icon: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
