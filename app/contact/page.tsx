"use client";

import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <main className="min-h-screen max-w-6xl mx-auto px-5 py-6 md:px-6 md:py-12 flex flex-col justify-center">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
          <div className="relative h-[34vh] min-h-[230px] max-h-[420px] md:h-[520px]">
            <Image
              src="/images/contact.png"
              alt="聯絡我們"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-contain object-center scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/45 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
              <div className="mb-3 rounded-full border border-[#ff8800]/40 bg-black/40 px-4 py-1.5 text-xs md:text-sm text-[#ffb35c] backdrop-blur-md">
                LINE・Email・Facebook
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-[#ff8800] drop-shadow-xl">
                聯絡我們
              </h1>

              <p className="mt-3 md:mt-5 max-w-2xl text-sm md:text-xl text-gray-200 leading-relaxed drop-shadow-lg">
                有合作需求、技術問題或專案諮詢，
                歡迎透過下方方式聯繫我們。
              </p>
            </div>
          </div>
        </section>

        {/* CTA CARDS */}
        <section className="mt-5 md:mt-10 grid gap-3 md:gap-8 md:grid-cols-3">
          <a
            href="https://line.me/R/ti/p/~line88.tw"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-[0_0_40px_rgba(74,222,128,0.22)]"
          >
            <div className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-green-400/10 text-xl md:text-2xl">
              💬
            </div>

            <div>
              <div className="text-lg md:text-2xl font-black text-green-400">
                LINE 即時諮詢
              </div>
              <p className="text-xs md:text-base text-gray-400 mt-1">
                加入 LINE 立即對話
              </p>
            </div>
          </a>

          <a
            href="mailto:ihack168@gmail.com"
            className="group flex items-center gap-4 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(96,165,250,0.22)]"
          >
            <div className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-400/10 text-xl md:text-2xl">
              ✉️
            </div>

            <div>
              <div className="text-lg md:text-2xl font-black text-blue-400">
                Email 聯絡
              </div>
              <p className="text-xs md:text-base text-gray-400 mt-1">
                發送需求到信箱
              </p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/lockheadhex"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ff8800] hover:shadow-[0_0_40px_rgba(255,136,0,0.25)]"
          >
            <div className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff8800]/10 text-xl md:text-2xl">
              🔥
            </div>

            <div>
              <div className="text-lg md:text-2xl font-black text-[#ff8800]">
                Facebook 粉專
              </div>
              <p className="text-xs md:text-base text-gray-400 mt-1">
                透過 FB 私訊我們
              </p>
            </div>
          </a>
        </section>

        {/* BACK HOME */}
        <div className="text-center mt-5 md:mt-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/10 px-5 py-2.5 text-sm md:text-base text-gray-300 transition hover:border-[#ff8800] hover:text-white hover:shadow-[0_0_30px_rgba(255,136,0,0.2)]"
          >
            ← 返回首頁
          </Link>
        </div>
      </main>
    </div>
  );
}