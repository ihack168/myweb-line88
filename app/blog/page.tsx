"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
    
    // 改用 allorigins 的 https 直接轉發，並增加一個隨機參數防止被 cached
    const proxyUrl = "/api/blog";
    
    const fetchData = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("代理連線失敗");
        
        const data = await response.json();
        // 有些代理會把內容包在 contents 裡，有些是字串有些是物件，這裡做相容性處理
        const rawJson = typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
        const entry = rawJson.feed.entry || [];
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
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
            link: item.link.find((l: any) => l.rel === "alternate").href,
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110) + "..."
          };
        });
        
        setPosts(formattedPosts);
      } catch (err) {
        console.error("Blogger feed error:", err);
        // 如果連代理都掛了，最後一招：嘗試使用另一個公共代理
        try {
            const backupUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
            const backupRes = await fetch(backupUrl);
            const backupData = await backupRes.json();
            // ... 這裡可以補上處理邏輯，但通常第一個沒過，這個機率也低
        } catch (e) {}
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
              <p className="text-gray-500 animate-pulse font-mono text-sm">BYPASSING CORS RESTRICTIONS...</p>
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
              <p className="text-[#ff4500] mb-2 font-bold">ERROR: 數據傳輸中斷</p>
              <p className="text-gray-500">目前無法連線至數據中心，請檢查您的網路狀態或稍後再試。</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}