import React from 'react';

const services = [
  {
    title: "Line 帳號投票服務",
    description: "Line 帳號大量投票、買票、灌票",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
    ),
  },
  {
    title: "Facebook 帳號投票服務",
    description: "FB 帳號大量投票、買票、灌票",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
    ),
  },
  {
    title: "Google 帳號投票服務",
    description: "Google 帳號大量投票、買票、灌票",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    ),
  },
  {
    title: "Facebook 臉書灌水服務",
    description: "FB 大量按讚、粉專追蹤、社團人數、留言推文",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    ),
  },
  {
    title: "Instagram IG 灌水服務",
    description: "IG 大量按愛心、追蹤、留言推文",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
  },
  {
    title: "Line@ 官方帳號灌水服務",
    description: "Line@ 官方帳號追蹤人數灌水",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/><path d="M12 12v.01"/><path d="M12 16v.01"/><path d="M12 8v.01"/></svg>
    ),
  },
  {
    title: "Threads 灌水服務",
    description: "Threads 大量按愛心、追蹤、留言推文",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.25 17C18.84 18.61 17.33 19.5 15.5 19.5C12.5 19.5 10 17.5 10 14.5C10 11.5 12.5 9.5 15.5 9.5C17.33 9.5 18.84 10.39 19.25 12"/><path d="M15.5 13.5C14.5 13.5 13.5 14 13.5 15C13.5 16 14.5 16.5 15.5 16.5C16.5 16.5 17.5 16 17.5 15C17.5 14 16.5 13.5 15.5 13.5Z"/><path d="M7 10C7 6.5 10 3.5 14.5 3.5C19 3.5 22 6.5 22 10V14C22 18.5 18.5 22 14 22C10.5 22 7.5 19.5 7.5 15.5"/></svg>
    ),
  },
  {
    title: "網路行銷、網站建置",
    description: "AEO、SEO AI 關鍵字優化",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    ),
  },
  {
    title: "AI 客服系統串接建置",
    description: "品牌官網、Line 客服串接 AI (Gemini、ChatGPT)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
    ),
  },
  {
    title: "社群口碑五星評論",
    description: "Facebook 店家五星評論灌水",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="px-6 py-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-foreground mb-10">
          <span className="text-primary">|</span> 服務項目
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                {service.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-base font-bold text-card-foreground leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}