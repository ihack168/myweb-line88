"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { label: "首頁", href: "#hero" },
  { label: "服務介紹", href: "#services" },
  { label: "Blog", href: "#blog" },
  { label: "聯絡我們", href: "#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-border">
      <Link href="#hero" className="flex items-center gap-2">
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
