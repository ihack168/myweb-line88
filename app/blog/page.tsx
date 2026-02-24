"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle, ChevronLeft, ChevronRight, Cpu } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPlayingId(null);
      try {
        const response = await fetch(`/api/blog?page=${currentPage}`);
        const result = await response.json();
        
        const entry = result.feed?.entry || [];
        setTotalPages(result.pagination?.totalPages || 1);
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.summary?.$t || item.content?.$t || "";
          const youtubeMatch = rawContent.match(/youtube\.com\/embed\/([^"?\s]+)/);
          const videoId = youtubeMatch ? youtubeMatch[1] : null;
          
          let cleanSummary = rawContent
            .replace(/<style([\s\S]*?)<\/style>/gi, "") 
            .replace(/<[^>]*>/g, "")                    
            .replace(/&nbsp;/g, " ")                       
            .replace(/\s+/g, " ")                       
            .trim();

          return {
            id: item.id.$t,
            title: item.title.$t,
            link: item.link.find((l: any) => l.rel === "alternate")?.href || "#",
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110) + "...",
            videoId: videoId,
            thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
          };
        });
        setPosts(formattedPosts);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // 產生頁碼邏輯
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // 簡單起見顯示所有頁碼，若頁數過多（如超過10頁）建議再做省略號邏輯
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-lg border font-mono transition-all duration-300 ${
            currentPage === i
              ? "bg-[#ff4500] border-[#ff4500] text-white shadow-[0_0_15px_rgba(255,69,0,0.5)]"
              : "bg-transparent border-white/10 text-gray-500 hover:border-[#ff4500]/50 hover:text-[#ff4500]"
          }`}
        >
          {i.toString().padStart(2, '0')}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#ff4500]/30">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* 標題區 */}
          <div className="mb-16 relative">
            <div className="absolute -left-4 top-0 w-1 h-12 bg-[#ff4500] hidden md:block"></div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center tracking-tighter">
              <Cpu className="mr-4 text-[#ff4500] animate-pulse" /> 
              DATA TERMINAL
            </h1>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-[0.2em]">
              Accessing encrypted blog database... Page {currentPage.toString().padStart(2, '0')}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-16 h-1 border-2 border-[#ff4500] animate-[loading_1.5s_infinite]"></div>
              <p className="mt-4 font-mono text-xs text-[#ff4500] tracking-widest uppercase">Decrypted Syncing...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-12">
                {posts.map((post: any) => (
                  <article key={post.id} className="group relative">
                    {/* 裝飾性背景 */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#ff4500]/0 to-[#ff4500]/0 group-hover:from-[#ff4500]/5 group-hover:to-transparent rounded-3xl transition-all duration-500"></div>
                    
                    <div className="relative flex flex-col md:flex-row gap-8 items-center">
                      {/* 影片區域 */}
                      {post.videoId && (
                        <div className="w-full md:w-80 aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#ff4500]/30 transition-colors shadow-2xl">
                          {playingId === post.id ? (
                            <iframe src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`} className="w-full h-full" allowFullScreen></iframe>
                          ) : (
                            <div className="relative w-full h-full cursor-pointer group/thumb" onClick={() => setPlayingId(post.id)}>
                              <img src={post.thumbnailUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover/thumb:grayscale-0 transition-all duration-500" />
                              <div className="absolute inset-0 bg-[#ff4500]/10 mix-blend-overlay"></div>
                              <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 scale-50 group-hover/thumb:scale-100" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* 文字區域 */}
                      <div className="flex-1">
                        <div className="text-[10px] font-mono text-[#ff4500] mb-2 tracking-[0.3em] uppercase opacity-70">{post.date} // DATABASE_ENTRY</div>
                        <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-[#ff4500] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed font-light">
                          {post.summary}
                        </p>
                        <a href={post.link} target="_blank" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-white/50 hover:text-[#ff4500] transition-colors group/link">
                          Execute Read <ArrowRight className="ml-2 w-3 h-3 transform group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* 分頁按鈕區 - 黑客矩陣風格 */}
              <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/10 rounded hover:bg-white hover:text-black disabled:opacity-20 transition-all"
                >
                  Prev
                </button>

                <div className="flex gap-2 mx-4">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/10 rounded hover:bg-white hover:text-black disabled:opacity-20 transition-all"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
      <Footer />
    </div>
  );
}