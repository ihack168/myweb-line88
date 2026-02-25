"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新z文章", href: "/blog" },
  { label: "Blog", href: "https://blog.line88.tw/" },
  { label: "聯絡我們", href: "/#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 只要路徑改變就強制關閉選單，解決從 Blogger 回來後的快取問題
  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = "unset"
  }, [pathname])

  const toggleMenu = () => {
    const nextState = !mobileOpen
    setMobileOpen(nextState)
    document.body.style.overflow = nextState ? "hidden" : "unset"
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
      scrolled ? "h-16 bg-black/95 shadow-xl border-b border-white/10" : "h-20 bg-black/80 backdrop-blur-md border-b border-white/5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="w-9 h-9 rounded-full" />
          <span className="text-xl font-black italic text-[#ff8800]">洛克希德黑克斯</span>
        </Link>

        {/* 電腦版 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-bold text-gray-300 hover:text-[#ff8800] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* 漢堡按鈕 */}
        <button onClick={toggleMenu} className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none">
          <span className={`h-0.5 w-6 bg-[#ff8800] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#ff8800] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#ff8800] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {/* 手機版下拉選單 (不透明全螢幕) */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 bg-[#0a0a0a] z-[9998] flex flex-col md:hidden">
          <div className="flex flex-col w-full pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMobileOpen(false)
                  document.body.style.overflow = "unset"
                }}
                className="px-10 py-6 text-2xl font-black italic text-gray-200 border-b border-white/5 active:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* 點擊空白處關閉 */}
          <div className="flex-grow" onClick={() => {
            setMobileOpen(false)
            document.body.style.overflow = "unset"
          }}></div>
        </div>
      )}
    </nav>
  )
}