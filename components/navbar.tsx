"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "服務介紹", href: "/#services" },
  { label: "最新文章", href: "/blog" },
  { label: "聯絡我們", href: "#contact" }, // 👈 改成純 hash
];

function stableScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - 80;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  const handleClick = (href: string) => {
    if (href === "#contact") {
      if (pathname !== "/") {
        sessionStorage.setItem("scrollTo", "contact");
        router.push("/");
        return;
      }

      requestAnimationFrame(() => {
        setTimeout(() => stableScrollTo("contact"), 300);
      });

      return;
    }

    router.push(href);
  };

  // 🚀 cross-page scroll fix
  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTo");
    if (!targetId) return;

    sessionStorage.removeItem("scrollTo");

    const run = () => {
      const el = document.getElementById(targetId);
      if (!el) return false;

      const top = el.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({ top, behavior: "smooth" });
      return true;
    };

    let tries = 0;

    const timer = setInterval(() => {
      tries++;
      if (run() || tries > 20) clearInterval(timer);
    }, 100);

    return () => clearInterval(timer);
  }, [pathname]);

  return (
    <>
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
              <button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="text-gray-200 font-black hover:text-[#ff8800]"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10"
          >
            ☰
          </button>
        </div>
      </nav>
    </>
  );
}