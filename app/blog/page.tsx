"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  published: string;
  url: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 串接你之前的 Blogger API 路由
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("網路回應不完全");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("無法載入文章資料:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 導覽列 */}
      <Navbar />
      
      {/* 主內容區：pt-32 確保內容不會被漂浮的 Logo 導覽列遮住 */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        
        {/* 部落格標頭 */}
        <header className="mb-16 border-l-4 border-[#00ff00] pl-6">
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            技術專欄 <span className="text-[#00ff00] text-xl ml-2">BLOG</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl text-lg">
            洛克希德黑克斯技術團隊分享：關於網路投票、SEO 優化及社群數據增長的深度解析。
          </p>
        </header>

        {/* 載入狀態 */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff00]"></div>
            <p className="text-gray-500 font-mono">LOADING DATA...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-[#00ff00]/50 transition-all duration-300 shadow-2xl"
              >
                <div className="text-xs text-[#00ff00] font-mono mb-4 tracking-widest">
                  {new Date(post.published).toLocaleDateString('zh-TW')}
                </div>
                
                <h2 className="text-xl font-bold mb-4 group-hover:text-[#00ff00] transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h2>
                
                {/* 自動過濾 HTML 標籤並擷取摘要 */}
                <p className="text-gray-400 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                  {post.content.replace(/<[^>]*>/g, "").substring(0, 120)}...
                </p>
                
                <Link 
                  href={post.url} 
                  target="_blank"
                  className="inline-flex items-center text-sm font-black text-[#00ff00] group-hover:translate-x-2 transition-transform duration-300"
                >
                  READ MORE 
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* 空狀態 */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 italic">目前尚未發佈文章，敬請期待技術更新。</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}