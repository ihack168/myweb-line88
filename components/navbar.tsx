"use client"

import Image from "next/image"
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
    // 重點 1：加上 z-[9999] 確保它永遠在最上層
    <nav className="fixed top-4 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
      {/* 重點 2：內層容器開啟 pointer-events-auto 讓按鈕可以點擊 */}
      <div className="w-full max-w-6xl flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] pointer-events-auto">
        
        {/* Logo 區域 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/images/logo.png"
              alt="洛克希德黑克斯 Logo"
              fill
              sizes="36px"
              className="rounded-full relative z-10 transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110 object-cover"
            />
          </div>
          <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">
            洛克希德黑克斯
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : ""}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-[#0a0a0a]/98 backdrop-blur-xl border border-white/10 rounded-2xl md:hidden flex flex-col py-4 shadow-2xl pointer-events-auto overflow-hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-3 text-sm font-medium text-gray-300 hover:text-primary hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}