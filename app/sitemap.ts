import { MetadataRoute } from "next"
import { client } from "@/lib/sanity"

export const revalidate = 3600
export const dynamic = "force-dynamic"

const siteUrl = "https://www.line88.tw"

// /content/[slug] 這幾頁是服務介紹頁，不是從 Sanity 抓的，是專案裡固定的路由，
// 所以用靜態陣列列出來。之後在 app/content 底下新增頁面時，記得也把 slug 加進來，
// 不然新頁面一樣不會出現在 sitemap 裡，等於藏起來讓搜尋引擎/AI 找不到。
const CONTENT_PAGE_SLUGS = [
  "line-vote-services",
  "facebook-services",
  "google-services",
  "instagram-services",
  "threads-services",
  "line-ai-services",
]

type SanityPost = {
  slug: string
  publishedAt?: string
  updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<SanityPost[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
      "slug": slug.current,
      publishedAt,
      "updatedAt": _updatedAt
    }`,
    {},
    { cache: "no-store" }
  )

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const contentRoutes: MetadataRoute.Sitemap = CONTENT_PAGE_SLUGS.map(
    (slug) => ({
      url: `${siteUrl}/content/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    })
  )

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : post.publishedAt
        ? new Date(post.publishedAt)
        : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...contentRoutes, ...blogRoutes]
}