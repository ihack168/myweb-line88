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
  labels?: string[]; // 這裡存放 Blogger 的標籤 (Tag)
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("API Response Error");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("無法載入文章:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        <header className="mb-16">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            技術專欄 <span className="text-[#00ff00] text-xl ml-2 italic">/ Tech Insights</span>
          </h1>
          <div className="h-1 w-20 bg-[#00ff00]"></div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#00ff00] mb-4"></div>
            <p className="text-gray-500 font-mono text-sm tracking-widest">LOADING BLOGS...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="group relative flex flex-col rounded-xl border border-white/10 bg-white/5 p-7 hover:bg-white/[0.08] transition-all duration-500 shadow-xl"
              >
                {/* 標籤功能 (Tags) */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.labels && post.labels.length > 0 ? (
                    post.labels.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest bg-[#00ff00]/10 text-[#00ff00] px-2 py-1 rounded-sm">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest bg-white/10 text-gray-400 px-2 py-1 rounded-sm">
                      #一般資訊
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-3 font-mono">
                  {new Date(post.published).toLocaleDateString('zh-TW')}
                </div>

                <h2 className="text-xl font-bold mb-4 leading-snug group-hover:text-[#00ff00] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-400 text-sm line-clamp-3 mb-8 flex-grow">
                  {post.content.replace(/<[^>]*>/g, "").substring(0, 90)}...
                </p>

                {/* 你指定的按鈕文字 */}
                <Link 
                  href={post.url} 
                  target="_blank"
                  className="flex items-center justify-between group/btn text-sm font-bold border-t border-white/10 pt-5 hover:text-[#00ff00] transition-colors"
                >
                  <span>閱讀完整內容</span>
                  <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-32 text-gray-600">
            目前暫無相關文章發佈。
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}