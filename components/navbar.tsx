"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新y文章", href: "/blog" },
  { label: "Blog", href: "https://blog.line88.tw/" },
  { label: "聯絡我們", href: "/#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 1. 處理滾動
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 2. 核心修正：原生 JS 監聽 + 強制重置
  useEffect(() => {
    // 每次路徑改變，強制關閉選單
    setMobileOpen(false)
    document.body.style.overflow = "unset"

    // 解決從 Blogger 回來後的 Bfcache 問題
    const handleToggle = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setMobileOpen((prev) => {
        const next = !prev
        document.body.style.overflow = next ? "hidden" : "unset"
        return next
      })
    }

    const btn = buttonRef.current
    if (btn) {
      // 先移除舊的，再加入新的，確保不重複綁定
      btn.removeEventListener("click", handleToggle)
      btn.addEventListener("click", handleToggle)
    }

    // 監測瀏覽器「回後一頁」或是快取載入事件
    window.onpageshow = (event) => {
      if (event.persisted) {
        window.location.reload() // 如果是從快取回來的，強制重新整理頁面
      }
    }

    return () => {
      if (btn) btn.removeEventListener("click", handleToggle)
    }
  }, [pathname])

  return (
    <>
      {/* 獨立手機按鈕：使用 Ref 綁定原生事件 */}
      <div className="fixed top-5 right-6 z-[10001] md:hidden">
        <button 
          ref={buttonRef}
          type="button"
          className="w-12 h-12 bg-[#ff8800] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-6 flex flex-col gap-1.5 pointer-events-none">
            <span className={`h-0.5 w-full bg-black transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-black transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-black transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[8000] flex justify-center pointer-events-none">
        <div className={`
          flex items-center justify-between px-6 transition-all duration-500 pointer-events-auto
          ${scrolled 
            ? "w-[92%] md:w-[85%] max-w-6xl h-14 mt-4 bg-black/90 border border-white/20 rounded-full shadow-2xl backdrop-blur-md" 
            : "w-full h-20 bg-black border-b border-white/5"
          }
        `}>
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full border border-white/10" />
            <span className="text-lg md:text-xl font-black italic text-[#ff8800]">洛克希德黑克斯</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-bold text-gray-300 hover:text-[#ff8800] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden w-12" />
        </div>
      </nav>

      {/* 手機版全螢幕選單 */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black z-[9999] md:hidden flex flex-col pt-32 animate-in fade-in duration-200">
          <div className="flex flex-col w-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMobileOpen(false)
                  document.body.style.overflow = "unset"
                }}
                className="px-10 py-6 text-2xl font-black italic text-gray-200 border-b border-white/5 active:bg-[#ff8800]/10 hover:text-[#ff8800]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex-grow w-full" onClick={() => {
            setMobileOpen(false)
            document.body.style.overflow = "unset"
          }}></div>
        </div>
      )}
    </>
  )
}