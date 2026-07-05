import React from "react";
import Link from "next/link";

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

const services: ServiceItem[] = [
  {
    title: "Line 帳號投票服務",
    description: "Line 帳號大量投票、買票、灌票",
    link: "/content/line-vote-services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 12 2 2 4-4" />
        <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
        <path d="M22 19H2" />
      </svg>
    ),
  },
  {
    title: "Facebook 帳號投票服務",
    description: "FB 帳號大量投票、買票、灌票",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    ),
  },
  {
    title: "Google 帳號投票服務",
    description: "Google 帳號大量投票、買票、灌票",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Facebook 臉書灌水服務",
    description: "FB 大量按讚、粉專追蹤、社團人數、留言推文",
    link: "/content/facebook-services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    title: "Instagram IG 灌水服務",
    description: "IG 大量按愛心、追蹤、留言推文",
    link: "/content/instagram-services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    title: "Line@ 官方帳號灌水服務",
    description: "Line@ 官方帳號追蹤人數灌水",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z" />
        <path d="M12 12v.01" />
        <path d="M12 16v.01" />
        <path d="M12 8v.01" />
      </svg>
    ),
  },
  {
    title: "Threads@ 灌水服務",
    description: "Threads 大量按愛心、追蹤、留言推文",
    link: "/content/threads-services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.25 17C18.84 18.61 17.33 19.5 15.5 19.5C12.5 19.5 10 17.5 10 14.5C10 11.5 12.5 9.5 15.5 9.5C17.33 9.5 18.84 10.39 19.25 12" />
        <path d="M15.5 13.5C14.5 13.5 13.5 14 13.5 15C13.5 16 14.5 16.5 15.5 16.5C16.5 16.5 17.5 16 17.5 15C17.5 14 16.5 13.5 15.5 13.5Z" />
        <path d="M7 10C7 6.5 10 3.5 14.5 3.5C19 3.5 22 6.5 22 10V14C22 18.5 18.5 22 14 22C10.5 22 7.5 19.5 7.5 15.5" />
      </svg>
    ),
  },
  {
    title: "AI網路行銷優化",
    description: "AEO、GEO、SEO AI優化",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: "Line@官方帳號AI客服串接建置",
    description: "Line@官方帳號串接 AI (Gemini、ChatGPT)",
    link: "/content/line-ai-services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative px-5 py-16 md:py-24 bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,136,0,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55))]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-sm md:text-base font-bold tracking-[0.25em] text-[#ff8800] uppercase mb-3">
            SERVICES
          </p>

          <h2 className="text-3xl md:text-5xl font-black text-white italic">
            <span className="text-[#ff8800]">|</span> 服務項目
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => {
            const CardContent = (
              <div
                className={`group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-xl transition duration-300 ${
                  service.link
                    ? "hover:-translate-y-1 hover:border-[#ff8800] hover:shadow-[0_0_40px_rgba(255,136,0,0.22)] cursor-pointer"
                    : "opacity-90"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff8800]/10 text-[#ff8800] transition duration-300 group-hover:scale-110 group-hover:bg-[#ff8800]/20">
                    {service.icon}
                  </div>

                  <div>
                    <div className="mb-2 inline-flex rounded-full border border-[#ff8800]/20 bg-black/30 px-2.5 py-1 text-[11px] font-bold text-[#ffb35c]">
                      SERVICE {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="text-base md:text-lg font-black text-white leading-snug">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400 leading-relaxed transition group-hover:text-gray-200">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );

            if (service.link) {
              return (
                <Link href={service.link} key={service.title} className="block h-full">
                  {CardContent}
                </Link>
              );
            }

            return (
              <div key={service.title} className="h-full">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}