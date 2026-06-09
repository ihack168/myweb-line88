"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { client } from "@/lib/sanity"
import { Sparkles } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  videoId?: string
  tags: string[]
  publishedAt: string
  htmlContent?: string
}

const ORANGE = "#ff7a00"

function optimizeSanityImageUrl(url?: string) {
  if (!url) return ""

  if (!url.includes("cdn.sanity.io/images")) return url

  if (url.includes("auto=format")) return url

  return `${url}${url.includes("?") ? "&" : "?"}auto=format`
}

export function LatestPostsSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLatestPosts() {
      setLoadingPosts(true)

      try {
        const result = await client.fetch(
          `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) [0...6] {
            "id": _id,
            title,
            "slug": slug.current,
            description,
            "imageUrl": imageUrl,
            "mainImage": mainImage.asset->url,
            htmlContent,
            "videoId": youtubeVideoId,
            "tags": tags,
            "publishedAt": coalesce(publishedAt, _createdAt)
          }`,
          {},
          { cache: "no-store" }
        )

        const processedPosts = result.map((post: any) => {
          let extractedImg = ""
          let extractedDesc = post.description || ""

          if (post.htmlContent) {
            const imgMatch = post.htmlContent.match(
              /<img[^>]+src="([^">]+)"/
            )

            if (imgMatch && imgMatch[1]) {
              extractedImg = optimizeSanityImageUrl(imgMatch[1])
            }

            if (!extractedDesc || extractedDesc === "點擊閱讀詳情...") {
              const pureText = post.htmlContent
                .replace(/<[^>]*>?/gm, "")
                .replace(/\s+/g, " ")
                .trim()

              extractedDesc =
                pureText.substring(0, 100) +
                (pureText.length > 100 ? "..." : "")
            }
          }

          if (!extractedDesc) {
            extractedDesc = "點擊閱讀詳情..."
          }

          const youtubeThumb = post.videoId
            ? `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`
            : ""

          return {
            id: post.id,
            title: post.title || "未命名文章",
            slug: post.slug,
            description: extractedDesc,
            thumbnail:
              extractedImg ||
              youtubeThumb ||
              optimizeSanityImageUrl(post.imageUrl) ||
              optimizeSanityImageUrl(post.mainImage) ||
              "",
            videoId: post.videoId,
            tags: Array.isArray(post.tags) ? post.tags : [],
            publishedAt: post.publishedAt,
            htmlContent: post.htmlContent,
          }
        })

        setPosts(processedPosts)
      } catch (err) {
        console.error("首頁最新文章抓取失敗:", err)
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchLatestPosts()
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-6 py-16">
      <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ff7a00]/15 blur-[120px]" />
      <div className="absolute -right-24 bottom-10 h-[260px] w-[260px] rounded-full bg-[#ff7a00]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff7a00]/40 bg-white/5 px-4 py-2 text-[11px] font-bold tracking-[0.2em] text-[#ff7a00] shadow-sm backdrop-blur md:mx-0">
              <Sparkles size={14} />
              LATEST ARTICLES
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              最新文章
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
              分享網路行銷、SEO、AEO、AI 工具、社群經營與網站技術相關文章。
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex justify-center rounded-full border border-[#ff7a00]/40 bg-white/5 px-7 py-3 text-sm font-bold text-[#ff7a00] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff7a00]/70 hover:bg-[#ff7a00] hover:text-black"
          >
            查看全部文章 →
          </Link>
        </div>

        {loadingPosts ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#ff7a00]/20 border-t-[#ff7a00]" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_12px_40px_rgba(255,122,0,0.08)] backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-[#ff7a00]/50 hover:bg-white/[0.06] hover:shadow-[0_24px_70px_rgba(255,122,0,0.16)]"
              >
                <div className="relative h-[200px] w-full overflow-hidden bg-black md:h-[220px]">
                  {activeVideo === post.id && post.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1`}
                      className="h-full w-full border-none"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block h-full w-full overflow-hidden"
                      >
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="h-full w-full object-contain transition-all duration-700 group-hover:scale-105 md:object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">
                            暫無圖片
                          </div>
                        )}
                      </Link>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />

                      {post.videoId && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setActiveVideo(post.id)
                            }}
                            className="pointer-events-auto flex h-12 w-16 cursor-pointer items-center justify-center rounded-2xl bg-white/90 shadow-xl backdrop-blur transition-transform duration-300 group-hover:scale-110"
                          >
                            <div className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-[#ff7a00]" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex min-h-[270px] flex-col p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="rounded-full border border-[#ff7a00]/30 bg-[#ff7a00]/10 px-3 py-1 text-xs font-bold text-[#ff7a00] transition-all hover:bg-[#ff7a00] hover:text-black"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="line-clamp-2 text-xl font-black leading-snug text-white transition-colors group-hover:text-[#ff7a00]">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/60">
                    {post.description}
                  </p>

                  <div className="mt-auto pt-6">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-bold text-[#ff7a00]"
                    >
                      閱讀文章
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-[#ff7a00]/30 bg-white/[0.03] px-6 py-16 text-center shadow-[0_18px_50px_rgba(255,122,0,0.08)] backdrop-blur">
            <p className="text-xl font-black text-white">
              暫時沒有最新文章
            </p>

            <p className="mt-3 text-sm text-white/50">
              之後會陸續分享 SEO、AEO、AI 與網路行銷相關內容。
            </p>
          </div>
        )}
      </div>
    </section>
  )
}