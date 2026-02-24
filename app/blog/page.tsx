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

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={
            currentPage === i
              ? "w-10 h-10 rounded-full bg-[#ff4500] text-white shadow-lg"
              : "w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:border-[#ff4500] hover:text-[#ff4500]"
          }
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
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 
              最新技術文章
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">掌握網路投票、數據優化與自動化行銷的最新技術</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-10 h-10 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-10">
                {posts.map((post: any) => (
                  <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all">
                    <div className="flex flex-col md:flex-row">
                      {post.videoId && (
                        <div className="relative w-full md:w-2/5 aspect-video bg-black">
                          {playingId === post.id ? (
                            <iframe src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`} className="w-full h-full border-0" allowFullScreen></iframe>
                          ) : (
                            <div className="relative w-full h-full cursor-pointer" onClick={() => setPlayingId(post.id)}>
                              <img src={post.thumbnailUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="w-16 h-16 text-[#ff4500] transform group-hover:scale-110 transition-transform" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-8 flex-1">
                        <div className="flex items-center text-xs text-gray-500 mb-3 uppercase tracking-widest">{post.date}</div>
                        <h2 className="text-2xl font-bold mb-4 group-hover:text-[#ff4500] transition-colors line-clamp-2">{post.title}</h2>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{post.summary}</p>
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-[#ff4500] hover:text-[#ff8c00]">
                          閱讀全文 <ArrowRight className="ml-2 w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-20 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">{renderPageNumbers()}</div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-[#111] border border-white/10 rounded-full hover:border-[#ff4500] disabled:opacity-20"
                >
                  <ChevronRight className="w-5 h-5" />
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