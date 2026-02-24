"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { label: "首頁", href: "/" }, // 改為 / 確保從 blog 頁面也能回首頁
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "Blog", href: "https://blog.line88.tw/" },
  { label: "聯絡我們", href: "/#contact" }, // 加上斜線確保跨頁跳轉
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-border">
      {/* 修正：Logo 的 Link 也改為 / 回首頁 */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="洛克希德黑克斯 Logo"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="text-lg font-bold text-primary">洛克希德黑克斯</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            // 💡 密技：如果是 http 開頭，自動用新分頁開啟，保護官網不被關閉
            target={link.href.startsWith("http") ? "_blank" : "_self"}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : ""}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile burger */}
      <button
        className="md:hidden flex flex-col gap-1 p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-0.5 bg-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
        <span className={`block w-5 h-0.5 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-border md:hidden flex flex-col py-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              onClick={() => setMobileOpen(false)}
              className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}