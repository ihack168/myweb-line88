"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "聯絡我們", href: "/#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 偵測滾動，讓 Navbar 在滾動後變色
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 h-20 ${
        scrolled 
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 shadow-lg" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo 區塊：加上陰影與懸停發光效果 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-[#00ff00]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="relative w-10 h-10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(0,255,0,0.1)] transition-transform group-hover:scale-110" 
            />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            洛克希德黑克斯
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-sm font-medium text-gray-300 hover:text-[#00ff00] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff00] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-[#00ff00] transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-[#00ff00] transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-[#00ff00] transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* 手機版下拉選單：半透明磨砂背景 */}
      {mobileOpen && (
        <div className="fixed inset-0 top-20 bg-[#0a0a0a]/95 backdrop-blur-xl z-[9998] flex flex-col p-6 md:hidden animate-in fade-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileOpen(false)} 
              className="py-6 text-xl font-bold border-b border-white/5 text-gray-200 active:text-[#00ff00]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
