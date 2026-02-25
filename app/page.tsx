export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main>
        <HeroSection /> {/* 這裡會顯示大 Logo 與標題 */}
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}