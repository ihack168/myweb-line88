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
    <nav className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pt-0 md:pt-4 pointer-events-none">
      <div 
        className={`
          flex items-center justify-between px-6 transition-all duration-500 ease-in-out pointer-events-auto
          ${scrolled 
            ? "w-[95%] md:w-[85%] max-w-6xl h-16 bg-[#0a0a0a] border border-white/20 rounded-full shadow-[0_0_25px_rgba(255,136,0,0.15)]" 
            : "w-full h-20 bg-[#0a0a0a] border-b border-white/5 rounded-none"
          }
        `}
      >
        {/* Logo 區塊 */}
        <Link href="/" className="flex items-center gap-3 z-[10000] group">
          <div className="relative">
            <div className="absolute -inset-1 bg-[#ff8800]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="relative w-10 h-10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,136,0,0.2)] transition-transform group-hover:scale-110" 
              style={{ minWidth: '40px', minHeight: '40px' }}
            />
          </div>
          <span className="text-xl font-black italic tracking-tighter text-[#ff8800] drop-shadow-[0_0_10px_rgba(255,136,0,0.5)]">
            洛克希德黑克斯
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              className="text-base lg:text-lg font-bold tracking-wide text-gray-300 hover:text-[#ff8800] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8800] transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Burger */}
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

      {/* Mobile Dropdown - 修改重點：完全不透明背景 bg-[#0a0a0a] */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-0 bg-[#0a0a0a] z-[9998] flex flex-col pt-24 md:hidden animate-in fade-in duration-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              onClick={() => setMobileOpen(false)}
              className="px-10 py-6 text-2xl font-black italic text-gray-200 border-b border-white/5 active:text-[#ff8800] hover:text-[#ff8800] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex-grow bg-[#0a0a0a]" onClick={() => setMobileOpen(false)}></div>
        </div>
      )}
    </nav>
  )
}