"use client"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6">
      <div className="relative group cursor-pointer">
        {/* 橘色呼吸燈背景 */}
        <div className="absolute -inset-10 bg-[#ff8800]/10 rounded-full blur-[80px] group-hover:bg-[#ff8800]/20 transition-all duration-1000 animate-pulse"></div>
        <div className="absolute inset-0 bg-[#ff8800]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10">
          <Image
            src="/images/logo.png" 
            alt="Lockhead Hex"
            width={500}
            height={200}
            className="w-64 md:w-[400px] h-auto transition-all duration-700 
                       drop-shadow-[0_0_15px_rgba(255,136,0,0.2)] 
                       group-hover:drop-shadow-[0_0_35px_rgba(255,136,0,0.6)] 
                       group-hover:scale-105"
            priority
          />
        </div>

        {/* 橘色裝飾條 */}
        <div className="mt-4 mx-auto w-20 h-[3px] bg-gradient-to-r from-transparent via-[#ff8800] to-transparent shadow-[0_0_15px_#ff8800] transition-all duration-700 group-hover:w-40"></div>
      </div>

      <div className="mt-6 mb-0">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic text-white">
          LOCKHEAD <span className="text-[#ff8800]">HEX</span>
        </h1>
      </div>
    </section>
  )
}