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
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo 區塊 */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-full block" 
            style={{ minWidth: '40px', minHeight: '40px' }} // 強制給予尺寸
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
              className="text-sm font-medium text-gray-300 hover:text-[#00ff00] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Burger */}
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>
    </nav>
  )
}