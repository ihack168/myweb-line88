import React from "react";
import Link from "next/link";
import {
  Vote,
  ThumbsUp,
  BadgeCheck,
  TrendingUp,
  Instagram,
  MessageCircleMore,
  AtSign,
  Bot,
  Sparkles,
} from "lucide-react";

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
    icon: <Vote size={26} />,
  },
  {
    title: "Facebook 帳號投票服務",
    description: "FB 帳號大量投票、買票、灌票",
    icon: <ThumbsUp size={26} />,
  },
  {
    title: "Google 帳號投票服務",
    description: "Google 帳號大量投票、買票、灌票",
    icon: <BadgeCheck size={26} />,
  },
  {
    title: "Facebook 臉書灌水服務",
    description: "FB 大量按讚、粉專追蹤、社團人數、留言推文",
    link: "/content/facebook-services",
    icon: <TrendingUp size={26} />,
  },
  {
    title: "Instagram IG 灌水服務",
    description: "IG 大量按愛心、追蹤、留言推文",
    link: "/content/instagram-services",
    icon: <Instagram size={26} />,
  },
  {
    title: "Line@ 官方帳號灌水服務",
    description: "Line@ 官方帳號追蹤人數灌水",
    icon: <MessageCircleMore size={26} />,
  },
  {
    title: "Threads@ 灌水服務",
    description: "Threads 大量按愛心、追蹤、留言推文",
    link: "/content/threads-services",
    icon: <AtSign size={26} />,
  },
  {
    title: "AI網路行銷優化",
    description: "AEO、GEO、SEO AI優化",
    icon: <Bot size={26} />,
  },
  {
    title: "Line@官方帳號AI客服串接建置",
    description: "Line@官方帳號串接 AI（Gemini、ChatGPT）",
    link: "/content/line-ai-services",
    icon: <Sparkles size={26} />,
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative px-5 py-8 md:py-12 scroll-mt-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center md:mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800] md:text-sm">
            SERVICES
          </p>

          <h2 className="text-3xl font-black italic text-white md:text-4xl">
            <span className="text-[#ff8800]">|</span> 服務項目
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {services.map((service) => {
            const CardContent = (
              <div
                className={`group relative flex h-full min-h-[112px] items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl transition duration-300 md:min-h-[116px] ${
                  service.link
                    ? "cursor-pointer hover:-translate-y-1 hover:border-[#ff8800]/70 hover:shadow-[0_0_28px_rgba(255,136,0,0.16)]"
                    : "opacity-90"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-[#ff8800] transition duration-300 group-hover:scale-105 group-hover:border-[#ff8800]/50 group-hover:bg-[#ff8800]/10">
                  {service.icon}
                </div>

                <div className="relative min-w-0">
                  <h3 className="text-base font-black leading-snug text-white md:text-[17px]">
                    {service.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-gray-400 transition group-hover:text-gray-200">
                    {service.description}
                  </p>
                </div>
              </div>
            );

            if (service.link) {
              return (
                <Link
                  href={service.link}
                  key={service.title}
                  className="block h-full"
                >
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