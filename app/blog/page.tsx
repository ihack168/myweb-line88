"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function BlogPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog?page=${page}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
    window.scrollTo(0, 0); // 切換頁面後回到頂部
  }, [page]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black mb-12 italic">
          技術專欄 <span className="text-[#00ff00] text-xl ml-2 NOT-ITALIC">BLOG</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00ff00]"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {data?.posts?.map((post: any) => (
                <article key={post.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#00ff00]/50 transition-all shadow-xl">
                  {/* 縮圖區域 */}
                  <div className="relative h-48 w-full">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {post.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <div className="border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-[#00ff00] transition-colors">{post.title}</h2>
                    <p className="text-gray-400 text-xs mb-6 line-clamp-3">
                      {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                    </p>
                    <Link href={post.link} target="_blank" className="block text-center py-2 bg-white/5 hover:bg-[#00ff00] hover:text-black transition-all rounded font-bold text-xs">
                      閱讀完整內容
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* 分頁按鈕 */}
            <div className="flex justify-center items-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 rounded disabled:opacity-30"
              >上一頁</button>
              <span className="text-[#00ff00] font-mono">PAGE {page} / {data?.pagination?.totalPages}</span>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (data?.pagination?.totalPages || 1)}
                className="px-4 py-2 bg-white/5 rounded disabled:opacity-30"
              >下一頁</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}