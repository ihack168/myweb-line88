import Image from "next/image"

export function HeroSection() {
  return (
    <section id="hero" className="flex flex-col items-center justify-center pt-16 pb-6 px-6">
      <Image
        src="/images/logo.png"
        alt="洛克希德黑克斯 Logo"
        width={280}
        height={280}
        className="rounded-2xl"
        priority
      />
      <h1 className="mt-4 text-3xl md:text-4xl font-black text-foreground tracking-tight text-balance text-center">
        洛克希德黑克斯
      </h1>
      <p className="text-base text-primary font-medium tracking-widest">
        LOCKHEAD HEX
      </p>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-md leading-relaxed">
        特殊網路服務中心 買票、灌票、Line網路投票 Facebook網路投票 Google網路投票 Facebook、IG、Threads大量按讚、大量追蹤。
      </p>
    </section>
  )
}
