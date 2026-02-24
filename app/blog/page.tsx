"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPlayingId(null);
      try {
        const response = await fetch(`/api/blog?page=${currentPage}`);
        if (!response.ok) throw new Error("Fetch failed");
        const result = await response.json();
        
        const entry = result.feed?.entry || [];
        setTotalPages(result.pagination?.totalPages || 1);
        
        const formattedPosts = entry.map((item: any) => {
          // 取得原始 HTML 內容
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
          // 1. 提取 YouTube ID
          const youtubeMatch = rawContent.match(/youtube\.com\/embed\/([^"?\s]+)/);
          const videoId = youtubeMatch ? youtubeMatch[1] : null;
          
          // 2. 超強力內容清理：依序移除 Script, Style, JSON 大括號內容, 最後才是 HTML 標籤
          let cleanSummary = rawContent
            .replace(/<script([\s\S]*?)<\/script>/gi, "") // 移除 <script>...</script>
            .replace(/<style([\s\S]*?)<\/style>/gi, "")   // 移除 <style>...</style>
            .replace(/\{[\s\S]*?\}/g, "")                 // 移除所有 { JSON 內容 }
            .replace(/<[^>]*>/g, "")                      // 移除所有 HTML 標籤
            .replace(/&nbsp;/g, " ")                      // 轉義空白
            .replace(/\s+/g, " ")                         // 壓縮多餘空白
            .trim();

          return {
            id: item.id.$t,
            title: item.title.$t,
            link: item.link.find((l: any) => l.rel === "alternate")?.href || "#",
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110),
            videoId: videoId,
            thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
          };
        });
        
        setPosts(formattedPosts);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // 渲染頁碼按鈕
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-full border transition-all duration-300 font-mono ${
            currentPage === i
              ? "bg-[#ff4500] border-[#ff4500] text-white shadow-lg shadow-[#ff4500]/20"
              : "bg-transparent border-white/10 text-gray-400 hover:border-[#ff4500] hover:text-[#ff4500]"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff4500]/30">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          
          {/* 標題區 */}
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 
              最新文章
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">
              掌握我們最新資訊
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-mono tracking-widest uppercase text-xs">Loading Data...</p>
            </div>
          ) : (
            <>
              {/* 文章列表 */}
              <div className="grid gap-12">
                {posts.length > 0 ? (
                  posts.map((post: any) => (
                    <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all duration-500 shadow-2xl">
                      <div className="flex flex-col md:flex-row">
                        
                        {/* 影片區域 */}
                        {post.videoId && (
                          <div className="relative w-full md:w-2/5 aspect-video bg-black shrink-0">
                            {playingId === post.id ? (
                              <iframe 
                                src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`} 
                                className="w-full h-full border-0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <div className="relative w-full h-full cursor-pointer group/thumb" onClick={() => setPlayingId(post.id)}>
                                <img src={post.thumbnailUrl} className="w-full h-full object-cover opacity-70 group-hover/thumb:opacity-100 transition-all duration-500" alt={post.title} />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-transparent transition-all">
                                  <PlayCircle className="w-16 h-16 text-[#ff4500] drop-shadow-2xl transform group-hover/thumb:scale-110 transition-transform duration-300" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 文字區域 */}
                        <div className="p-8 flex-1 flex flex-col justify-center">
                          <div className="flex items-center text-xs text-gray-500 mb-3 font-mono">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-[#ff4500]" />
                            {post.date}
                          </div>
                          <h2 className="text-2xl font-bold mb-4 group-hover:text-[#ff4500] transition-colors duration-300 line-clamp-2 leading-tight">
                            {post.title}
                          </h2>
                          <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3 font-light">
                            {post.summary}...
                          </p>
                          <a 
                            href={post.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-bold text-[#ff4500] hover:text-[#ff8c00] transition-all text-sm tracking-wider uppercase"
                          >
                            閱讀完整文章<ArrowRight className="ml-2 w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500">暫無文章數據</div>
                )}
              </div>

              {/* 分頁控制 */}
              <div className="mt-20 flex flex-col items-center gap-6">
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-20 transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {renderPageNumbers()}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-20 transition-all active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-gray-600 text-[10px] font-mono tracking-[0.2em] uppercase">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}