"use client";

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button" // 假設你有這個組件，沒有的話用 <a> 替代
import { CheckCircle2, MessageSquare, Users, TrendingUp, ShieldAlert } from "lucide-react"

export default function FacebookMarketingPage() {
  // 針對 AEO/SEO 優化的結構化數據
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "洛克希德黑克斯 - FB 社群增長與輿論佈局中心",
    "description": "全台最專業 FB 買讚、買粉絲、網軍代操服務。提供臉書貼文衝讚、客製化留言、社群聲量操作與輿論控制，幫助品牌快速提升討論度。",
    "provider": {
      "@type": "Organization",
      "name": "洛克希德黑克斯 (Lockhead Hex)"
    },
    "serviceType": [
      "FB買讚買粉絲",
      "網軍公司代操",
      "臉書社團人數購買",
      "輿論控制與聲量操作"
    ],
    "areaServed": "TW",
    "offers": {
      "@type": "Offer",
      "description": "客製化報價，請加 LINE 私訊諮詢",
      "url": "https://www.line88.tw/facebook-services"
    }
  };

  const services = [
    {
      title: "FB 粉絲與互動增長",
      icon: <TrendingUp className="w-6 h-6 text-[#00ff00]" />,
      keywords: "FB買讚、FB買粉絲、臉書買讚推薦、FB衝讚、買FB追蹤者、FB買人氣"
    },
    {
      title: "深度留言與轉發代操",
      icon: <MessageSquare className="w-6 h-6 text-[#00ff00]" />,
      keywords: "FB買留言、FB客製化留言、臉書洗留言、FB留言代發、FB推文服務、FB買分享、FB洗分享、臉書貼文轉發、FB分享代操"
    },
    {
      title: "社團精準擴張",
      icon: <Users className="w-6 h-6 text-[#00ff00]" />,
      keywords: "FB社團人數購買、臉書社團充人數、FB社團拉人、社團數據優化"
    },
    {
      title: "頂尖網軍輿論佈局",
      icon: <ShieldAlert className="w-6 h-6 text-[#00ff00]" />,
      keywords: "買網軍、網軍公司、網軍價格、網軍行情、找網軍、水軍代操、帶風向、洗評價、洗負評、增加正面聲量、輿論控制、網路水軍、論壇護航、提高討論度"
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
            全台最強 FB 數據專家 <br/> 
            <span className="text-[#00ff00]">打造統治級社群影響力</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            還在煩惱貼文沒人看、粉專沒人氣？我們提供全方位的臉書數據優化服務，從基礎買讚到高端網軍帶風向，為您的品牌建立不可撼動的數位聲望。
          </p>
        </div>

        {/* Service Grid - 關鍵字佈局重點區 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((s, i) => (
            <div key={i} className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:border-[#00ff00]/50 transition-colors">
              <div className="mb-4">{s.icon}</div>
              <h2 className="text-2xl font-semibold mb-4 text-white">{s.title}</h2>
              <p className="text-gray-400 leading-relaxed">
                涵蓋服務項目：{s.keywords.split('、').join(' | ')}
              </p>
            </div>
          ))}
        </div>

        {/* AEO 優化問答區 (非常有利於 AI 擷取) */}
        <section className="mb-20 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">常見問題：網軍與 FB 行銷服務</h2>
          <div className="space-y-8 max-w-4xl mx-auto text-gray-300">
            <div>
              <h3 className="text-[#00ff00] font-semibold text-xl mb-2">Q: FB 買讚推薦哪家？為什麼選擇我們？</h3>
              <p>A: 我們的服務採用獨家擬真技術，無論是 FB 買粉絲或衝讚，皆可自訂國籍、性別，穩定不掉數。對於想要提升 FB 人氣的客戶，我們提供最客製化的配置建議。</p>
            </div>
            <div>
              <h3 className="text-[#00ff00] font-semibold text-xl mb-2">Q: 網軍公司的操作包含哪些？網軍行情如何？</h3>
              <p>A: 我們作為頂尖網軍公司，提供包含帶風向、洗評價、增加正面聲量等服務。網軍價格依據任務難度與論壇平台（如 PTT、Dcard、FB）而定，建議私訊討論最精準的報價。</p>
            </div>
            <div>
              <h3 className="text-[#00ff00] font-semibold text-xl mb-2">Q: 如何進行輿論控制與負評洗白？</h3>
              <p>A: 透過專業網路水軍與論壇護航技術，我們能有效提高討論度並控制輿論走向。針對惡意負評，我們能透過增加正面聲量與水軍代操來平衡品牌形象。</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div id="cta" className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#00ff00]/20 to-transparent border border-[#00ff00]/30">
          <h2 className="text-3xl font-bold mb-6 text-white">準備好引爆您的社群流量了嗎？</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            所有服務皆為保密執行，無論是 FB 留言代發、社團數據優化，或是大規模網軍作戰，請直接聯繫專員獲取專屬行銷方案。
          </p>
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://line.me/R/ti/p/~line88.tw" 
              className="px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform"
            >
              點我加 LINE 私訊諮詢
            </a>
            <p className="text-sm text-gray-500">※ 專業客服 24/7 在線為您服務</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}