"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { client } from "@/lib/sanity";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  videoId?: string;
  tags: string[];
  publishedAt: string;
  htmlContent?: string;
}

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTag = searchParams.get("tag") || "全部";

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const postsPerPage = 9;

  useEffect(() => {
    setPage(1);
  }, [selectedTag]);

  useEffect(() => {
    async function fetchSanityPosts() {
      setLoading(true);

      try {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;

        const tagFilter =
          selectedTag !== "全部"
            ? `&& "${selectedTag}" in tags`
            : "";

        const count = await client.fetch(
          `count(*[_type == "post" ${tagFilter}])`,
          {},
          { cache: "no-store" }
        );

        setTotalPosts(count);

        const result = await client.fetch(
          `*[_type == "post" ${tagFilter}] | order(_createdAt desc) [$start...$end] {
            "id": _id,
            title,
            "slug": slug.current,
            "description": description,
            "imageUrl": imageUrl,
            "mainImage": mainImage.asset->url,
            "htmlContent": htmlContent,
            "videoId": youtubeVideoId,
            "tags": tags,
            "publishedAt": coalesce(publishedAt, _createdAt)
          }`,
          { start, end },
          { cache: "no-store" }
        );

        const processedPosts = result.map((post: any) => {
          let extractedImg = "";
          let extractedDesc = post.description || "";

          if (post.htmlContent) {
            const imgMatch = post.htmlContent.match(/<img[^>]+src="([^">]+)"/);

            if (imgMatch && imgMatch[1]) {
              extractedImg = imgMatch[1];
            }

            if (!extractedDesc || extractedDesc === "點擊閱讀詳情...") {
              const pureText = post.htmlContent
                .replace(/<[^>]*>?/gm, "")
                .trim();

              extractedDesc =
                pureText.substring(0, 100) +
                (pureText.length > 100 ? "..." : "");
            }
          }

          if (!extractedDesc) extractedDesc = "點擊閱讀詳情...";

          const youtubeThumb = post.videoId
            ? `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`
            : "";

          return {
            ...post,
            thumbnail:
              extractedImg ||
              youtubeThumb ||
              post.imageUrl ||
              post.mainImage ||
              "",
            description: extractedDesc,
            tags: Array.isArray(post.tags) ? post.tags : [],
          };
        });

        setPosts(processedPosts);
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
  }, [page, selectedTag]);

  const allTags = useMemo(() => {
    const tags = posts.flatMap((post) => post.tags || []);
    return ["全部", ...Array.from(new Set(tags))];
  }, [posts]);

  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;

  const handleTagClick = (tag: string) => {
    setActiveVideo(null);

    if (tag === "全部") {
      router.push("/blog");
      return;
    }

    router.push(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <header>
            <h1 className="text-4xl md:text-6xl font-black italic text-[#ff8800] tracking-tighter">
              最新文章
            </h1>

            <p className="text-gray-400 mt-2 italic">
              {selectedTag === "全部"
                ? "全部文章"
                : `目前分類：${selectedTag}`}
            </p>
          </header>

          <p className="text-gray-500 font-mono text-sm">
            文章數量: {totalPosts}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`text-xs md:text-sm font-bold px-4 py-2 rounded-full border transition-all ${
                selectedTag === tag
                  ? "bg-[#ff8800] text-black border-[#ff8800] shadow-[0_0_20px_rgba(255,136,0,0.35)]"
                  : "bg-white/5 text-gray-300 border-white/10 hover:border-[#ff8800]/50 hover:text-[#ff8800]"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ff8800]"></div>
          </div>
        ) : (
          <>
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-[#ff8800]/30 transition-all shadow-2xl"
                  >
                    <div className="relative h-52 w-full bg-black overflow-hidden">
                      {activeVideo === post.id && post.videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
                          className="w-full h-full border-none"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="relative h-full w-full">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="block w-full h-full cursor-pointer overflow-hidden"
                          >
                            {post.thumbnail ? (
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 italic text-sm">
                                NO IMAGE FOUND
                              </div>
                            )}
                          </Link>

                          {post.videoId && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveVideo(post.id);
                                }}
                                className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer"
                              >
                                <div className="border-l-[18px] border-l-white border-y-[11px] border-y-transparent ml-1"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded border transition-all ${
                              selectedTag === tag
                                ? "bg-[#ff8800] text-black border-[#ff8800]"
                                : "bg-[#ff8800]/10 text-[#ff8800] border-[#ff8800]/20 hover:bg-[#ff8800] hover:text-black"
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-[#ff8800] transition-colors cursor-pointer">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                        {post.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-white/5">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-[#ff8800] text-lg font-black group/link"
                        >
                          點擊閱讀內容{" "}
                          <span className="group-hover/link:translate-x-2 transition-transform">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 border border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-500 text-xl font-bold mb-2">
                  暫時沒有相關文章。
                </p>

                {selectedTag !== "全部" && (
                  <button
                    onClick={() => handleTagClick("全部")}
                    className="mt-4 px-6 py-3 rounded-xl bg-[#ff8800] text-black font-black"
                  >
                    查看全部文章
                  </button>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-20 flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="mr-2 text-xs font-bold tracking-widest border border-white/20 px-6 py-3 rounded-xl hover:bg-white/5 disabled:opacity-10 transition-all text-white uppercase"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-12 h-12 rounded-xl font-mono font-bold transition-all duration-300 border ${
                        page === num
                          ? "bg-[#ff8800] text-black border-[#ff8800] shadow-[0_0_20px_rgba(255,136,0,0.4)] scale-110"
                          : "bg-transparent text-gray-400 border-white/10 hover:border-[#ff8800]/50 hover:text-[#ff8800]"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="ml-2 text-xs font-bold tracking-widest border border-white/20 px-6 py-3 rounded-xl hover:bg-white/5 disabled:opacity-10 transition-all text-white uppercase"
                >
                  Next
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

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ff8800]"></div>
        </div>
      }
    >
      <BlogPageContent />
    </Suspense>
  );
}