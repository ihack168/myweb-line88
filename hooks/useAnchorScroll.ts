"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAnchorScroll(offset = 120) {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");

    let rafId: number;

    const scrollToElement = () => {
      const el = document.getElementById(id);
      if (!el) {
        rafId = requestAnimationFrame(scrollToElement);
        return;
      }

      const rect = el.getBoundingClientRect();

      const top =
        rect.top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    };

    rafId = requestAnimationFrame(scrollToElement);

    return () => cancelAnimationFrame(rafId);
  }, [pathname, offset]);
}