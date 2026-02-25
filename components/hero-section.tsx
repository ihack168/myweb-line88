"use client"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6">
      {/* 核心容器：包含 Logo 與發光背景 */}
      <div className="relative group cursor-pointer">
        
        {/* 1. 底層超大柔和光暈 (呼吸燈效果) */}
        <div className="absolute -inset-10 bg-[#00ff00]/10 rounded-full blur-[80px] group-hover:bg-[#00ff00]/20 transition-all duration-1000 animate-pulse"></div>
        
        {/* 2. 中層聚光燈 (滑鼠移上去會變亮) */}
        <div className="absolute inset-0 bg-[#00ff00]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* 3. 主 Logo 圖片 - 確保 src 檔名與 public 資料夾內完全一致 */}
        <div className="relative z-10">
          <Image
            src="/images/logo.png" 
            alt="Lockhead Hex Large Logo"
            width={500}
            height={200}
            className="w-64 md:w-[400px] h-auto transition-all duration-700 
                       drop-shadow-[0_0_15px_rgba(0,255,0,0.2)] 
                       group-hover:drop-shadow-[0_0_35px_rgba(0,255,0,0.6)] 
                       group-hover:scale-105"
            priority
          />
        </div>

        {/* 4. Logo 下方的螢光裝飾條 */}
        <div className="mt-4 mx-auto w-20 h-[3px] bg-gradient-to-r from-transparent via-[#00ff00] to-transparent shadow-[0_0_15px_#00ff00] transition-all duration-700 group-hover:w-40"></div>
      </div>

      {/* 品牌名稱 - 刪除副標題並縮小下間距 */}
      <div className="mt-6 mb-0">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic">
          LOCKHEAD <span className="text-[#00ff00]">HEX</span>
        </h1>
      </div>
    </section>
  )
}