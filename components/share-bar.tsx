"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function stableScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - 80;

  window.scrollTo({ top, behavior: "smooth" });
}

export function ShareBar() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const current = window.location.href;
    setUrl(current);
  }, []);

  const encodedUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContact = () => {
    if (window.location.pathname !== "/") {
      sessionStorage.setItem("scrollTo", "contact");
      router.push("/");
      return;
    }

    requestAnimationFrame(() => {
      setTimeout(() => stableScrollTo("contact"), 300);
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex gap-2 bg-black/80 px-4 py-3 rounded-full">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        >
          FB
        </a>

        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
        >
          LINE
        </a>

        <button onClick={handleCopy}>
          {copied ? "已複製" : "COPY"}
        </button>

        <button onClick={handleContact}>聯絡我 →</button>
      </div>
    </div>
  );
}