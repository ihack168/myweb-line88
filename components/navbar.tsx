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

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[9999] bg-[#0a0a0a] border-b border-white/10"
      style={{ height: '80px' }} 
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo 區塊 */}
        <Link href="/" className="flex items-center gap-3">
          {/* 使用原生 img 標籤測試，這能排除 Next.js Image 組件的問題 */}
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              // 如果圖片路徑錯了，會顯示這一行字提醒你
              console.error("Logo 圖片載入失敗，請檢查 public/images/logo.png 是否存在");
            }}
          />
          <span className="text-xl font-bold text-white">
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
              rel={link.href.startsWith("http") ? "noopener noreferrer" : ""}
              className="text-sm font-medium text-gray-300 hover:text-[#ff4500] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-[#0a0a0a] border-b border-white/10 flex flex-col py-4 md:hidden shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-4 text-gray-300 hover:text-[#ff4500] hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}