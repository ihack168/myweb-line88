export function ContactSection() {
  const contacts = [
    {
      label: "LINE 即時諮詢",
      description: "加入 LINE 官方帳號立即對話",
      href: "https://line.me/R/ti/p/~line88.tw",
      color: "green",
      icon: "💬",
    },
    {
      label: "Email 聯絡",
      description: "ihack168@gmail.com",
      href: "mailto:ihack168@gmail.com",
      color: "blue",
      icon: "✉️",
    },
    {
      label: "Facebook 粉專",
      description: "透過 Facebook 私訊我們",
      href: "https://www.facebook.com/lockheadhex",
      color: "orange",
      icon: "🔥",
    },
  ];

  return (
    <section id="contact" className="px-5 py-16 md:py-24 scroll-mt-40 isolate">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-sm md:text-base font-bold tracking-[0.25em] text-[#ff8800] uppercase mb-3">
            CONTACT
          </p>

          <h2 className="text-3xl md:text-5xl font-black text-white italic">
            <span className="text-[#ff8800]">|</span> 聯絡我們
          </h2>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {contacts.map((contact) => {
            const colorClass =
              contact.color === "green"
                ? "text-green-400 bg-green-400/10 hover:border-green-400 hover:shadow-[0_0_40px_rgba(74,222,128,0.22)]"
                : contact.color === "blue"
                ? "text-blue-400 bg-blue-400/10 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(96,165,250,0.22)]"
                : "text-[#ff8800] bg-[#ff8800]/10 hover:border-[#ff8800] hover:shadow-[0_0_40px_rgba(255,136,0,0.25)]";

            return (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  contact.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className={`group relative overflow-hidden flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${colorClass}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div
                  className={`relative flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${colorClass}`}
                >
                  {contact.icon}
                </div>

                <div className="relative">
                  <p className="text-lg md:text-2xl font-black text-white mb-1">
                    {contact.label}
                  </p>
                  <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-200 transition">
                    {contact.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}