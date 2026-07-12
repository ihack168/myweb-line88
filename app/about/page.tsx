import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '隱私權政策',
  description: '洛克希德黑克斯網站隱私權政策。',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-6 pb-24 pt-36">
      <h1 className="text-3xl font-black text-[#ff8800] md:text-5xl">
        隱私權政策
      </h1>

      <p className="mt-6 leading-8 text-gray-300">
        本網站隱私權政策正在整理中，完整內容將於近期更新。
      </p>
    </main>
  )
}