"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 定義原始網址
    const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
    
    // 2. 使用 AllOrigins 代理伺服器來繞過 CORS 限制
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('代理伺服器回應異常');
      })
      .then((data) => {
        // 3. 因為經過代理，資料會被包在 data.contents 裡面，且是字串格式
        const blogData = JSON.parse(data.contents);
        const entry = blogData.feed.entry || [];
        
        const formattedPosts = entry.map((item: any) => ({
          title: item.title.$t,
          link: item.link.find((l: any) => l.rel === "alternate").href,
          date: new Date(item.published.$t).toLocaleDateString(),
          // 抓取內容並去除 HTML 標籤作為摘要
          summary: item.content?.$t 
            ? item.content.$t.replace(/<[^>]*>/g, "").substring(0, 100) + "..." 
            : item.summary?.$t.replace(/<[^>]*>/g, "").substring(0, 100) + "..." || ""
        }));
        
        setPosts(formattedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blogger feed error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <BookOpen className="mr-3 text-blue-600" /> 最新文章
          </h1>
          <p className="text-muted-foreground mb-12">掌握最新的 LINE 行銷趨勢與實戰技巧</p>

          {loading ? (
            <div className="text-center py-20 text-gray-400">
              <div className="animate-pulse">正在為您加載精彩內容...</div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-8">
              {posts.map((post, i) => (
                <div key={i} className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.summary}
                  </p>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                  >
                    閱讀全文 <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">目前尚無文章。</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}