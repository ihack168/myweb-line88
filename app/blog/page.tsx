"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 抓取 Blogger 的 JSON feed
    const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
    // 加入 Timestamp 防止代理伺服器快取錯誤
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;

    fetch(proxyUrl)
      .then((res) => res.json())
      .then((data) => {
        // 解析代理伺服器傳回的內容
        const rawJson = typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
        const entry = rawJson.feed.entry || [];
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
          // 強力清理摘要內容，避免顯示 CSS/JSON 代碼
          let cleanSummary = rawContent
            .replace(/<style([\s\S]**)<\/style>/gi, "") 
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
          {/* 標題裝飾 - 改為螢光橘 */}
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start text-white">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 最新文章
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#ff4500] to-[#ff8c00] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">探索 AI 客服與自動化行銷的最新技術動態</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              {/* 載入動畫改為橘色 */}
              <div className="w-10 h-10 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 animate-pulse">正在同步 Blogger 最新內容...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-8">
              {posts.map((post: any, i) => (
                <div 
                  key={i} 
                  className="group p-8 bg-[#161616] border border-white/5 rounded-3xl shadow-2xl hover:border-[#ff45