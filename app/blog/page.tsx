"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 指向我們自定義的 API Route，徹底解決 CORS 問題
    const proxyUrl = "/api/blog";
    
    const fetchData = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("API 路徑連線失敗");
        
        const data = await response.json();
        
        // 來自 API Route 的資料直接就是 JSON 物件，不需再判斷 data.contents
        const entry = data.feed?.entry || [];
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
          // 強力清理摘要，移除 CSS 和 HTML 標籤
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
            summary: cleanSummary.substring(0, 110) + "..."
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
          {/* 標題裝飾 - 螢光橘風格 */}
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
                <div 
                  key={i} 
                  className="group p-8 bg-[#111111] border border-white/5 rounded-3xl shadow-2xl hover:border-[#ff4500]/40 transition-all duration-500 hover:bg-[#161616]"
                >
                  <div className="flex items-center text-sm text-gray-500 mb-4 font-mono">
                    <Calendar className="w-4 h-4 mr-2 text-[#ff4500]" />
                    {post.date}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100 group-hover:text-[#ff4500] transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-6 leading-relaxed text-base md:text-lg">
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