"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新zz文章", href: "/blog" },
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

  // 路徑變動強制重置
  useEffect(() => {
    setMobileOpen(false)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "unset"
    }
  }, [pathname])

  const toggleMenu = () => {
    const nextState = !mobileOpen
    setMobileOpen(nextState)
    document.body.style.overflow = nextState ? "hidden" : "unset"
  }

  return (
    <>
      {/* 浮島導覽列 */}
      <nav className="fixed top-0 left-0 right-0 z-[50] flex justify-center pointer-events-none">
        <div 
          className={`
            flex items-center justify-between px-6 transition-all duration-500 pointer-events-auto
            ${scrolled 
              ? "w-[92%] md:w-[85%] max-w-6xl h-14 mt-4 bg-black/80 border border-white/20 rounded-full shadow-2xl backdrop-blur-md" 
              : "w-full h-20 bg-black/50 backdrop-blur-sm border-b border-white/5"
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-[60]">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full border border-[#ff8800]/30" />
            <span className="text-lg font-black italic text-[#ff8800]">洛克希德黑克斯</span>
          </Link>

          {/* 電腦版 */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-bold text-gray-300 hover:text-[#ff8800] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* 漢堡按鈕 */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[60]"
          >
            <span className={`h-0.5 w-6 bg-[#ff8800] transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-6 bg-[#ff8800] transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-[#ff8800] transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* 手機全螢幕選單 - 確保背景完全覆蓋且不透明 */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[100] md:hidden flex flex-col pt-32 px-10 animate-in fade-in duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setMobileOpen(false)
                document.body.style.overflow = "unset"
              }}
              className="py-6 text-2xl font-black italic text-gray-100 border-b border-white/10 active:text-[#ff8800]"
            >
              {link.label}
            </Link>
          ))}
          {/* 底部留白點擊關閉 */}
          <div className="flex-grow" onClick={toggleMenu}></div>
        </div>
      )}
    </>
  )
}