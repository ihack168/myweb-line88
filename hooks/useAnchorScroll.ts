"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAnchorScroll(offset = 80) {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (!el) return false;

      const top =
        el.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      return true;
    };

    let attempts = 0;

    const timer = setInterval(() => {
      attempts++;

      if (tryScroll() || attempts > 10) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [pathname, offset]);
}