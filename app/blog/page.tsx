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
          // 抓取原始內容
          let rawContent = item.summary?.$t || item.content?.$t || "";

          // 進階清理邏輯：過濾 CSS, JSON-LD, Script 與 HTML 標籤
          let cleanSummary = rawContent
            .replace(/<style([\s\S]*?)<\/style>/gi, "") // 移除內嵌 CSS
            .replace(/<script([\s\S]*?)<\/script>/gi, "") // 移除內嵌 JS
            .replace(/\{[\s\S]*?\}/g, "") // 移除 JSON 結構資料 { ... }
            .replace(/<[^>]*>/g, "") // 移除所有 HTML 標籤
            .replace(/&nbsp;/g, " ") // 修正空格
            .replace(/\s+/g, " ") // 合併多餘空白
            .trim();

          // 截取前 100 字作為摘要
          const finalSummary = cleanSummary.length > 100 
            ? cleanSummary.substring(0, 100) + "..." 
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
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* 標題區塊 */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center text-white">
              <BookOpen className="mr-4 text-primary w-10 h-10" /> 最新文章
            </h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
            <p className="text-gray-400 text-lg">掌握最新的 LINE 行銷趨勢、AI 客服與自動化實戰技巧。</p>
          </div>

          {/* 內容區塊 */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 animate-pulse">正在從伺服器安全抓取內容...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-10">
              {posts.map((post, i) => (
                <div 
                  key={i} 
                  className="group relative p-8 bg-[#161616] border border-white/10 rounded-3xl shadow-2xl hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center text-sm