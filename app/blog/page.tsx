"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 指向我們自定義的 API Route
    const proxyUrl = "/api/blog";
    
    const fetchData = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("API 路徑連線失敗");
        
        const data = await response.json();
        const entry = data.feed?.entry || [];
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
          // 1. 提取 YouTube 影片 ID
          const youtubeMatch = rawContent.match(/youtube\.com\/embed\/([^"?\s]+)/);
          const videoId = youtubeMatch ? youtubeMatch[1] : null;
          
          // 2. 生成縮圖網址 (使用 maxresdefault 取得高畫質圖)
          const thumbnailUrl = videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
            : null;

          // 3. 強力清理摘要，移除 CSS 和 HTML 標籤
          let cleanSummary = rawContent
            .replace(/<style([\s\S]*?)<\/style>/gi, "") 
            .replace(/\.[\w-]+\s*\{[\s\S]*?\}/g, "")   
            .replace(/\{[\s\S]*?\}/g, "")               
            .replace(/<[^>]*>/g, "")                    
            .replace(/&nbsp;/g, " ")                       
            .replace(/\s+/g, " ")                       
            .trim();

          return {
            title: item.title.$t,
            link: item.link.find((l: any) => l.rel === "alternate")?.href || "#",
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110) + "...",
            thumbnailUrl: thumbnailUrl
          };
        });
        
        setPosts(formattedPosts);
      } catch (err) {
        console.error("Blogger API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* 標題區塊 */}
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start text-white">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 
              最新技術文章
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#ff4500] to-[#ff8c00] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">掌握網路投票、數據優化與自動化行銷的最新技術</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 animate-pulse font-mono text-sm uppercase tracking-widest">Synchronizing Data...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-8">
              {posts.map((post: any, i) => (
                <article 
                  key={i} 
                  className="group p-0 bg-[#111111] border border-white/5 rounded-3xl shadow-2xl overflow-hidden hover:border-[#ff4500]/40 transition-all duration-500 hover:bg-[#161616]"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 左側/上方：縮圖區塊 */}
                    {post.thumbnailUrl && (
                      <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                        <img 
                          src={post.thumbnailUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* 播放按鈕裝飾 */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <PlayCircle className="w-12 h-12 text-[#ff4500] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        </div>
                      </div>
                    )}

                    {/* 右側/下方：文字內容 */}
                    <div className="p-8 flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-4 font-mono">
                        <Calendar className="w-4 h-4 mr-2 text-[#ff4500]" />
                        {post.date}
                      </div>
                      <h2 className="text-2xl font-bold mb-4 text-gray-100 group-hover:text-[#ff4500] transition-colors duration-300">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 mb-6 leading-relaxed text-base">
                        {post.summary}
                      </p>
                      
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center font-bold text-[#ff4500] hover:text-[#ff8c00] transition-all duration-300"
                      >
                        進入主站閱讀全文 
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#111]">
              <p className="text-[#ff4500] mb-2 font-bold uppercase tracking-tighter">Connection Error</p>
              <p className="text-gray-500">目前無法與 Blogger 中心建立連線，請稍後再試。</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}