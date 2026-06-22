"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleContact = () => {
    if (window.location.pathname === "/") {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    sessionStorage.setItem("scrollTo", "contact");
    router.push("/");
  };

  return (
    <header
      className={`
        fixed top-0 z-50 w-full transition-all
        ${scrolled ? "bg-black/80 backdrop-blur border-b border-white/10" : "bg-transparent"}
      `}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3 md:px-6">
        
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer text-lg font-black text-[#ff8800] whitespace-nowrap"
        >
          LINE88
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Optional links (desktop only) */}
          <nav className="hidden md:flex items-center gap-4 text-sm text-white/80">
            <button onClick={() => router.push("/blog")} className="hover:text-white">
              Blog
            </button>
            <button onClick={() => router.push("/about")} className="hover:text-white">
              About
            </button>
          </nav>

          {/* Contact button */}
          <button
            onClick={handleContact}
            className="
              whitespace-nowrap
              rounded-full
              bg-[#ff8800]
              px-3 py-2
              text-xs font-black text-black
              transition hover:scale-105
              md:px-4 md:text-sm
            "
          >
            與我聯絡 →
          </button>
        </div>
      </div>
    </header>
  );
}