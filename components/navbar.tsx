"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

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

  // 監測滾動：頂部透明，滾動後變深色毛玻璃
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileOpen(!mobileOpen)
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 h-20 ${
        scrolled 
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 shadow-lg" 
          : "bg-[#0a0a0a] border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
        
        {/* Logo 區塊：已將發光與陰影改為螢光橘 */}
        <Link href="/" className="flex items-center gap-3 z-[10000] group">
          <div className="relative">
            {/* 螢光橘呼吸燈效果 */}
            <div className="absolute -inset-1 bg-[#ff8800]/30 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="relative w-10 h-10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,136,0,0.2)] transition-transform group-hover:scale-110" 
              style={{ minWidth: '40px', minHeight: '40px' }}
            />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            洛克希德黑克斯
          </span>
        </Link>

        {/* Desktop Nav：懸停顏色與底部線條改為螢光橘 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              className="text-sm font-medium text-gray-300 hover:text-[#ff8800] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8800] transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Burger：按鈕顏色改為螢光橘 */}
        <button 
          className="md:hidden relative w-12 h-12 flex items-center justify-center z-[10000] focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <div className="w-6 flex flex-col gap-1.5 pointer-events-none">
            <span className={`h-0.5 w-full bg-[#ff8800] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-[#ff8800] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-[#ff8800] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown：點擊與懸停效果改為螢光橘 */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-20 bg-[#0a0a0a]/95 backdrop-blur-xl z-[9998] flex flex-col pt-4 md:hidden animate-in fade-in slide-in-from-top-4 duration-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-6 text-xl font-bold text-gray-200 border-b border-white/5 active:bg-[#ff8800]/10 hover:text-[#ff8800] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex-grow" onClick={() => setMobileOpen(false)}></div>
        </div>
      )}
    </nav>
  )
}