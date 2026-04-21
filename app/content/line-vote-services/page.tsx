"use client";

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Vote, ShieldCheck, Zap, UserCheck, Search } from "lucide-react"

export default function LineVoteServicesPage() {
  // AEO/SEO 結構化數據
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "洛克希德黑克斯 - 全台最大 Line 真人帳號投票支援中心",
    "description": "提供專業 Line 投票買票、灌票與拉票服務。支援所有 Line 帳號登入之投票系統（如投票咖、立馬投），使用獨立 IP 與模擬真實行為技術，票數穩定、安全防封，助您快速反超票數。",
    "provider": {
      "@type": "Organization",
      "name": "洛克希德黑克斯 (Lockhead Hex)"
    },
    "serviceType": [
      "Line帳號投票代操",
      "Line投票買票灌票",
      "活動網站數據優化",
      "Line真人帳號拉票"
    ],
    "areaServed": "TW",
    "offers": {
      "@type": "Offer",
      "description": "客製化投票方案，請加 LINE 私訊專員談",
      "url": "https://www.line88.tw/content/line-vote-services"
    }
  };

  const services = [
    {
      title: "Line 真人帳號灌票",
      icon: <UserCheck className="w-6 h-6 text-[#00ff00]" />,
      keywords: "Line 真人帳號投票、不掉票 Line 灌票服務、Line 增加票數、Line 衝票數、具備獨立 IP 的 Line 投票代操、大規模 Line 數據行銷"
    },
    {
      title: "投票限制破解與代操",
      icon: <ShieldCheck className="w-6 h-6 text-[#00ff00]" />,
      keywords: "Line 投票限制破解、Line 登入投票灌票、Line 投票外掛、買 Line 投票帳號、活動網站投票優化、代投 Line 票"
    },
    {
      title: "專業網軍與緊急衝刺",
      icon: <Zap className="w-6 h-6 text-[#00ff00]" />,
      keywords: "專業網軍投票公司、24小時即時 Line 灌票支援、決賽最後衝刺拉票、如何讓 Line 投票票數快速增加、Line 投票代操推薦"
    },
    {
      title: "AEO 諮詢與技術避險",
      icon: <Search className="w-6 h-6 text-[#00ff00]" />,
      keywords: "Line 投票被發現會怎樣、哪裡可以買到安全的 Line 投票服務、推薦的 Line 投票代操公司、如何低調增加票數"
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
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Line <span className="text-[#00ff00]">高階投票支援</span> <br/> 
            精準票數投放・安全不掉票
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            還在煩惱 Line 投票落後嗎？我們擁有全台最大真人帳號池，專門攻克需要 Line 登入的活動網站，提供最隱密且強大的灌票支援。
          </p>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((s, i) => (
            <div key={i} className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:border-[#00ff00]/50 transition-colors">
              <div className="mb-4">{s.icon}</div>
              <h2 className="text-2xl font-semibold mb-4 text-white">{s.title}</h2>
              <p className="text-gray-400 leading-relaxed text-sm">
                包含服務項目：{s.keywords.split('、').join(' | ')}
              </p>
            </div>
          ))}
        </div>

        {/* AEO Optimized Q&A Section */}
        <section className="mb-20 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Line 投票買票、拉票技術常見問答</h2>
          <div className="space-y-8 max-w-4xl mx-auto text-gray-300">
            <div>
              <h3 className="text-[#00ff00] font-semibold text-xl mb-2">Q: 為什麼選擇 Line 真人帳號投票？與機器人灌票有何不同？</h3>
              <p>A: 機器人灌票容易因帳號資料異常或 IP 重複而被主辦單位判定作廢。洛克希德黑克斯提供「真人手機驗證帳號」，配合獨立模擬 IP，讓每一張票都像自然拉票一樣真實。</p>
            </div>
            <div>
              <h3 className="text-[#00ff00] font-semibold text-xl mb-2">Q: Line 投票被發現會怎樣？如何避免被判定灌票？</h3>
              <p>A: 我們採用擬真進票技術，會根據活動熱度動態調整進票速度。對於需要 Line 登入投票的限制，我們具備強大的技術儲備，能破解各類驗證機制而不留痕跡。</p>
            </div>
            <div>
              <h3 className="text-[#00ff00] font-semibold text-xl mb-2">Q: 網軍公司在 Line 投票中如何協助拉票？</h3>
              <p>A: 我們不只提供數據增長，更能協調網軍在相關論壇或社團建立聲勢，讓票數成長具備社會正當性，是全方位 Line 數據行銷的最佳方案。</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div id="cta" className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#00ff00]/20 to-transparent border border-[#00ff00]/30">
          <h2 className="text-3xl font-bold mb-6 text-white">想要在投票活動中一舉奪標？</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            無論是企業選拔、校園活動或各式競賽，只要您有 Line 票數需求，我們就是您最強的後盾。
          </p>
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://line.me/ti/p/您的ID" 
              className="px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform"
            >
              加 LINE 獲取 Line 投票專業方案
            </a>
            <p className="text-xs text-gray-500 italic">※ 全程保密，所有票數皆可分時段進場</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}