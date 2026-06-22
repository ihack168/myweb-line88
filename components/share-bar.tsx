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

  // ✅ 直接導頁，不做任何 scroll
  const handleContact = () => {
    window.location.href = "/contact";
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex items-center gap-2 bg-black/80 px-4 py-3 rounded-full text-white">

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          FB
        </a>

        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          LINE
        </a>

        <button onClick={handleCopy}>
          {copied ? "已複製" : "COPY"}
        </button>

        <button onClick={handleContact}>
          聯絡我 →
        </button>

      </div>
    </div>
  );
}