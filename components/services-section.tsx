import React from "react";
import Link from "next/link";

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

const services: ServiceItem[] = [
  // 你原本的 services 陣列不用改，直接保留
];

export function ServicesSection() {
  return (
    <section id="services" className="relative px-5 py-16 md:py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,136,0,0.12),transparent_35%)]" />

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

                    <p className="mt-2 text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );

            if (service.link) {
              return (
                <Link href={service.link} key={service.title} className="block">
                  {CardContent}
                </Link>
              );
            }

            return <div key={service.title}>{CardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}