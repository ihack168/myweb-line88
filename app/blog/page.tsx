"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // 新增狀態：記錄目前哪一篇文章正在播放影片
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const proxyUrl = "/api/blog";
    const fetchData = async () => {
      try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const entry = data.feed?.entry || [];
        
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
            id: item.id.$t, // 增加唯一 ID
            title: item.title.$t,
            link: item.link.find((l: any) => l.rel === "alternate")?.href || "#",
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110) + "...",
            videoId: videoId,
            thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
          };
        });
        setPosts(formattedPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* 標題區 */}
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 最新技術文章
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
          </div>

          {loading ? (
            <div className="text-center py-20">正在載入數據中心資料...</div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all">
                  <div className="flex flex-col md:flex-row">
                    
                    {/* 影片/縮圖區塊 */}
                    {post.videoId && (
                      <div className="relative w-full md:w-2/5 aspect-video bg-black">
                        {playingId === post.id ? (
                          /* 播放狀態：顯示 iframe */
                          <iframe
                            src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          /* 預覽狀態：顯示縮圖與播放按鈕 */
                          <div 
                            className="relative w-full h-full cursor-pointer group/thumb"
                            onClick={() => setPlayingId(post.id)}
                          >
                            <img src={post.thumbnailUrl} className="w-full h-full object-cover opacity-70 group-hover/thumb:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="w-16 h-16 text-[#ff4500] drop-shadow-2xl transform group-hover/thumb:scale-125 transition-transform" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 文字區塊 */}
                    <div className="p-8 flex-1">
                      <div className="text-sm text-gray-500 mb-2 font-mono">{post.date}</div>
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-[#ff4500] transition-colors">{post.title}</h2>
                      <p className="text-gray-400 mb-6 text-sm leading-relaxed">{post.summary}</p>
                      <a href={post.link} target="_blank" className="text-[#ff4500] font-bold flex items-center hover:underline">
                        詳細技術細節 <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </div>

                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}