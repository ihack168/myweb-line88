"use client";

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { BrainCircuit, MessageSquareCode, Zap, Database, Clock, Users, PlayCircle } from "lucide-react"

export default function LineAiAutomationPage() {
  // AEO/SEO 結構化數據：針對「AI 服務」進行優化
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "洛克希德黑克斯 - Line AI 串接與企業級智能客服開發",
    "description": "提供專業 Line Bot AI 串接服務，包含 ChatGPT/Gemini 整合、RAG 企業專屬知識庫建置。解決 Line 官方帳號訊息過多、客服人力成本高昂問題。",
    "provider": {
      "@type": "Organization",
      "name": "洛克希德黑克斯 (Lockhead Hex)"
    },
    "serviceType": [
      "Line AI 串接",
      "Line Bot ChatGPT 整合",
      "企業專屬 AI 客服建置",
      "RAG 知識庫機器人",
      "Line 業務自動化工具"
    ],
    "areaServed": "TW",
    "offers": {
      "@type": "Offer",
      "description": "企業 AI 落地解決方案諮詢，請加 LINE 私訊",
      "url": "https://www.line88.tw/line-ai-service"
    }
  };

  const services = [
    {
      title: "Line Bot AI 深度串接",
      icon: <BrainCircuit className="w-6 h-6 text-[#00ff00]" />,
      keywords: "Line AI 串接、Line ChatGPT 串接、Line Gemini 整合、Webhook Line Bot 串接、LLM 企業應用落地"
    },
    {
      title: "RAG 企業專屬知識庫",
      icon: <Database className="w-6 h-6 text-[#00ff00]" />,
      keywords: "企業內部知識庫建立、RAG 知識庫 Line 機器人、精準回答產品資訊、企業專屬 AI 客服建置"
    },
    {
      title: "全天候智能自動回覆",
      icon: <Clock className="w-6 h-6 text-[#00ff00]" />,
      keywords: "Line 官方帳號 AI 客服、Line 智能客服、非營業時間客服自動回覆、如何用 AI 自動回覆 Line 訊息"
    },
    {
      title: "業務流程自動化",
      icon: <Zap className="w-6 h-6 text-[#00ff00]" />,
      keywords: "降低客服人力成本、提高客服回覆效率、業務自動化工具推薦、Line 官方帳號經營工具推薦"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-[#00ff00]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            企業級 Line AI 串接自動化 <br/> 
            <span className="text-[#00ff00]">打造24小時全天候不間斷的AI商機</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
            還在擔心 Line 官方帳號訊息太多回不完？我們協助企業串接 ChatGPT 與 Gemini，結合 RAG 技術建立私有知識庫，讓 AI 成為最懂你產品的「超級客服」。
          </p>

          {/* 漂亮的直式影片嵌入區塊 */}
          <div className="relative max-w-[320px] mx-auto group">
            {/* 影片背後的螢光裝飾 */}
            <div className="absolute -inset-1 bg-gradient-to-b from-[#00ff00]/50 to-transparent rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-[#0a0a0a] rounded-[2.2rem] border-4 border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-center bg-white/5 py-3 border-b border-white/10">
                <div className="w-12 h-1 bg-white/20 rounded-full"></div>
              </div>
              
              {/* YouTube Shorts Iframe */}
              <div className="aspect-[9/16] w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/S_xbhS4zbHE"
                  title="Line AI Bot 展示影片"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            {/* 影片下方文字提示 */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[#00ff00] text-sm font-medium">
              <PlayCircle className="w-4 h-4" />
              <span>點擊查看 AI 自動化示範影片</span>
            </div>
          </div>
        </div>

        {/* 優勢區塊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((s, i) => (
            <div key={i} className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:border-[#00ff00]/50 transition-colors">
              <div className="mb-4">{s.icon}</div>
              <h2 className="text-2xl font-semibold mb-4 text-white">{s.title}</h2>
              <p className="text-gray-400 leading-relaxed text-sm">
                【核心技術】：{s.keywords.split('、').join(' | ')}
              </p>
            </div>
          ))}
        </div>

        {/* AEO 問答區 */}
        <section className="mb-20 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Line AI 客服常見問題</h2>
          <div className="space-y-8 max-w-4xl mx-auto text-gray-300">
            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-[#00ff00] font-semibold text-xl mb-3">Q: 一般 Line 自動回覆跟 AI 客服差在哪裡？</h3>
              <p className="leading-relaxed">A: 一般自動回覆僅能根據「關鍵字」精確匹配，回答死板。我們的 AI 客服採用 <b>LLM (大語言模型) 串接</b>，能理解上下文、語氣自然，甚至能處理複雜的產品詢問，大幅提升客戶滿意度。</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-[#00ff00] font-semibold text-xl mb-3">Q: Line 官方帳號訊息太多怎麼辦？AI 如何協助？</h3>
              <p className="leading-relaxed">A: 透過 <b>AI 客服機器人開發</b>，我們可以為您分流 80% 的重複性問題。AI 能針對您的企業內部文件進行訓練（RAG 技術），確保回答精確且即時，讓您告別客服人力短缺的困擾。</p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-[#00ff00] font-semibold text-xl mb-3">Q: 如何用 AI 自動回覆 Line 訊息？串接 ChatGPT 貴嗎？</h3>
              <p className="leading-relaxed">A: 串接流程包含 Webhook 設定與模型 API 介接。<b>Line AI 客服收費標準</b>通常根據訊息量與知識庫複雜度調整。對於企業來說，這能節省至少一名全職客服的成本，是投資報酬率極高的自動化工具。</p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-[#00ff00] font-semibold text-xl mb-3">Q: 企業如何打造專屬 AI 知識庫？</h3>
              <p className="leading-relaxed">A: 我們會協助您整理官網、產品手冊、常見問題集。透過 RAG 技術將這些資料轉化為 AI 的「大腦」，讓 Line 機器人在回答時，能完全符合您的公司方針，不會發生 AI 亂說話的情況。</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div id="cta" className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#00ff00]/20 to-transparent border border-[#00ff00]/30">
          <h2 className="text-3xl font-bold mb-6 text-white">立即導入 Line AI 客服系統</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            不論是中小企業或是大型品牌，AI 落地已是趨勢。立即諮詢專屬您的 <b>Line Bot ChatGPT / Gemini 整合方案</b>，讓您的 Line 官方帳號轉型為自動成交工具。
          </p>
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://line.me/R/ti/p/~line88.tw" 
              className="px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <MessageSquareCode className="w-6 h-6" />
              點我加 LINE 諮詢 AI 方案
            </a>
            <p className="text-sm text-gray-500">※ 免費提供初步 AI 落地可行性分析</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}