"use client";

import { useState } from "react";
import Link from "next/link";

interface PostThumbnailProps {
  slug: string;
  title: string;
  thumbnail: string;
  videoId?: string;
}

// 唯一需要留在 client 端的互動：點縮圖上的播放鍵直接內嵌播放 YouTube。
// 其餘資料（文章列表、標籤、分頁）都已經在 page.tsx 的 Server Component
// 裡處理完，這裡只負責這一小塊 UI 狀態，不影響 SSR 內容的完整性。
export function PostThumbnail({ slug, title, thumbnail, videoId }: PostThumbnailProps) {
  const [playing, setPlaying] = useState(false);

  if (playing && videoId) {
    return (
      <div className="relative h-52 w-full bg-black overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full border-none"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className="relative h-52 w-full bg-black overflow-hidden">
      <Link
        href={`/blog/${slug}`}
        className="block w-full h-full cursor-pointer overflow-hidden"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 italic text-sm">
            NO IMAGE FOUND
          </div>
        )}
      </Link>

      {videoId && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPlaying(true);
            }}
            className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer"
          >
            <div className="border-l-[18px] border-l-white border-y-[11px] border-y-transparent ml-1"></div>
          </div>
        </div>
      )}
    </div>
  );
}