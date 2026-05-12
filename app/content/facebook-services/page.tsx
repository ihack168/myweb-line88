"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  MessageSquare,
  Users,
  TrendingUp,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";

export default function FacebookMarketingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "洛克希德黑克斯 - FB 買讚、買粉絲、買留言服務",
    description:
      "提供 Facebook 買讚、買粉絲、買留言、買分享與社團人數支援服務。適合需要快速補人氣、提升貼文互動、增加粉專門面與社團人數的客戶。執行前可先提供連結評估價格、時間與可能風險。",
    provider: {
      "@type": "Organization",
      name: "洛克希德黑克斯 (Lockhead Hex)",
    },
    serviceType: [
      "FB買讚",
      "FB買粉絲",
      "FB買留言",
      "FB買分享",
      "FB社團人數",
    ],
    areaServed: "TW",
    offers: {
      "@type": "Offer",
      description: "FB 買讚、買粉絲、買留言客製化報價，請加 LINE 私訊",
      url: "https://www.line88.tw/facebook-services",
    },
  };

  const services = [
    {
      title: "FB 買讚",
      icon: <ThumbsUp className="w-6 h-6 text-[#00ff00]" />,
      text:
        "貼文沒人按讚、活動看起來太冷，可以直接補讚數。適合貼文暖場、活動曝光、品牌頁面撐人氣。",
    },
    {
      title: "FB 買粉絲",
      icon: <Users className="w-6 h-6 text-[#00ff00]" />,
      text:
        "粉專粉絲太少，看起來沒信任感，可以補粉絲數。適合新粉專、品牌頁、活動頁、個人 IP 起步使用。",
    },
    {
      title: "FB 買留言、買分享",
      icon: <MessageSquare className="w-6 h-6 text-[#00ff00]" />,
      text:
        "貼文只有讚不夠，可以加留言跟分享，讓貼文看起來比較有人討論。留言內容可以先討論。",
    },
    {
      title: "FB 社團補人數",
      icon: <TrendingUp className="w-6 h-6 text-[#00ff00]" />,
      text:
        "社團剛開沒人，看起來很空，可以協助補社團人數。適合活動社團、品牌社團、短期專案社團。",
    },
  ];

  const faqs = [
    {
      q: "我就是想買 FB 讚，可以嗎？",
      a:
        "可以。把貼文連結丟給我們，說你要多少讚、希望多久完成，我們會直接評估價格、時間跟可不可以做。",
    },
    {
      q: "可以買 FB 粉絲嗎？",
      a:
        "可以。粉專粉絲太少、看起來沒人氣，可以補粉絲數。適合新粉專、品牌頁、活動頁或需要先把門面撐起來的帳號。",
    },
    {
      q: "FB 留言可以指定內容嗎？",
      a:
        "可以先討論。你可以提供想要的留言方向，例如支持、詢問、稱讚、活動互動等。建議不要全部一模一樣，會比較自然。",
    },
    {
      q: "可以買 FB 分享嗎？",
      a:
        "可以。貼文如果需要看起來有擴散，可以安排分享數。適合活動貼文、產品貼文、抽獎貼文或需要提高社群互動感的內容。",
    },
    {
      q: "FB 社團可以補人數嗎？",
      a:
        "可以評估。你提供社團連結，我們看社團狀態、審核方式與目標人數，再回覆能不能做、要多久、怎麼安排。",
    },
    {
      q: "會不會掉讚、掉粉？",
      a:
        "有可能。Facebook 本來就會清帳號、清異常互動，所以數字型服務都可能掉。下單前會先跟你說明風險。",
    },
    {
      q: "多久可以完成？",
      a:
        "看數量跟項目。少量通常比較快，大量會建議分批做，不要一次衝太誇張，避免數字變化太硬。",
    },
  ];

  const process = [
    "丟 FB 貼文、粉專或社團連結",
    "說你要買讚、買粉絲、買留言、買分享還是補社團人數",
    "告訴我們你要多少數量",
    "我們評估價格、時間與可不可以做",
    "確認後開始安排",
    "完成後回報數量狀況",
  ];

  const useCases = [
    "FB 買讚",
    "FB 買粉絲",
    "FB 買留言",
    "FB 買分享",
    "FB 社團人數",
    "貼文補人氣",
    "粉專撐門面",
    "活動貼文暖場",
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
            FB 買讚・買粉絲・買留言・買分享・社團人數
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Facebook <span className="text-[#00ff00]">買讚買粉絲</span>
            <br />
            要數字好看，我們直接幫你補
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            不用講太複雜。你有 FB 貼文、粉專或社團需要人氣，
            我們可以協助增加按讚、粉絲、留言、分享與社團人數。
            先給連結，我們評估能不能做、多久完成、可能會不會掉數。
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
            怎麼買？流程很簡單
          </h2>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            不用寫企劃，不用開會。你只要把連結跟需求丟過來，
            我們直接幫你看能不能做、多少錢、多久完成。
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
            FB 買讚、買粉絲常見問題
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
            可以處理哪些 FB 需求？
          </h2>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            你不用知道專業術語，直接說你要什麼數字變好看就行。
            常見需求如下：
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
                  先講清楚：數字型服務都有風險
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  FB 買讚、買粉絲、買留言、買分享這類服務，本質上就是數字型互動支援。
                  Facebook 可能會清理異常帳號、低品質帳號或部分互動，所以有掉數可能。
                </p>
                <p className="text-gray-300 leading-relaxed">
                  如果你要的是長期品牌經營，建議同時做內容、廣告跟真實社群互動。
                  如果你現在只是需要貼文不要太冷、粉專不要太空、社團不要太沒人，
                  那這類服務就比較適合。
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
            要買 FB 讚、粉絲、留言？直接丟連結
          </h2>

          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            把粉專、貼文或社團連結傳來，告訴我們你要買讚、買粉絲、
            買留言、買分享還是補社團人數。我們直接幫你估價格跟時間。
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://line.me/R/ti/p/~line88.tw"
              className="px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform"
            >
              點我加 LINE 直接詢價
            </a>

            <p className="text-sm text-gray-500">
              ※ 請先準備 FB 連結、需求項目、數量與希望完成時間。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}