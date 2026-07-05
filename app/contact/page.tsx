"use client";

import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-white/5">
          <Image
            src="/contact.png"
            alt="聯絡我們"
            width={1200}
            height={900}
            priority
            className="w-full h-auto object-cover scale-105 animate-[contactZoom_16s_ease-in-out_infinite_alternate]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/10" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="mb-4 rounded-full border border-[#ff8800]/40 bg-black/40 px-5 py-2 text-sm text-[#ffb35c] backdrop-blur-md">
              LINE・Email・Facebook
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#ff8800] drop-shadow-xl">
              聯絡我們
            </h1>

            <p className="mt-5 max-w-2xl text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-lg">
              提供 LINE、Email、Facebook 等多種聯絡方式，
              有任何合作需求或技術問題，歡迎隨時與我們聯繫。
            </p>
          </div>
        </div>
      </section>

      {/* CTA CARDS */}
      <section className="max-w-5xl mx-auto px-6 mt-16">
        <div className="grid gap-8 md:grid-cols-3">
          <a
            href="https://line.me/R/ti/p/~line88.tw"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-green-400 hover:shadow-[0_0_40px_rgba(74,222,128,0.22)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400/10 text-2xl">
              💬
            </div>

            <div className="text-2xl font-black text-green-400 mb-3">
              LINE 即時諮詢
            </div>

            <p className="text-gray-400 leading-7">
              加入 LINE 官方帳號，立即與我們對話。
            </p>
          </a>

          <a
            href="mailto:ihack168@gmail.com"
            className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(96,165,250,0.22)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/10 text-2xl">
              ✉️
            </div>

            <div className="text-2xl font-black text-blue-400 mb-3">
              Email 聯絡
            </div>

            <p className="text-gray-400 leading-7">
              將您的需求寄送至信箱，我們會盡快回覆。
            </p>
          </a>

          <a
            href="https://www.facebook.com/lockheadhex"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#ff8800] hover:shadow-[0_0_40px_rgba(255,136,0,0.25)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff8800]/10 text-2xl">
              🔥
            </div>

            <div className="text-2xl font-black text-[#ff8800] mb-3">
              Facebook 粉專
            </div>

            <p className="text-gray-400 leading-7">
              透過 Facebook Messenger 與我們聯絡。
            </p>
          </a>
        </div>
      </section>

      {/* BACK HOME */}
      <div className="text-center py-20">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-gray-300 transition hover:border-[#ff8800] hover:text-white hover:shadow-[0_0_30px_rgba(255,136,0,0.2)]"
        >
          ← 返回首頁
        </Link>
      </div>

      <style jsx global>{`
        @keyframes contactZoom {
          from {
            transform: scale(1.05);
          }
          to {
            transform: scale(1.12);
          }
        }
      `}</style>
    </div>
  );
}