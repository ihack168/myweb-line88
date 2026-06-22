"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "聯絡我們", href: "/contact" }, // ✅ 改成新頁面
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

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  const toggleMenu = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? "hidden" : "unset";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[50] flex justify-center pointer-events-none">
      <div
        className={`flex items-center justify-between px-5 md:px-8 transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "w-[92%] md:w-[85%] max-w-6xl h-16 mt-4 bg-black/80 border border-white/20 rounded-full shadow-2xl backdrop-blur-md"
            : "w-full h-20 bg-black/50 backdrop-blur-sm border-b border-white/5"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.png" className="w-10 h-10 rounded-full" />
          <span className="text-[#ff8800] font-black">洛克希德黑克斯</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-200 font-black hover:text-[#ff8800]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden w-10 h-10 text-white"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}