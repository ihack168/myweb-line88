"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // 強制在路徑變動或頁面載入時關閉選單
    setMobileOpen(false)
    document.body.style.overflow = "unset"

    const toggle = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setMobileOpen((prev) => {
        const next = !prev
        document.body.style.overflow = next ? "hidden" : "unset"
        return next
      });
    };

    const btn = buttonRef.current
    if (btn) {
      btn.addEventListener("click", toggle)
    }

    // 解決從外部連結(Blogger)回來時的快取問題
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener("pageshow", handlePageShow)

    return () => {
      if (btn) btn.removeEventListener("click", toggle)
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [pathname])

  const navLinks = [
    { label: "首頁", href: "/" },
    { label: "服務介紹", href: "/#services" },
    { label: "最新z文章", href: "/blog" },
    { label: "Blog", href: "https://blog.line88.tw/" },
    { label: "聯絡我們", href: "/#contact" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[8000] flex justify-center">
        <div className={`
          flex items-center justify-between px-6 transition-all duration-500
          ${scrolled 
            ? "w-[95%] md:w-[85%] max-w-6xl h-16 mt-4 bg-black/90 border border-white/20 rounded-full shadow-2xl backdrop-blur-md" 
            : "w-full h-20 bg-black border-b border-white/5"
          }
        `}>
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-black italic text-[#ff8800]">洛克希德黑克斯</span>
          </Link>

          {/* 電腦版 */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="font-bold text-gray-300 hover:text-[#ff8800]">
                {link.label}
              </Link>
            ))}
          </div>

          {/* 手機按鈕 */}
          <button ref={buttonRef} className="md:hidden w-10 h-10 flex flex-col gap-1.5 justify-center items-center z-[10001]">
            <span className={`h-0.5 w-6 bg-[#ff8800] transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-6 bg-[#ff8800] transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-[#ff8800] transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* 手機選單內容 */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black z-[9000] flex flex-col pt-32 px-10 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setMobileOpen(false)
                document.body.style.overflow = "unset"
              }}
              className="py-6 text-2xl font-black italic text-gray-200 border-b border-white/5 active:text-[#ff8800]"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex-grow" onClick={() => setMobileOpen(false)}></div>
        </div>
      )}
    </>
  )
}