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

function scrollToId(id: string) {
  setTimeout(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (!el) return

      const y = el.getBoundingClientRect().top + window.scrollY - 80

      window.scrollTo({
        top: y,
        behavior: "smooth",
      })
    })
  }, 80)
}

function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  router: ReturnType<typeof useRouter>
) {
  if (!href.includes("#")) return

  const [path, hash] = href.split("#")
  const targetId = hash

  // 同頁 anchor
  if (pathname === (path || "/")) {
    e.preventDefault()
    scrollToId(targetId)
    return
  }

  // 跨頁
  e.preventDefault()
  sessionStorage.setItem("scrollTo", targetId)
  router.push(path || "/")
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 🔥 關鍵：跨頁 anchor restore（你原本缺的）
  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTo")
    if (!targetId) return

    sessionStorage.removeItem("scrollTo")

    // 等 page render 完
    setTimeout(() => {
      scrollToId(targetId)
    }, 300)
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
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              className="w-10 h-10 rounded-full"
              alt="logo"
            />
            <span className="text-[#ff8800] font-black">
              洛克希德黑克斯
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) =>
                  handleAnchorClick(e, link.href, pathname, router)
                }
                className="text-gray-200 hover:text-[#ff8800] font-black"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button onClick={toggleMenu} className="md:hidden">
            ☰
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={toggleMenu} />

          <div className="absolute bottom-3 left-3 right-3 bg-[#111] rounded-2xl p-4">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  handleAnchorClick(e, link.href, pathname, router)
                  setMobileOpen(false)
                }}
                className="block py-3 text-white"
              >
                0{i + 1} {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}