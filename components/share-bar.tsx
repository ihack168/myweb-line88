"use client";

import { useEffect, useState } from "react";

export function ShareBar() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // 👉 直接進 contact page（不再 anchor / scroll）
  const handleContact = () => {
    window.location.href = "/contact";
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex items-center gap-1 md:gap-2 rounded-full border border-white/10 bg-black/80 px-2 py-2 md:px-4 md:py-3 text-white shadow-2xl backdrop-blur">

        {/* label */}
        <span className="hidden md:block pr-1 text-xs font-bold text-gray-400 whitespace-nowrap">
          分享
        </span>

        {/* FB */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap rounded-full bg-blue-600 px-2 md:px-4 py-2 text-[11px] md:text-xs font-bold transition hover:opacity-90"
        >
          FB
        </a>

        {/* LINE */}
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap rounded-full bg-green-500 px-2 md:px-4 py-2 text-[11px] md:text-xs font-bold transition hover:opacity-90"
        >
          LINE
        </a>

        {/* COPY */}
        <button
          onClick={handleCopy}
          disabled={!url}
          className="whitespace-nowrap rounded-full bg-white/10 px-2 md:px-4 py-2 text-[11px] md:text-xs font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "已複製！" : "COPY"}
        </button>

        <div className="mx-1 h-5 w-px bg-white/20" />

        {/* CONTACT */}
        <button
          onClick={handleContact}
          className="whitespace-nowrap rounded-full bg-[#ff8800] px-2 md:px-4 py-2 text-[11px] md:text-xs font-black text-black transition hover:scale-105"
        >
          聯絡我 →
        </button>

      </div>
    </div>
  );
}