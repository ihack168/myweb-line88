import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  // JSON-LD 結構化資料：專門給 Google 爬蟲看的技術清單
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
    <div className="min-h-screen bg-background text-foreground">
      {/* 注入 JSON-LD 腳本 (這不會顯示在網頁畫面上，但 SEO 極強) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <main>
        {/* 1. 英雄區塊：主打「速度」與「隱蔽性」 */}
        <HeroSection />
        
        {/* 2. 服務區塊：針對投票業務調整關鍵字 */}
        <ServicesSection />
        
        {/* 3. SEO 強化區塊：隱藏或半隱藏的文字區塊，專門捕捉關鍵字 */}
        <section className="sr-only">
          <h2>全台最穩定的網路投票買票與灌票服務</h2>
          <p>
            我們提供專業的 LINE 投票買票、FB 臉書投票灌票、Google 表單數據優化、
            各式網站投票破解與數據提升服務。針對 Threads、IG、Facebook 提供大量按讚與追蹤數，
            確保您的社群數據領先競爭對手。
          </p>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}