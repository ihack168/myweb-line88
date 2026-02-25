"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("API data is not an array:", data);
          setError(true);
        }
      } catch (err) {
        console.error("Blog fetch error:", err);
        setError(true);
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
        <h1 className="text-4xl font-black mb-12 italic">
          技術專欄 <span className="text-[#00ff00] text-xl ml-2 NOT-ITALIC">BLOG</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00ff00]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-dashed border-white/20 rounded-xl">
            <p className="text-gray-400 mb-4">暫時無法載入文章，請稍後再試</p>
            <button onClick={() => window.location.reload()} className="text-[#00ff00] underline">重新整理</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <article key={post.id} className="group bg-white/5 border border-white/10 p-6 rounded-xl hover:border-[#00ff00]/50 transition-all shadow-xl">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.labels?.map((tag: any) => (
                      <span key={tag.name || tag} className="text-[10px] bg-[#00ff00]/10 text-[#00ff00] px-2 py-1 rounded">
                        #{tag.name || tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-[#00ff00] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                    {post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 100) : "無內容摘要"}...
                  </p>
                  <Link 
                    href={post.url || "#"} 
                    target="_blank" 
                    className="inline-block w-full text-center py-3 bg-white/5 hover:bg-[#00ff00] hover:text-black transition-all rounded-lg font-bold text-sm"
                  >
                    閱讀完整內容
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl">
                <p className="text-gray-500">尚無文章或正在載入資料中...</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}