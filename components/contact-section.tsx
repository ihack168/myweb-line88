const contacts = [
  {
    label: "Line",
    description: "加入 Line 與我聯絡",
    href: "https://line.me/R/ti/p/~line88.tw",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
  },
  {
    label: "Email",
    description: "ihack168@gmail.com",
    href: "mailto:ihack168@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
  },
  {
    label: "Facebook",
    description: "透過 Facebook 粉絲專頁聯絡",
    href: "https://www.facebook.com/lockheadhex",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-20"> {/* 增加上下間距讓區塊更明顯 */}
      <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-12 italic">
        <span className="text-[#ff8800]">|</span> 聯絡我們
      </h2>
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-6xl mx-auto">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 w-full lg:w-auto rounded-2xl border border-white/10 bg-white/5 px-8 py-5 hover:border-[#ff8800]/50 hover:bg-[#ff8800]/5 transition-all duration-300 group"
          >
            {/* 圖示外圈放大 */}
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-[#ff8800]/10 text-[#ff8800] group-hover:scale-110 transition-transform">
              {contact.icon}
            </div>
            
            <div>
              {/* 主標籤字體加大 */}
              <p className="text-xl font-black text-white mb-1">{contact.label}</p>
              {/* 描述文字字體加大 */}
              <p className="text-sm text-gray-400 font-medium group-hover:text-gray-200 transition-colors">
                {contact.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}