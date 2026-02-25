import Image from "next/image"

export function HeroSection() {
  return (
    // 這裡的 pt-10 配合 Navbar 的高度，避免重疊
    <section id="hero" className="flex flex-col items-center justify-center pt-10 pb-2 px-6">
      {/* 稍微縮小 Logo，讓它在手機上也好瀏覽 */}
      <Image
        src="/images/logo.png"
        alt="洛克希德黑克斯 Logo"
        width={180} // 從 280 改小一點，視覺更精緻
        height={180}
        className="rounded-2xl shadow-2xl shadow-primary/20"
        priority
      />
      
      {/* 如果你真的想刪除 "特殊網路服務中心"，保留品牌名就好 */}
      <h1 className="mt-4 text-2xl md:text-3xl font-black text-foreground tracking-tight text-center">
        洛克希德黑克斯
      </h1>
      <p className="text-xs text-primary font-bold tracking-[0.3em] uppercase opacity-80">
        LOCKHEAD HEX
      </p>
    </section>
  )
}