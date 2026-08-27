import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const SITE_URL = "https://www.line88.tw";

const PAGE_TITLE = "聯絡我們｜洛克希德黑克斯";

const PAGE_DESCRIPTION =
  "聯絡洛克希德黑克斯，諮詢網路投票協助、AEO、GEO、SEO、LINE 官方帳號 AI 串接，以及 Facebook、Instagram、Threads 社群行銷服務。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/contact`,
    siteName: "洛克希德黑克斯",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/images/contact.png",
        alt: "聯絡洛克希德黑克斯",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/images/contact.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-4 md:px-6 md:py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
          <div className="relative h-[30vh] min-h-[190px] max-h-[330px] md:h-[460px] md:max-h-[460px]">
            <Image
              src="/images/contact.png"
              alt="聯絡我們"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-[72%_center]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-black/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_45px_rgba(0,0,0,0.35)]" />

            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <h1 className="text-4xl font-black text-[#ff8800] drop-shadow-2xl md:text-6xl">
                聯絡我們
              </h1>
            </div>
          </div>
        </section>

        {/* CTA CARDS */}
        <section className="mt-4 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-8">
          <a
            href="https://line.me/R/ti/p/~line88.tw"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-[0_0_40px_rgba(74,222,128,0.22)] md:rounded-3xl md:p-8"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-400/10 text-xl md:h-12 md:w-12 md:text-2xl">
              💬
            </div>

            <div>
              <div className="text-base font-black text-green-400 md:text-2xl">
                LINE 即時諮詢
              </div>
              <p className="mt-0.5 text-xs text-gray-400 md:mt-1 md:text-base">
                加入 LINE 立即對話
              </p>
            </div>
          </a>

          <a
            href="mailto:ihack168@gmail.com"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(96,165,250,0.22)] md:rounded-3xl md:p-8"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-400/10 text-xl md:h-12 md:w-12 md:text-2xl">
              ✉️
            </div>

            <div>
              <div className="text-base font-black text-blue-400 md:text-2xl">
                Email 聯絡
              </div>
              <p className="mt-0.5 text-xs text-gray-400 md:mt-1 md:text-base">
                發送需求到信箱
              </p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/lockheadhex"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ff8800] hover:shadow-[0_0_40px_rgba(255,136,0,0.25)] md:rounded-3xl md:p-8"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ff8800]/10 text-xl md:h-12 md:w-12 md:text-2xl">
              🔥
            </div>

            <div>
              <div className="text-base font-black text-[#ff8800] md:text-2xl">
                Facebook 粉專
              </div>
              <p className="mt-0.5 text-xs text-gray-400 md:mt-1 md:text-base">
                透過 FB 私訊我們
              </p>
            </div>
          </a>
        </section>

        {/* BACK HOME */}
        <div className="mt-4 text-center md:mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:border-[#ff8800] hover:text-white hover:shadow-[0_0_30px_rgba(255,136,0,0.2)] md:text-base"
          >
            ← 返回首頁
          </Link>
        </div>
      </main>
    </div>
  );
}
