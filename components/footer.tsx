import Link from 'next/link'

const footerLinks = [
  {
    label: '首頁',
    href: '/',
  },
  {
    label: '最新文章',
    href: '/blog',
  },
  {
    label: '關於我們',
    href: '/about',
  },
  {
    label: '聯絡我們',
    href: '/contact',
  },
  {
    label: '隱私權政策',
    href: '/privacy',
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#070707] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* 品牌名稱與簡介 */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="text-lg font-black text-[#ff8800] transition-opacity hover:opacity-80"
            >
              洛克希德黑克斯
            </Link>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              提供網路投票、Facebook、Instagram、Threads
              社群流量增長、AEO、GEO、SEO 關鍵字優化，以及 LINE
              官方帳號 AI 客服串接相關資訊與技術分享。
            </p>
          </div>

          {/* Footer 導航 */}
          <nav
            aria-label="頁尾導覽"
            className="flex max-w-md flex-wrap gap-x-6 gap-y-3 text-sm"
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
        </div>

        {/* 免責聲明 */}
        <div className="py-8">
          <p className="text-xs leading-6 text-gray-500">
            免責聲明：本網站內容主要為網路投票、社群流量增長、AEO、SEO、GEO
            與 AI 數位行銷相關技術資訊分享，僅供一般參考使用。實際操作方式、
            執行流程、成效表現與可行方案，會因平台規則、帳號狀態、活動機制、
            網站體質、產業類型、競爭程度與實際使用情境不同而有所差異。
            本網站文章不代表成果保證，也不構成固定操作承諾；實際方案與執行內容，
            請以雙方聯絡討論後確認的結果為準。
          </p>
        </div>

        {/* 版權 */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2016-{currentYear} 洛克希德黑克斯 Lockhead Hex. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}