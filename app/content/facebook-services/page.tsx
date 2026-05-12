"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  CheckCircle2,
  MessageSquare,
  Users,
  TrendingUp,
  ShieldAlert,
  Search,
} from "lucide-react";

export default function FacebookMarketingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "洛克希德黑克斯 - Facebook 社群互動與聲量支援服務",
    description:
      "提供 Facebook 粉絲、貼文互動、留言、分享、社團人數與社群聲量相關支援服務。服務內容包含需求評估、互動配置、執行節奏安排與風險說明，適合需要提升社群曝光與討論度的品牌、活動與粉專。",
    provider: {
      "@type": "Organization",
      name: "洛克希德黑克斯 (Lockhead Hex)",
    },
    serviceType: [
      "Facebook 買讚服務",
      "Facebook 粉絲增長",
      "Facebook 留言與分享支援",
      "Facebook 社團人數支援",
      "社群聲量操作評估",
    ],
    areaServed: "TW",
    offers: {
      "@type": "Offer",
      description: "客製化 Facebook 社群互動方案，請加 LINE 私訊諮詢",
      url: "https://www.line88.tw/facebook-services",
    },
  };

  const services = [
    {
      title: "FB 粉絲與貼文互動",
      icon: <TrendingUp className="w-6 h-6 text-[#00ff00]" />,
      text:
        "提供 Facebook 粉絲、貼文按讚、追蹤者與基本互動支援，適合新粉專、活動頁、品牌貼文與需要提升初始人氣的內容。",
    },
    {
      title: "FB 留言與分享支援",
      icon: <MessageSquare className="w-6 h-6 text-[#00ff00]" />,
      text:
        "可依需求安排留言、分享與貼文互動配置，適合活動推廣、產品曝光、貼文討論度提升與社群內容測試。",
    },
    {
      title: "FB 社團人數與活躍度",
      icon: <Users className="w-6 h-6 text-[#00ff00]" />,
      text:
        "協助評估 Facebook 社團人數增長、成員數據與互動需求，適合社團初期冷啟動、活動社團與品牌社群經營。",
    },
    {
      title: "社群聲量支援評估",
      icon: <ShieldAlert className="w-6 h-6 text-[#00ff00]" />,
      text:
        "針對品牌討論度、貼文曝光、正向留言比例與社群互動需求進行評估，並說明不同操作方式可能產生的限制與風險。",
    },
  ];

  const faqs = [
    {
      q: "FB 買讚、買粉絲是什麼服務？",
      a:
        "FB 買讚與買粉絲是針對 Facebook 粉專、貼文或活動內容提供互動數據支援，常見需求包含貼文按讚、粉絲數、追蹤者、分享數與留言數。實際可執行項目會依照粉專狀態、貼文類型與需求數量評估。",
    },
    {
      q: "你們提供的互動是真人自然流量嗎？",
      a:
        "不是所有互動都能視為自然流量。本服務主要是社群數據與互動支援，不會把操作包裝成完全自然觸及。若品牌需要長期自然流量，仍建議搭配內容經營、廣告投放與社群活動。",
    },
    {
      q: "FB 買留言可以指定內容嗎？",
      a:
        "可以依照需求評估客製化留言，例如活動留言、產品回饋、貼文互動、問題式留言或簡短正向回應。留言內容建議自然、多樣化，避免大量重複文字影響貼文品質。",
    },
    {
      q: "FB 社團人數可以增加嗎？",
      a:
        "可以評估 Facebook 社團人數支援，適合新社團冷啟動、活動社團、品牌社群與短期專案社團。實際安排會依照社團公開狀態、審核方式與目標人數判斷。",
    },
    {
      q: "FB 買讚或買粉絲會不會掉數？",
      a:
        "Facebook 可能會定期清理異常帳號、低品質帳號或不符合平台規則的互動，因此任何數據型服務都可能出現掉數。執行前會先說明可能風險與適合的數量配置。",
    },
    {
      q: "社群聲量支援適合哪些情境？",
      a:
        "常見情境包含新品上市、活動宣傳、粉專冷啟動、貼文互動不足、社團人數不足、品牌討論度不足與短期曝光需求。若涉及爭議議題、惡意攻擊或不實內容，建議先評估法律與平台風險。",
    },
  ];

  const process = [
    "提供粉專、貼文或社團連結",
    "確認需要的互動類型與數量",
    "評估帳號狀態、貼文內容與平台限制",
    "規劃執行節奏與互動配置",
    "開始執行並觀察數據變化",
    "依成效與掉數情況調整後續安排",
  ];

  const useCases = [
    "FB 買讚",
    "FB 買粉絲",
    "FB 買留言",
    "FB 買分享",
    "FB 社團人數",
    "粉專冷啟動",
    "活動貼文曝光",
    "品牌聲量支援",
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
            Facebook 粉絲・按讚・留言・分享・社團人數
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Facebook <span className="text-[#00ff00]">社群互動支援</span>
            <br />
            粉絲增長・貼文互動・聲量配置
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            針對 Facebook 粉專、貼文、活動與社團，提供按讚、粉絲、
            留言、分享與社群聲量相關支援。服務執行前會先評估連結狀態、
            需求數量、執行節奏與可能風險。
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
            Facebook 社群互動服務流程
          </h2>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            為了讓 FB 買讚、買粉絲、買留言或社團人數支援更清楚，
            建議先提供目標連結、需求數量、希望完成時間與目前帳號狀態。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {process.map((step, index) => (
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
            常見問題：FB 買讚、買粉絲與社群聲量服務
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
            適合評估的 Facebook 需求
          </h2>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            以下是常見的 Facebook 社群互動需求。不同粉專、貼文與社團狀態，
            可執行的方式與效果會有所不同。
          </p>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {useCases.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 border-t border-white/10 pt-16">
          <div className="max-w-4xl mx-auto rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-8">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-7 h-7 text-yellow-400 shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  執行前需要了解的限制
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Facebook 可能會清理異常互動、低品質帳號或不符合平台規則的數據，
                  因此粉絲、讚數、留言、分享與社團人數都有可能出現波動。
                </p>
                <p className="text-gray-300 leading-relaxed">
                  若你的需求涉及不實資訊、惡意攻擊、冒充他人、騷擾或違法內容，
                  不建議執行。品牌若需要長期經營，建議同時搭配內容策略、
                  廣告投放與真實社群互動。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#00ff00]/20 to-transparent border border-[#00ff00]/30"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            需要評估 Facebook 社群互動方案嗎？
          </h2>

          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            請提供粉專、貼文或社團連結，並說明需要的服務項目，
            例如 FB 買讚、買粉絲、買留言、買分享或社團人數支援。
            我們會先評估可行方式、執行節奏與可能風險。
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://line.me/R/ti/p/~line88.tw"
              className="px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform"
            >
              點我加 LINE 私訊諮詢
            </a>

            <p className="text-sm text-gray-500">
              ※ 執行前請先確認平台規範與內容風險；不同項目可能有不同限制。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}