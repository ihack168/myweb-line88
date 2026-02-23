const contacts = [
  {
    label: "Line",
    description: "加入 Line 與我聯絡",
    href: "https://line.me/R/ti/p/~line88.tw",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
  },
  {
    label: "Email",
    description: "ihack168@gmail.com",
    href: "mailto:ihack168@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
  },
  {
    label: "Facebook",
    description: "透過 Facebook 粉絲專頁聯絡",
    href: "https://www.facebook.com/lockheadhex",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-8">
      <h2 className="text-xl font-bold text-center text-foreground mb-6">
        <span className="text-primary">|</span> 聯絡我們
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-3xl mx-auto">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full sm:w-auto rounded-xl border border-border bg-card px-5 py-3 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
              {contact.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground">{contact.label}</p>
              <p className="text-xs text-muted-foreground">{contact.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
