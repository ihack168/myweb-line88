"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

// --- Sanity 圖片工具 ---
const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  if (!source) return "";
  return builder.image(source).url();
}

// --- 定義類型 ---
interface Post {
  id: string;
  title: string;
  slug: string;
  description: string; 
  thumbnail: string;
  videoId?: string;
  tags: string[];
  publishedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const postsPerPage = 9; 

  useEffect(() => {
    async function fetchSanityPosts() {
      setLoading(true);
      try {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;

        // 1. 抓取文章總數 (確保 _type 匹配)
        const count = await client.fetch(`count(*[_type == "post"])`);
        setTotalPosts(count);

        // 2. 抓取文章內容
        // 使用 coalesce 確保即便沒填 publishedAt 也能透過建立時間排序，不會抓不到資料
        const result = await client.fetch(
          `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) [$start...$end] {
            "id": _id,
            title,
            "slug": slug.current,
            "description": select(
                defined(htmlContent) => "自動化串接文章 - 點擊查看詳情...",
                defined(description) => description,
                "點擊閱讀全文內容..."
            ),
            "thumbnail": mainImage,
            "videoId": youtubeVideoId, 
            "tags": categories[]->title,
            "publishedAt": coalesce(publishedAt, _createdAt)
          }`,
          { start, end }
        );
        
        setPosts(result);
      } catch (err) {
        console.error("Sanity 抓取失敗:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSanityPosts();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h1 className="text-4xl md:text-6xl font-black italic text-[#ff8800] tracking-tighter">
            LATEST ARTICLES
          </h1>
          <p className="text-gray-500 font-mono text-sm">TOTAL_POSTS: {totalPosts}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ff8800]"></div>
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-[#ff8800]/30 transition-all shadow-2xl">
                    
                    {/* 圖片/影片區 */}
                    <div className="relative h-52 w-full bg-black overflow-hidden">
                      {activeVideo === post.id && post.videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
                          className="w-full h-full border-none"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="relative h-full w-full cursor-pointer" onClick={() => post.videoId && setActiveVideo(post.id)}>
                          <img 
                            src={urlFor(post.thumbnail)} 
                            alt={post.title} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                          />
                          {post.videoId && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <div className="border-l-[18px] border-l-white border-y-[11px] border-y-transparent ml-1"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 內容區 */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.tags || []).map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[12px] font-bold bg-[#ff8800]/10 text-[#ff8800] px-2 py-0.5 rounded border border-[#ff8800]/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-[#ff8800] transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                        {post.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-white/5">
                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#ff8800] text-lg font-black group/link">
                          READ ARTICLE <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 text-xl font-bold">
                暫時沒有相關文章。
              </div>
            )}

            {/* 分頁控制 */}
            {totalPages > 1 && (
              <div className="mt-20 flex flex-wrap justify-center items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="mr-2 text-xs font-bold tracking-widest border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 disabled:opacity-10 transition-all text-white"
                >
                  PREV
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-10 h-10 rounded-lg font-mono font-bold transition-all duration-300 border ${
                      page === num 
                        ? "bg-[#ff8800] text-black border-[#ff8800] shadow-[0_0_20px_rgba(255,136,0,0.6)] scale-110" 
                        : "bg-transparent text-gray-400 border-white/10 hover:border-[#ff8800]/50 hover:text-[#ff8800]"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page >= totalPages} 
                  className="ml-2 text-xs font-bold tracking-widest border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 disabled:opacity-10 transition-all text-white"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}