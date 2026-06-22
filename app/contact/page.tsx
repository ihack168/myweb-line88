"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        {/* HERO */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#ff8800] mb-6">
            聯絡我們
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            提供 LINE / Facebook / Email 多種聯絡方式。
            <br />
            如果你有網路行銷、投票系統或 AI 客服相關需求，可以直接聯絡我們。
          </p>
        </section>

        {/* CONTACT CARDS */}
        <section className="mb-20">
          <ContactSection />
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">
            常見問題
          </h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-[#ff8800] mb-2">
                回覆時間多久？
              </h3>
              <p className="text-gray-300 text-sm">
                通常 LINE 與 Email 會在 24 小時內回覆。
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-[#ff8800] mb-2">
                可以做哪些服務？
              </h3>
              <p className="text-gray-300 text-sm">
                網路投票系統、社群流量優化、SEO / AEO 優化、AI 客服串接等。
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-[#ff8800] mb-2">
                是否提供客製化？
              </h3>
              <p className="text-gray-300 text-sm">
                可以，會依照需求提供技術方案與報價。
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            現在就開始聯絡
          </h2>

          <p className="text-gray-400 mb-8">
            選擇你最方便的方式，我們會盡快回覆你
          </p>

          <a
            href="https://line.me/R/ti/p/~line88.tw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#ff8800] text-black font-black px-8 py-4 rounded-full hover:scale-105 transition"
          >
            立即加入 LINE
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}