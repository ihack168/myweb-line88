"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
      setPlayingId(null); // 切換頁面時停止播放影片
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
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 切換頁面後回到頂部
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]); // 當頁碼改變時重新抓取資料

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* 標題區 */}
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 技術專欄
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-4 text-gray-500">第 {currentPage} 頁 / 共 {totalPages} 頁</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 animate-pulse">正在存取數據庫...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-8">
                {posts.map((post: any) => (
                  <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all">
                    <div className="flex flex-col md:flex-row">
                      {/* 影片區域 */}
                      {post.videoId && (
                        <div className="relative w-full md:w-2/5 aspect-video bg-black">
                          {playingId === post.id ? (
                            <iframe src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`} className="w-full h-full" allowFullScreen></iframe>
                          ) : (
                            <div className="relative w-full h-full cursor-pointer" onClick={() => setPlayingId(post.id)}>
                              <img src={post.thumbnailUrl} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="w-14 h-14 text-[#ff4500]" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* 文字區域 */}
                      <div className="p-8 flex-1">
                        <div className="text-xs text-[#ff4500] mb-2 font-mono uppercase tracking-widest">{post.date}</div>
                        <h2 className="text-xl font-bold mb-3 group-hover:text-[#ff4500] transition-colors">{post.title}</h2>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-3">{post.summary}</p>
                        <a href={post.link} target="_blank" className="inline-flex items-center text-sm font-bold text-white hover:text-[#ff4500] transition-colors">
                          READ FULL ARTICLE <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* 分頁按鈕區 */}
              <div className="mt-16 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-6 py-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" /> 上一頁
                </button>
                
                <span className="font-mono text-gray-500">
                  <span className="text-white">{currentPage}</span> / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-6 py-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  下一頁 <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}