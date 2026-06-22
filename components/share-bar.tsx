"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ShareBar() {
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleContact = () => {
    if (typeof window === "undefined") return;

    if (window.location.pathname === "/") {
      const contactSection = document.getElementById("contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
    }

    sessionStorage.setItem("scrollTo", "contact");
    router.push("/");
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-3 text-white shadow-2xl backdrop-blur">
        <span className="pr-1 text-xs font-bold text-gray-400">
          分享
        </span>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold transition hover:opacity-90"
        >
          FB
        </a>

        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-4 py-2 text-xs font-bold transition hover:opacity-90"
        >
          LINE
        </a>

        <button
          onClick={handleCopy}
          disabled={!url}
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "已複製！" : "COPY"}
        </button>

        <div className="mx-1 h-5 w-px bg-white/20" />

        <button
          onClick={handleContact}
          className="rounded-full bg-[#ff8800] px-4 py-2 text-xs font-black text-black transition hover:scale-105"
        >
          聯絡我 →
        </button>
      </div>
    </div>
  );
}