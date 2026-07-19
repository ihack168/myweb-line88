"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "聯絡我們", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 強制防 freeze：確保每次 route 都解鎖 body
  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  const closeMenu = () => {
    setMobileOpen(false);
    document.body.style.overflow = "unset";
  };

  const toggleMenu = () => {
    setMobileOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "unset";
      return next;
    });
  };

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-10 h-10 rounded-full border border-[#ff8800]/30"
            />
            <span className="text-lg md:text-2xl font-black italic tracking-tighter text-[#ff8800]">
              洛克希德黑克斯
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl lg:text-2xl font-black tracking-wider text-gray-200 hover:text-[#ff8800] transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile button */}
          <button
            onClick={toggleMenu}
            aria-label="menu"
            className="md:hidden w-12 h-12 rounded-full border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1.5"
          >
            <span className="h-0.5 w-6 bg-[#ff8800]" />
            <span className="h-0.5 w-6 bg-[#ff8800]" />
            <span className="h-0.5 w-6 bg-[#ff8800]" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closeMenu}
          />

          {/* panel */}
          <div className="absolute left-3 right-3 bottom-3 rounded-2xl bg-[#111] border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-[#ff8800] font-black text-xl">
                MENU
              </div>
              <button onClick={closeMenu} className="text-2xl text-white">
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-xl font-black text-white hover:text-[#ff8800]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}