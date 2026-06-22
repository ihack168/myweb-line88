"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function waitForImages() {
  const images = Array.from(document.images);

  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

function waitForFonts() {
  // modern browsers only
  // @ts-ignore
  if (document.fonts?.ready) {
    // @ts-ignore
    return document.fonts.ready;
  }
  return Promise.resolve();
}

function scrollToId(id: string, offset = 120) {
  const el = document.getElementById(id);
  if (!el) return;

  const top =
    el.getBoundingClientRect().top +
    window.scrollY -
    offset;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

export function useStableAnchorScroll(offset = 120) {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");

    let cancelled = false;

    const run = async () => {
      // 1. 等 DOM render
      await new Promise((r) => requestAnimationFrame(r));

      // 2. 等圖片
      await waitForImages();

      // 3. 等 font
      await waitForFonts();

      // 4. 再等一點 layout settle（關鍵）
      await new Promise((r) => setTimeout(r, 150));

      if (cancelled) return;

      scrollToId(id, offset);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, offset]);
}