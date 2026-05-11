"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MessageSquareCode, BrainCircuit, Database, Clock, Zap, PlayCircle } from "lucide-react";

export default function LineAiAutomationPage() {

  // 🧠 AEO 強化 Schema（Service + SoftwareApplication + FAQ）
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Line AI 官方帳號客服系統",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "企業級 Line AI 客服系統，整合 ChatGPT 與 Gemini，搭配 RAG 知識庫技術，自動回覆客戶問題並降低客服成本。",
        "provider": {
          "@type": "Organization",
          "name": "洛克希德黑克斯"
        }
      },
      {
        "@type": "Service",
        "name": "Line AI 客服串接與企業自動化服務",
        "description": "協助企業將 Line 官方帳號串接 ChatGPT / Gemini AI，並建立專屬 RAG 知識庫，實現自動客服與業務流程自動化。",
        "provider": {
          "@type": "Organization",
          "name": "洛克希德黑克斯"
        },
        "areaServed": "TW"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "一般 Line 自動回覆跟 AI 客服差在哪裡？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "傳統 Line 自動回覆只能依關鍵字觸發，而 AI 客服可以理解上下文，並透過 ChatGPT 或 Gemini 提供自然語意回覆，能處理更複雜的問題。"
            }
          },
          {
            "@type": "Question",
            "name": "Line 官方帳號可以用 AI 自動回覆嗎？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "可以，透過 Webhook 串接 ChatGPT 或 Gemini，再搭配企業知識庫，就能實現全天候自動客服系統。"
            }
          },
          {
            "@type": "Question",
            "name": "RAG 知識庫是什麼？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "RAG 是讓 AI 參考企業內部資料的技術，使 Line AI 客服可以根據公司文件與產品資料回答問題，而不是隨機生成答案。"
            }
          }
        ]
      }
    ]
  };

  // 🎯 服務內容（已改成語意型，不是keyword堆疊）
  const services = [
    {
      title: "Line AI 客服串接",
      icon: <BrainCircuit className="w-6 h-6 text-[#00ff00]" />,
      desc: "將 Line 官方帳號串接 ChatGPT 或 Gemini，使 AI 能理解客戶問題並提供自然語意回覆。"
    },
    {
      title: "RAG 企業知識庫",
      icon: <Database className="w-6 h-6 text-[#00ff00]" />,
      desc: "將企業文件、產品資料與FAQ轉換為AI知識來源，確保回答正確且一致。"
    },
    {
      title: "24小時 AI 自動客服",
      icon: <Clock className="w-6 h-6 text-[#00ff00]" />,
      desc: "即使非上班時間，也能自動回覆客戶問題，減少客服人力負擔。"
    },
    {
      title: "業務流程自動化",
      icon: <Zap className="w-6 h-6 text-[#00ff00]" />,
      desc: "讓 Line 官方帳號不只是客服，而是自動處理詢問與導購的AI業務助手。"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">

        {/* 🧠 HERO + TL;DR（AEO核心） */}
        <div className="text-center mb-16">

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Line AI 官方帳號客服系統<br />
            <span className="text-[#00ff00]">
              ChatGPT / Gemini 自動回覆解決方案
            </span>
          </h1>

          {/* ✔ AEO TL;DR */}
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-6">
            TL;DR：我們協助企業將 Line 官方帳號串接 AI（ChatGPT / Gemini），並建立專屬知識庫，使客服能自動理解並回覆客戶問題，降低人力成本並提升回覆效率。
          </p>

        </div>

        {/* 🎥 影片區 */}
        <div className="text-center mb-20">
          <div className="aspect-[9/16] max-w-[320px] mx-auto bg-black rounded-2xl overflow-hidden border border-white/10">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/S_xbhS4zbHE"
              title="Line AI Demo"
              allowFullScreen
            />
          </div>

          <div className="text-[#00ff00] mt-3 flex justify-center items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            AI 客服運作示範
          </div>
        </div>

        {/* 🧱 服務區 */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((s, i) => (
            <div key={i} className="p-6 border border-white/10 rounded-xl bg-white/5">
              <div className="mb-3">{s.icon}</div>
              <h2 className="text-xl font-bold mb-2">{s.title}</h2>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 💬 FAQ（UI + schema 已強化） */}
        <div className="space-y-6 max-w-4xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-10">
            常見問題（Line AI 客服）
          </h2>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-[#00ff00] font-semibold mb-2">
              Q：一般 Line 自動回覆跟 AI 客服差在哪？
            </h3>
            <p className="text-gray-300">
              AI 客服能理解語意與上下文，不只是關鍵字觸發，因此能處理更複雜的客戶問題。
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-[#00ff00] font-semibold mb-2">
              Q：需要工程能力才能導入嗎？
            </h3>
            <p className="text-gray-300">
              不需要，系統會協助企業完成 Line Webhook 與 AI 模型串接。
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="https://line.me/R/ti/p/~line88.tw"
            className="inline-flex items-center gap-2 bg-[#00ff00] text-black px-8 py-4 rounded-full font-bold"
          >
            <MessageSquareCode />
            立即諮詢 AI 客服導入
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}