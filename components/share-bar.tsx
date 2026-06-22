"use client";

import { useEffect, useState } from "react";

export function ShareBar() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const current = window.location.href;
    const utmUrl =
      current +
      (current.includes("?") ? "&" : "?") +
      "utm_source=share&utm_medium=social";

    setUrl(utmUrl);
  }, []);

  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2">
      <div className="flex gap-2 rounded-full bg-black/80 px-4 py-3 text-white backdrop-blur border border-white/10">

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold"
        >
          FB
        </a>

        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          className="rounded-full bg-green-500 px-4 py-2 text-xs font-bold"
        >
          LINE
        </a>

        <button
          onClick={() => navigator.clipboard.writeText(url)}
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold"
        >
          COPY
        </button>

      </div>
    </div>
  );
}