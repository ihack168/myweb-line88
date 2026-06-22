"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "聯絡我們", href: "/#contact" },
]

function scrollToElement(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const y =
    el.getBoundingClientRect().top +
    window.scrollY -
    90 // navbar offset（保留你原本視覺）

  window.scrollTo({
    top: y,
    behavior: "smooth",
  })
}

function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  router: ReturnType<typeof useRouter>
) {
  if (!href.includes("#")) return

  e.preventDefault()

  const [path, hash] = href.split("#")
  const targetId = hash

  // 同頁
  if (pathname === (path || "/")) {
    requestAnimationFrame(() => {
      scrollToElement(targetId)
    })
    return
  }

  // 跨頁
  sessionStorage.setItem("scrollTo", targetId)
  router.push(path || "/")
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // scroll effect（保留你原本 header shrink 邏輯）
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 🔥 唯一 anchor restore（修正跳動問題核心）
  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTo")
    if (!targetId) return

    sessionStorage.removeItem("scrollTo")

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToElement(targetId)
      })
    }, 200)

    return () => clearTimeout(timer)
  }, [pathname])

  // close menu on route change
  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = "unset"
  }, [pathname])

  const toggleMenu = () => {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? "hidden" : "unset"
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[50] flex justify-center pointer-events-none">
        <div
          className={`
            flex items-center justify-between px-5 md:px-8 transition-all duration-500 pointer-events-auto

            ${
              scrolled
                ? "w-[92%] md:w-[85%] max-w-6xl h-16 mt-4 bg-black/80 border border-white/20 rounded-full shadow-2xl backdrop-blur-md"
                : "w-full h-20 bg-black/50 backdrop-blur-sm border-b border-white/5"
            }
          `}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-10 h-10 rounded-full border border-[#ff8800]/30 shadow-[0_0_10px_rgba(255,136,0,0.3)]"
            />
            <span className="text-lg md:text-2xl font-black italic tracking-tighter text-[#ff8800] drop-shadow-[0_0_8px_rgba(255,136,0,0.5)]">
              洛克希德黑克斯
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                onClick={(e) =>
                  handleAnchorClick(e, link.href, pathname, router)
                }
                className="
                  text-lg font-black tracking-widest
                  text-gray-200 hover:text-[#ff8800]
                  transition-colors relative group
                "
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff8800] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={toggleMenu}
            aria-label="開啟選單"
            className="md:hidden w-11 h-11 rounded-full border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition"
          >
            <span className="h-0.5 w-6 bg-[#ff8800] rounded-full" />
            <span className="h-0.5 w-6 bg-[#ff8800] rounded-full" />
            <span className="h-0.5 w-6 bg-[#ff8800] rounded-full" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          <div className="absolute left-3 right-3 bottom-3 rounded-[2rem] border border-white/10 bg-[#111]/95 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <p className="text-xl font-black text-[#ff8800] italic">
                洛克希德黑克斯
              </p>
            </div>

            <div className="px-4 py-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href, pathname, router)
                    setMobileOpen(false)
                  }}
                  className="
                    flex items-center justify-between px-5 py-4
                    rounded-2xl text-lg font-black tracking-wider
                    text-gray-100 hover:bg-white/5 transition
                  "
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-[#ff8800]/70">
                      0{index + 1}
                    </span>
                    {link.label}
                  </span>
                  <span className="text-[#ff8800]">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}