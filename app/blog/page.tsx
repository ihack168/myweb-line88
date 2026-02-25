"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function BlogPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog?page=${page}`);
        const result = await res.json();
        setData(result);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchPosts();
    window.scrollTo(0, 0);
  }, [page]);

  const cleanContent = (content: string) => {
    if (!content) return "無內容摘要";
    return content
      .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gim, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 80);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black mb-12 italic text-[#ff8800]">
          TECH BLOG <span className="text-white/20 text-sm not-italic ml-2 tracking-widest">LATEST POSTS</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ff8800]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.posts?.map((post: any) => (
              <article key={post.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-[#ff8800]/30 transition-all shadow-2xl">
                
                <div className="relative h-52 w-full bg-black overflow-hidden">
                  {activeVideo === post.id && post.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="relative h-full w-full cursor-pointer" onClick={() => post.videoId && setActiveVideo(post.id)}>
                      <img 
                        src={post.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                      />
                      {post.videoId && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-[#ff8800] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,136,0,0.4)] group-hover:scale-110 transition-transform">
                            <div className="border-l-[16px] border-l-black border-y-[10px] border-y-transparent ml-1"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag: string) => (
                      <a
                        key={tag}
                        href={`https://blog.line88.tw/search/label/${encodeURIComponent(tag)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold bg-[#ff8800]/10 text-[#ff8800] px-2 py-1 rounded hover:bg-[#ff8800] hover:text-black transition-all"
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-[#ff8800] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                    {cleanContent(post.content)}...
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <a href={post.link} target="_blank" className="inline-flex items-center gap-2 text-[#ff8800] text-sm font-bold group/link">
                      閱讀全文內容 <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center items-center gap-8">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1} 
            className="text-sm font-bold tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white/5 disabled:opacity-20 transition-all"
          >
            PREV
          </button>
          <div className="text-[#ff8800] font-mono text-lg">
            {String(page).padStart(2, '0')} <span className="text-white/20 px-2">/</span> {String(data?.pagination?.totalPages || 1).padStart(2, '0')}
          </div>
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={page >= (data?.pagination?.totalPages || 1)} 
            className="text-sm font-bold tracking-widest bg-[#ff8800] text-black px-6 py-2 rounded-full hover:shadow-[0_0_20px_rgba(255,136,0,0.6)] disabled:opacity-20 transition-all"
          >
            NEXT
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}