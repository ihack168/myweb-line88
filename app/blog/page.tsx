"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle, ChevronLeft, ChevronRight, Tag } from "lucide-react";

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
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
          // 1. 提取 YouTube ID
          const youtubeMatch = rawContent.match(/youtube\.com\/embed\/([^"?\s]+)/);
          const videoId = youtubeMatch ? youtubeMatch[1] : null;

          // 2. 提取第一張圖片
          const imageMatch = rawContent.match(/<img[^>]+src="([^">]+)"/);
          const firstImgUrl = imageMatch ? imageMatch[1] : null;

          // 3. 提取標籤 (Blogger Tags)
          const categories = item.category ? item.category.map((cat: any) => cat.term) : [];
          
          // 4. 超強力內容清理
          let cleanSummary = rawContent
            .replace(/<script([\s\S]*?)<\/script>/gi, "") 
            .replace(/<style([\s\S]*?)<\/style>/gi, "")   
            .replace(/\{[\s\S]*?\}/g, "")                 
            .replace(/<[^>]*>/g, "")                     
            .replace(/&nbsp;/g, " ")                     
            .replace(/\s+/g, " ")                         
            .trim();

          // ✨ 網域邏輯修正
          const originalLink = item.link.find((l: any) => l.rel === "alternate")?.href || "";
          const finalLink = originalLink.replace("www.line88.tw", "blog.line88.tw");
          const blogBaseUrl = "https://blog.line88.tw";

          const finalThumbnail = videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
            : firstImgUrl;

          return {
            id: item.id.$t,
            title: item.title.$t,
            link: finalLink,
            blogBaseUrl: blogBaseUrl,
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110),
            videoId: videoId,
            thumbnailUrl: finalThumbnail,
            tags: categories.slice(0, 3) 
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
          
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 
              最新文章
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">掌握我們最新資訊，強化數據影響力</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-mono tracking-widest uppercase text-xs">Loading Data...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-12">
                {posts.length > 0 ? (
                  posts.map((post: any) => (
                    <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all duration-500 shadow-2xl">
                      <div className="flex flex-col md:flex-row">
                        
                        {/* 圖片/影片 區域 - 修復重點位置 */}
                        <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden bg-black">
                          {playingId === post.id && post.videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
                              className="absolute inset-0 w-full h-full border-0"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          ) : (
                            <>
                              <img 
                                src={post.thumbnailUrl || "/api/placeholder/400/300"} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                              />
                              {post.videoId && (
                                <button 
                                  onClick={() => setPlayingId(post.id)}
                                  className="absolute inset-0 flex items-center justify-center group/play"
                                >
                                  <div className="w-16 h-16 bg-[#ff4500] rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover/play:scale-110">
                                    <PlayCircle className="w-8 h-8 text-white fill-white" />
                                  </div>
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        {/* 文字區域 */}
                        <div className="flex-1 p-8 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-mono tracking-wider text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#ff4500]" />
                                {post.date}
                              </span>
                              {post.tags.map((tag: string) => (
                                <span key={tag} className="flex items-center text-[#ff4500]/80">
                                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h2 className="text-2xl font-bold mb-4 group-hover:text-[#ff4500] transition-colors duration-300 line-clamp-2">
                              {post.title}
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-sm line-clamp-3 mb-6">
                              {post.summary}...
                            </p>
                          </div>
                          
                          <a 
                            href={post.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-bold text-sm text-white group/link hover:text-[#ff4500] transition-colors"
                          >
                            閱讀更多 
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-2" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500">尚無文章</div>
                )}
              </div>

              {/* 分頁控制 */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full border border-white/10 text-gray-400 hover:border-[#ff4500] hover:text-[#ff4500] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <div className="flex gap-2">
                    {renderPageNumbers()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full border border-white/10 text-gray-400 hover:border-[#ff4500] hover:text-[#ff4500] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}