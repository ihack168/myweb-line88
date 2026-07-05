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
    icon: <span className="text-3xl">🗳️</span>,
  },
  {
    title: "Facebook 帳號投票服務",
    description: "FB 帳號大量投票、買票、灌票",
    icon: <span className="text-3xl">👍</span>,
  },
  {
    title: "Google 帳號投票服務",
    description: "Google 帳號大量投票、買票、灌票",
    icon: <span className="text-3xl">✅</span>,
  },
  {
    title: "Facebook 臉書灌水服務",
    description: "FB 大量按讚、粉專追蹤、社團人數、留言推文",
    link: "/content/facebook-services",
    icon: <span className="text-3xl">📈</span>,
  },
  {
    title: "Instagram IG 灌水服務",
    description: "IG 大量按愛心、追蹤、留言推文",
    link: "/content/instagram-services",
    icon: <span className="text-3xl">📸</span>,
  },
  {
    title: "Line@ 官方帳號灌水服務",
    description: "Line@ 官方帳號追蹤人數灌水",
    icon: <span className="text-3xl">💬</span>,
  },
  {
    title: "Threads@ 灌水服務",
    description: "Threads 大量按愛心、追蹤、留言推文",
    link: "/content/threads-services",
    icon: <span className="text-3xl">🧵</span>,
  },
  {
    title: "AI網路行銷優化",
    description: "AEO、GEO、SEO AI優化",
    icon: <span className="text-3xl">🤖</span>,
  },
  {
    title: "Line@官方帳號AI客服串接建置",
    description: "Line@官方帳號串接 AI（Gemini、ChatGPT）",
    link: "/content/line-ai-services",
    icon: <span className="text-3xl">✨</span>,
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#0a0a0a] px-5 py-16 md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,136,0,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.65))]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#ff8800] md:text-base">
            SERVICES
          </p>

          <h2 className="text-3xl font-black italic text-white md:text-5xl">
            <span className="text-[#ff8800]">|</span> 服務項目
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const CardContent = (
              <div
                className={`group relative flex h-full min-h-[170px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 ${
                  service.link
                    ? "cursor-pointer hover:-translate-y-1 hover:border-[#ff8800]/70 hover:shadow-[0_0_40px_rgba(255,136,0,0.22)]"
                    : "opacity-90"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/35 shadow-inner transition duration-300 group-hover:scale-110 group-hover:border-[#ff8800]/50 group-hover:bg-[#ff8800]/10">
                  {service.icon}
                </div>

                <div className="relative flex flex-1 flex-col">
                  <h3 className="text-lg font-black leading-snug text-white">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-400 transition group-hover:text-gray-200">
                    {service.description}
                  </p>

                  {service.link && (
                    <div className="mt-auto pt-5 text-sm font-bold text-[#ff8800] opacity-80 transition group-hover:translate-x-1 group-hover:opacity-100">
                      了解更多 →
                    </div>
                  )}
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