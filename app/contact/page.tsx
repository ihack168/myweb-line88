"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-24">
      
      {/* HERO */}
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#ff8800] mb-6">
          立即聯絡我們
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          提供 LINE / Email / Facebook 即時聯絡方式，
          我們會在最短時間內回覆你的需求。
        </p>
      </div>

      {/* CTA CARDS */}
      <div className="max-w-4xl mx-auto mt-16 grid gap-6 md:grid-cols-3">

        {/* LINE */}
        <a
          href="https://line.me/R/ti/p/~line88.tw"
          target="_blank"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-green-400 transition"
        >
          <div className="text-green-400 text-xl font-black mb-2">
            LINE 即時諮詢
          </div>
          <p className="text-gray-400 text-sm">
            點擊加入 LINE 立即對話
          </p>
        </a>

        {/* EMAIL */}
        <a
          href="mailto:ihack168@gmail.com"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-400 transition"
        >
          <div className="text-blue-400 text-xl font-black mb-2">
            Email 聯絡
          </div>
          <p className="text-gray-400 text-sm">
            發送需求到信箱
          </p>
        </a>

        {/* FACEBOOK */}
        <a
          href="https://www.facebook.com/lockheadhex"
          target="_blank"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-[#ff8800] transition"
        >
          <div className="text-[#ff8800] text-xl font-black mb-2">
            Facebook 粉專
          </div>
          <p className="text-gray-400 text-sm">
            透過 FB 私訊我們
          </p>
        </a>

      </div>

      {/* BACK HOME */}
      <div className="text-center mt-16">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition"
        >
          ← 返回首頁
        </Link>
      </div>
    </div>
  );
}