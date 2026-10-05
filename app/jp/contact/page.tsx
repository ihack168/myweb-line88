import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const SITE_URL = "https://www.line88.tw";

const PAGE_TITLE = "お問い合わせ｜洛克希德黑克斯";

const PAGE_DESCRIPTION =
  "洛克希德黑克斯へのお問い合わせ。オンライン投票支援、AEO、GEO、SEO、LINE公式アカウントのAI連携、SNSマーケティングなど、お気軽にご相談ください。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: "/jp/contact",
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/jp/contact`,
    siteName: "洛克希德黑克斯",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/contact.png",
        alt: "お問い合わせ",
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
              alt="お問い合わせ"
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
                お問い合わせ
              </h1>
            </div>
          </div>
        </section>

        {/* CTA CARDS */}
        <section className="mt-4 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-8">
          {/* LINE */}
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
                LINEでお問い合わせ
              </div>
              <p className="mt-0.5 text-xs text-gray-400 md:mt-1 md:text-base">
                LINEからお気軽にご相談ください
              </p>
            </div>
          </a>

          {/* EMAIL */}
          <a
            href="mailto:ihack168@gmail.com"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(96,165,250,0.22)] md:rounded-3xl md:p-8"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-400/10 text-xl md:h-12 md:w-12 md:text-2xl">
              ✉️
            </div>

            <div>
              <div className="text-base font-black text-blue-400 md:text-2xl">
                メールでお問い合わせ
              </div>
              <p className="mt-0.5 text-xs text-gray-400 md:mt-1 md:text-base">
                メールでご相談・お問い合わせ
              </p>
            </div>
          </a>

          {/* FACEBOOK */}
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
                Facebook
              </div>
              <p className="mt-0.5 text-xs text-gray-400 md:mt-1 md:text-base">
                Facebookのメッセージからお問い合わせ
              </p>
            </div>
          </a>
        </section>

        {/* PAYMENT */}
        <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:mt-8 md:rounded-3xl md:p-8">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-center md:gap-6">
            <div className="flex h-14 w-24 items-center justify-center rounded-xl bg-white px-3">
              <Image
                src="/images/paypal.png"
                alt="PayPal"
                width={90}
                height={35}
                className="h-auto w-[90px] object-contain"
              />
            </div>

            <div className="text-left">
              <h2 className="text-lg font-black text-white md:text-2xl">
                お支払い方法
              </h2>
              <p className="mt-1 text-sm text-gray-400 md:text-base">
                お支払いは PayPal に対応しております。
              </p>
            </div>
          </div>
        </section>

        {/* LANGUAGE NOTICE */}
        <section className="mt-4 rounded-2xl border border-[#ff8800]/20 bg-[#ff8800]/5 p-5 backdrop-blur-xl md:mt-6 md:rounded-3xl md:p-8">
          <h2 className="text-base font-black text-[#ff8800] md:text-xl">
            日本語でのお問い合わせについて
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-300 md:text-base md:leading-8">
            当社は台湾を拠点とする現地の技術チームです。
            日本語を話すスタッフがいないため、お問い合わせからサービスのご利用まで、
            翻訳ソフトを使用して対応しております。
            <br />
            日本語の表現や文章に不自然な点がございましたら、何卒ご容赦ください。
          </p>
        </section>

        {/* BACK HOME */}
        <div className="mt-4 text-center md:mt-8">
          <Link
            href="/jp"
            className="inline-flex items-center rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:border-[#ff8800] hover:text-white hover:shadow-[0_0_30px_rgba(255,136,0,0.2)] md:text-base"
          >
            ← ホームに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}