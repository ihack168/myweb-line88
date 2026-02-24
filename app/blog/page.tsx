"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, X } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const targetUrl = "https://www.line88.tw/feeds/posts/default?alt=json&max-results=10";
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
      .then((res) => res.json())
      .then((data) => {
        const blogData = JSON.parse(data.contents);
        const entry = blogData.feed.entry || [];
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.content?.$t || item.summary?.$t || "";
          
          // 💡 僅針對摘要進行「超級清理」，不影響全文
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
            summary: cleanSummary.substring(0, 100) + "...",
            fullContent: rawContent // 💡 這裡保留完整的、包含影片 iframe 的原始碼
          };
        });
        
        setPosts(formattedPosts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 flex items-center text-[#00ff00]">
            <BookOpen className="mr-4 w-10 h-10" /> 最新文章
          </h1>

          {loading ? (
            <div className="text-center py-20 text-gray-500">內容載入中...</div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post: any, i) => (
                <div key={i} className="p-8 bg-[#161616] border border-white/5 rounded-2xl hover:border-[#00ff00]/50 transition-all shadow-xl">
                  <div className="text-sm text-gray-500 mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#00ff00]" /> {post.date}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                  <p className="text-gray-400 mb-6">{post.summary}</p>
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center font-bold text-[#00ff00] hover:underline"
                  >
                    閱讀全文 <ArrowRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 文章內容彈窗 (Modal) */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative shadow-2xl">
            {/* 關閉按鈕 - 改為黑色背景確保看得見 */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="fixed top-8 right-8 p-3 bg-black/80 rounded-full hover:bg-red-600 transition-colors z-[70]"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* 💡 這裡注意：
                因為你的文章 HTML 自帶了許多針對白底的樣式（如 color: #333），
                所以彈窗背景我們改為「白色」，這樣你的文章樣式才會 100% 正確顯示。
            */}
            <div className="p-6 md:p-10 text-black">
              {/* 渲染完整 HTML 內容 (包含 iframe 和 style) */}
              <div 
                className="all-reset-css" // 這裡我們不做 prose 限制，讓 Blogger 樣式完全接管
                dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
              />
              
              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <a 
                  href={selectedPost.link} 
                  target="_blank" 
                  className="text-sm text-gray-400 hover:text-[#00ff00]"
                >
                  前往原本部落格頁面 →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}