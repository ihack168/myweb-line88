"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
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

  useEffect(() => {
    setMobileOpen(false)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "unset"
    }
  }, [pathname])

  const toggleMenu = () => {
    const nextState = !mobileOpen
    setMobileOpen(nextState)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = nextState ? "hidden" : "unset"
    }
  }

  return (
    <>
      {/* 浮島導覽列 */}
      <nav className="fixed top-0 left-0 right-0 z-[50] flex justify-center pointer-events-none">
        <div 
          className={`
            flex items-center justify-between px-8 transition-all duration-500 pointer-events-auto
            ${scrolled 
              ? "w-[92%] md:w-[85%] max-w-6xl h-16 mt-4 bg-black/80 border border-white/20 rounded-full shadow-2xl backdrop-blur-md" 
              : "w-full h-20 bg-black/50 backdrop-blur-sm border-b border-white/5"
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-[60]">
            <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-[#ff8800]/30 shadow-[0_0_10px_rgba(255,136,0,0.3)]" />
            <span className="text-xl md:text-2xl font-black italic tracking-tighter text-[#ff8800] drop-shadow-[0_0_8px_rgba(255,136,0,0.5)]">
              洛克希德黑克斯
            </span>
          </Link>

          {/* 電腦版選單 */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-lg font-black tracking-widest text-gray-200 hover:text-[#ff8800] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8800] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* 漢堡按鈕 (開啟用) */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 z-[60]"
          >
            <span className="h-0.5 w-7 bg-[#ff8800] shadow-[0_0_5px_rgba(255,136,0,0.5)]" />
            <span className="h-0.5 w-7 bg-[#ff8800] shadow-[0_0_5px_rgba(255,136,0,0.5)]" />
            <span className="h-0.5 w-7 bg-[#ff8800] shadow-[0_0_5px_rgba(255,136,0,0.5)]" />
          </button>
        </div>
      </nav>

      {/* 手機全螢幕選單 */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[100] md:hidden flex flex-col pt-24 px-12 animate-in fade-in zoom-in-95 duration-300">
          
          {/* 右上角關閉按鈕 (X) */}
          <button 
            onClick={toggleMenu}
            className="absolute top-7 right-8 w-12 h-12 flex items-center justify-center z-[110]"
          >
            <div className="relative w-7 h-7">
              <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#ff8800] rotate-45 shadow-[0_0_5px_rgba(255,136,0,0.5)]"></span>
              <span className="absolute top-1/2 left-0 w-full h-0.5 bg-[#ff8800] -rotate-45 shadow-[0_0_5px_rgba(255,136,0,0.5)]"></span>
            </div>
          </button>

          <div className="flex flex-col w-full gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMobileOpen(false)
                  document.body.style.overflow = "unset"
                }}
                className="py-5 text-2xl font-black italic tracking-wider text-gray-100 border-b border-white/5 active:text-[#ff8800] flex justify-between items-center group"
              >
                {link.label}
                <span className="text-[#ff8800] opacity-0 group-active:opacity-100">→</span>
              </Link>
            ))}
          </div>
          
          {/* 點擊選單下方空白處也能關閉 */}
          <div className="flex-grow" onClick={toggleMenu}></div>
        </div>
      )}
    </>
  )
}