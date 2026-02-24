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
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        const blogData = JSON.parse(data.contents);
        const entry = blogData.feed.entry || [];
        
        const formattedPosts = entry.map((item: any) => {
          let rawContent = item.summary?.$t || item.content?.$t || "";

          // --- 超級清理邏輯開始 ---
          let cleanSummary = rawContent
            .replace(/<style([\s\S]*?)<\/style>/gi, "") // 移除 <style> 標籤
            .replace(/\.[\w-]+\s*\{[\s\S]*?\}/g, "")   // 移除類似 .className { ... } 的 CSS
            .replace(/\{[\s\S]*?\}/g, "")               // 移除所有大括號內容 (JSON-LD)
            .replace(/<script([\s\S]*?)<\/script>/gi, "") // 移除 <script>
            .replace(/<[^>]*>/g, "")                    // 移除所有 HTML 標籤
            .replace(/&nbsp;/g, " ")                    // 修正空格
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")                       // 移除多餘空白
            .trim();

          // 如果清理完變太短，補救措施
          if (cleanSummary.length < 5) {
            cleanSummary = "點擊下方連結閱讀完整文章內容。";
          }

          const finalSummary = cleanSummary.length > 120 
            ? cleanSummary.substring(0, 120) + "..." 
            : cleanSummary;

          return {
            title: item.title.$t,
            link: item.link.find((l: any) => l.rel === "alternate").href,
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: finalSummary
          };
        });
        
        setPosts(formattedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blogger feed error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* 標題 */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
              <BookOpen className="mr-4 text-[#00ff00] w-10 h-10" /> 最新文章
            </h1>
            <div className="h-1 w-20 bg-[#00ff00]"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00ff00]/20 border-t-[#00ff00] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">同步部落格內容中...</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post, i) => (
                <div 
                  key={i} 
                  className="group p-8 bg-[#1a1a1a] border border-white/5 rounded-2xl shadow-xl hover:border-[#00ff00]/50 transition-all duration-300"
                >
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-[#00ff00]" />
                    {post.date}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100 group-hover:text-[#00ff00] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-6 leading-relaxed text-base">
                    {post.summary}
                  </p>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-bold text-[#00ff00] hover:text-white transition-all"
                  >
                    閱讀全文 <ArrowRight className="w-5 h-5 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}