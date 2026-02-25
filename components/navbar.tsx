"use client"

import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "Blog", href: "https://blog.line88.tw/" },
  { label: "聯絡我們", href: "/#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // 切換選單的函數
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(!mobileOpen);
  };

  return (
    // 使用最高的 z-index 並確保 bg 顏色是不透明的，避免視覺干擾
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
        
        {/* Logo 區塊 */}
        <Link href="/" className="flex items-center gap-3 z-[10000]">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-full block border border-white/20" 
            style={{ minWidth: '40px', minHeight: '40px' }}
          />
          <span className="text-xl font-bold text-white whitespace-nowrap">
            洛克希德黑克斯
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              className="text-sm font-medium text-gray-300 hover:text-[#00ff00] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Burger - 增加點擊區域面積 */}
        <button 
          className="md:hidden relative w-12 h-12 flex items-center justify-center z-[10000] focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <div className="w-6 flex flex-col gap-1.5 pointer-events-none">
            <span className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown - 確保展開時背景夠黑，且 z-index 正確 */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-20 bg-[#0a0a0a] z-[9998] flex flex-col pt-4 md:hidden animate-in fade-in slide-in-from-top-4 duration-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-6 text-lg font-bold text-gray-200 border-b border-white/5 active:bg-white/10 hover:text-[#00ff00]"
            >
              {link.label}
            </a>
          ))}
          {/* 點擊空白處關閉選單 */}
          <div className="flex-grow" onClick={() => setMobileOpen(false)}></div>
        </div>
      )}
    </nav>
  )
}
