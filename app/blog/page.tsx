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
    // 改回滿版式的 fixed，這樣最穩定，絕對不會消失
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo 區塊：直接給定寬高，確保不被壓縮 */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
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
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 flex flex-col py-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-4 text-gray-300 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}