import Link from 'next/link'

const footerLinks = [
  { label: '首頁', href: '/' },
  { label: '最新文章', href: '/blog' },
  { label: '關於我們', href: '/about' },
  { label: '聯絡我們', href: '/contact' },
  { label: '隱私權政策', href: '/privacy' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#070707] px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <Link
            href="/"
            className="text-lg font-black text-[#ff8800] transition-opacity hover:opacity-80"
          >
            洛克希德黑克斯
          </Link>

          <nav
            aria-label="頁尾導覽"
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-400 transition-colors hover:text-[#ff8800]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="max-w-4xl text-xs leading-6 text-gray-500">
            免責聲明：本網站內容為網路投票、社群流量、AEO、GEO、SEO 與 AI
            數位行銷相關資訊分享，僅供一般參考。實際執行方式與成效會因平台規則、
            帳號狀態、網站條件及使用情境而有所不同，不代表任何成果保證。
          </p>

          <p className="text-xs text-gray-600">
            © 2016-{currentYear} 洛克希德黑克斯 Lockhead Hex. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}