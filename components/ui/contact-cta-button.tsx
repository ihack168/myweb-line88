"use client"

export function ContactCtaButton() {
  return (
    <a
      href="/#contact"
      onClick={(e) => {
        e.preventDefault()
        sessionStorage.setItem("scrollTo", "contact")
        window.location.href = "/"
      }}
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-full bg-[#ff8800] px-6 py-4 text-black font-black shadow-[0_0_35px_rgba(255,136,0,0.6)] hover:scale-110 transition"
    >
      與我聯絡 →
    </a>
  )
}