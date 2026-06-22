"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function FloatingBar() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const current = window.location.href;
    const utmUrl =
      current +
      (current.includes("?") ? "&" : "?") +
      "utm_source=share&utm_medium=social";
    setUrl(utmUrl);
  }, []);

  const encodedUrl = encodeURIComponent(url);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContact = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("scrollTo", "contact");
    }
    router.push("/");
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full bg-black/80 px-4 py-3 text-white backdrop-blur border border-white/10 shadow-2xl">

        <span className="text-xs font-bold text-gray-400 pr-1">分享</span>

        
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold"
        >
          FB
        </a>
        
          <a shref={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-4 py-2 text-xs font-bold"
        >
          LINE
        </a>

        <button
          onClick={handleCopy}
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition"
        >
          {copied ? "已複製！" : "COPY"}
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={handleContact}
          className="rounded-full bg-[#ff8800] px-4 py-2 text-xs font-black text-black transition hover:scale-105"
        >
          與我聯絡 →
        </button>

      </div>
    </div>
  );
}