import type { Metadata } from 'next'
import { Noto_Sans_TC, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _notoSansTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700', '900'] })
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'aaaaaaaa洛克希德黑克斯 | Lockhead Hex',
  description: '洛克希德黑克斯 - 專業網路服務，社群媒體行銷、投票服務、AI客服串接',
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
