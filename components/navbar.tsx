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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-300">
      {/* 💡 容器優化：改為漂浮式的玻璃質感卡片，讓 Logo 不再只是死板地貼在最上方 */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Logo 區域：加上 Hover 輕微發光與放大效果 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/images/logo.png"
              alt="洛克希德黑克斯 Logo"
              width={38}
              height={38}
              className="rounded-full relative z-10 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110"
            />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-primary transition-all duration-300">
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
              className="text-sm font-medium text-gray-400 hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
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
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown：同樣加上圓角與玻璃質感 */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a]/95 backdrop-blur-lg border border-white/10 rounded-2xl md:hidden flex flex-col py-4 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
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