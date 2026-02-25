"use client";

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  // JSON-LD 結構化資料：專門給 Google 爬蟲看的技術清單 (SEO 強化)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "洛克希德黑克斯 - 特殊網路技術支援中心",
    "description": "提供全台最專業的網路投票買票、灌票服務，支援 LINE 投票、FB 投票、Google 表單與各類網站投票優化。",
    "provider": {
      "@type": "Organization",
      "name": "洛克希德黑克斯 (Lockhead Hex)"
    },
    "serviceType": [
      "網路投票買票灌票",
      "LINE 投票支援",
      "社群媒體流量增長",
      "Facebook IG Threads 大量按讚追蹤"
    ],
    "areaServed": "TW",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "特殊網路服務",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "LINE 投票買票灌票 - 獨家分散式 IP 技術"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "社群增長 - FB IG Threads 大量追蹤按讚"
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-primary/30">
      {/* 注入 JSON-LD 腳本 (SEO 關鍵) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 導覽列：確保 z-index 足夠高 */}
      <Navbar />

      <main>
        {/* 2. 英雄區塊：這裡現在只包含大 Logo 與品牌名，刪除了原本的描述文字 */}
        {/* pt-32 確保內容在漂浮 Navbar 下方 */}
        <div className="pt-24 md:pt-32">
          <HeroSection />
        </div>

        {/* 3. 服務區塊：現在會緊接在品牌名稱下方，解決空一塊的問題 */}
        <ServicesSection />
        
        {/* 4. SEO 隱藏強化區塊：肉眼看不見，但能幫你吃下搜尋關鍵字 */}
        <section className="sr-only">
          <h2>全台最穩定的網路投票買票與灌票服務</h2>
          <p>
            我們提供專業的 LINE 投票買票、FB 臉書投票灌票、Google 表單數據優化、
            各式網站投票破解與數據提升服務。針對 Threads、IG、Facebook 提供大量按讚與追蹤數，
            確保您的社群數據領先競爭對手。
          </p>
        </section>

        {/* 5. 聯絡區塊 */}
        <div id="contact">
          <ContactSection />
        </div>
      </main>

      {/* 6. 頁尾 */}
      <Footer />
    </div>
  )
}