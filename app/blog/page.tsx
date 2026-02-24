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

  // 產生頁碼按鈕
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-full border transition-all duration-300 ${
            currentPage === i
              ? "bg-[#ff4500] border-[#ff4500] text-white shadow-lg"
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          
          {/* 標題區塊：回歸原本的專業風格 */}
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 
              最新技術文章
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">
              掌握網路投票、數據優化與自動化行銷的最新技術
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-10 h-10 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">載入中...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-10">
                {posts.map((post: any) => (
                  <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all shadow-xl">
                    <div className="flex flex-col md:flex-row">
                      
                      {/* 影片區域 */}
                      {post.videoId && (
                        <div className="relative w-full md:w-2/5 aspect-video bg-black">
                          {playingId === post.id ? (
                            <iframe 
                              src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`} 
                              className="w-full h-full" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="relative w-full h-full cursor-pointer group/thumb" onClick={() => setPlayingId(post.id)}>
                              <img src={post.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover/thumb:opacity-100 transition-all" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="w-16 h-16 text-[#ff4500] drop-shadow-2xl transform group-hover/thumb:scale-110 transition-transform" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 文字區域 */}
                      <div className="p-8 flex-1">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4 mr-2 text-[#ff4500]" />
                          {post.date}
                        </div>
                        <h2 className="text-2xl font-bold mb-4 group-hover:text-[#ff4500] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                        <a 
                          href={post.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center font-bold text-[#ff4500] hover:text-[#ff8c00] transition-all"
                        >
                          閱讀全文內容 <ArrowRight className="ml-2 w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* 分頁控制區 */}
              <div className="mt-20 flex items-center justify-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-20 transition-all"