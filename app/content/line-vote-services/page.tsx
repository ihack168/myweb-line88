"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Vote, ShieldCheck, Zap, Search, AlertTriangle } from "lucide-react";

export default function LineVoteServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "洛克希德黑克斯 - LINE 投票活動 買票、灌票、支援服務",
    description:
      "提供 LINE 登入投票活動相關支援，包含投票活動評估、票數需求規劃、買票、灌票、宣傳布局。",
    provider: {
      "@type": "Organization",
      name: "洛克希德黑克斯 (Lockhead Hex)",
    },
    serviceType: [
      "LINE投票活動評估",
      "LINE投票票數規劃",
      "投票流程分析",
      "活動票數支援諮詢",
    ],
    areaServed: "TW",
    offers: {
      "@type": "Offer",
      description: "客製化投票活動評估，請加 LINE 私訊專員了解",
      url: "https://www.line88.tw/content/line-vote-services",
    },
  };

  const services = [
    {
      title: "LINE 投票活動評估",
      icon: <Vote className="w-6 h-6 text-[#00ff00]" />,
      text:
        "協助檢視活動網址、投票規則、登入方式與票數需求，判斷該活動是否適合安排投票支援。",
    },
    {
      title: "多帳號票數需求規劃",
      icon: <ShieldCheck className="w-6 h-6 text-[#00ff00]" />,
      text:
        "依照活動時間、目前票差、目標排名與投票限制，規劃所需票數、進票節奏與執行方式。",
    },
    {
      title: "活動衝票安排",
      icon: <Zap className="w-6 h-6 text-[#00ff00]" />,
      text:
        "適用於決賽、最後衝刺、人氣排行追趕等情境，可依照活動截止時間安排分段進票。",
    },
    {
      title: "投票風險與規則說明",
      icon: <AlertTriangle className="w-6 h-6 text-[#00ff00]" />,
      text:
        "不同主辦單位可能會檢查異常票數、重複帳號或短時間大量投票，執行前會先說明可能風險。",
    },
  ];

  const faqs = [
    {
      q: "LINE 投票支援是什麼服務？",
      a:
        "LINE 投票支援是針對需要 LINE 登入或 LINE 帳號參與的投票活動，提供活動評估、票數需求規劃與操作方式說明。常見應用包含人氣票選、校園競賽、品牌活動、直播主排行、模特兒票選與社群活動。",
    },
    {
      q: "這是真人自然拉票嗎？",
      a:
        "不是。本服務不會宣稱所有票數都來自自然真人拉票，也不把服務包裝成自然流量。若活動規則禁止代投、買票、多帳號投票或任何形式的票數操作，使用前需自行評估是否符合活動規範。",
    },
    {
      q: "哪些 LINE 投票活動可以評估？",
      a:
        "常見可以評估的活動包含投LINE Login 投票頁、品牌人氣票選、校園活動、社群排行與各類需要 LINE 帳號登入的投票網站。實際是否可執行，仍需看活動規則與投票限制。",
    },
    {
      q: "LINE 投票為什麼會掉票？",
      a:
        "部分活動平台會在投票後檢查異常紀錄，例如短時間大量增加、帳號狀態異常、重複裝置、登入紀錄異常或違反主辦單位規則。不同平台判定方式不同，因此無法保證所有票數都永久保留。",
    },
    {
      q: "投票活動最後一天還能衝票嗎？",
      a:
        "可以評估。許多活動會在最後一天或最後幾小時出現票數追趕需求，但時間越短，進票幅度與風險也會提高。建議提前提供活動網址、目前票數、目標票數與截止時間。",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-[#00ff00]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <section className="text-center mb-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ff00]/30 bg-[#00ff00]/10 px-4 py-2 text-sm text-[#00ff00]">
            LINE 投票活動・票數需求・活動評估
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            LINE <span className="text-[#00ff00]">投票支援服務</span>
            <br />
            票數規劃・活動衝刺・風險說明
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            針對需要 LINE 登入的投票活動，提供活動評估、票數需求規劃、
            進票節奏安排與投票規則說明。服務內容會依照活動網址、投票限制、
            目前票差與截止時間進行判斷。
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:border-[#00ff00]/50 transition-colors"
            >
              <div className="mb-4">{service.icon}</div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {service.title}
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm">
                {service.text}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-20 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            LINE 投票支援流程
          </h2>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-10">
            為了讓投票活動執行前更清楚，建議先提供活動網址、目前排名、
            目標票數與截止時間，再評估是否適合安排。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "提供活動網址與投票規則",
              "確認 LINE 登入與投票限制",
              "評估目前票差與目標票數",
              "規劃進票時段與票數節奏",
              "開始執行並觀察票數變化",
              "依活動狀況調整後續安排",
            ].map((step, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-3 text-[#00ff00] font-bold">
                  STEP {index + 1}
                </div>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">
            LINE 投票服務常見問題
          </h2>

          <div className="space-y-8 max-w-4xl mx-auto text-gray-300">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-[#00ff00] font-semibold text-xl mb-2">
                  Q: {faq.q}
                </h3>
                <p className="leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            適合評估的投票活動類型
          </h2>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              "人氣票選",
              "校園競賽",
              "品牌活動",
              "直播主排行",
              "模特兒票選",
              "寵物比賽",
              "社群投票",
              "LINE 登入投票",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          id="cta"
          className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#00ff00]/20 to-transparent border border-[#00ff00]/30"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            需要評估 LINE 投票活動嗎？
          </h2>

          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            請提供活動網址、目前票數、目標排名與截止時間。
            我們會先協助判斷活動限制、可行方式與可能風險，再提供適合的安排。
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://line.me/ti/p/您的ID"
              className="px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform"
            >
              加 LINE 評估投票活動
            </a>

            <p className="text-xs text-gray-500 italic">
              ※ 請先確認活動規則；不同平台可能有不同投票限制與票數審核機制。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}