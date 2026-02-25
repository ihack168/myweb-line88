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
    // 這裡對接你的 Blogger API 路由
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* pt-32 確保內容不被漂浮 Navbar 遮擋 */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        <header className="mb-12 border-l-4 border-primary pl-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            最新文章 <span className="text-primary text-lg ml-2">/ Blog</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            分享最新的網路投票技術、社群數據增長策略與 AI 應用心得。
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-xs text-primary font-mono mb-3">
                  {new Date(post.published).toLocaleDateString('zh-TW')}
                </div>
                <h2 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {/* 預覽文字：自動去除 HTML 標籤並擷取前 100 字 */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                  {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </p>
                <Link 
                  href={post.url} 
                  target="_blank"
                  className="inline-flex items-center text-sm font-bold text-primary hover:underline"
                >
                  閱讀更多 
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* 如果沒有文章的顯示狀態 */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground">目前尚無相關文章，敬請期待。</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}