"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 抓取 Blogger 的 JSON feed，設定為 10 篇文章
    fetch("https://www.line88.tw/feeds/posts/default?alt=json&max-results=10")
      .then((res) => res.json())
      .then((data) => {
        const entry = data.feed.entry || [];
        const formattedPosts = entry.map((item: any) => ({
          title: item.title.$t,
          link: item.link.find((l: any) => l.rel === "alternate").href,
          date: new Date(item.published.$t).toLocaleDateString(),
          summary: item.content?.$t.replace(/<[^>]*>/g, "").substring(0, 100) + "..." || ""
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
            <div className="text-center py-20 text-gray-400">正在為您加載精彩內容...</div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post, i) => (
                <div key={i} className="group p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all">
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
                    className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                  >
                    閱讀全文 <ArrowRight className="w-4 h-4 ml-1" />
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
