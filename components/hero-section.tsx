export function HeroSection() {
  return (
    <section id="hero" className="flex flex-col items-center justify-center pt-24 pb-6 px-6">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="rounded-2xl shadow-2xl"
        style={{ width: '200px', height: '200px', objectFit: 'cover' }} // 強制 200px
      />
      <h1 className="mt-6 text-3xl md:text-4xl font-black text-white tracking-tight text-center">
        洛克希德黑克斯
      </h1>
      <p className="text-sm text-[#00ff00] font-bold tracking-[0.4em] uppercase mt-2">
        LOCKHEAD HEX
      </p>
    </section>
  )
}