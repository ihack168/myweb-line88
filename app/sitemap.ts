import { MetadataRoute } from "next"
import { client } from "@/lib/sanity"

export const revalidate = 0
export const dynamic = "force-dynamic"

const siteUrl = "https://www.line88.tw"

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
  ]

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

  return [...staticRoutes, ...blogRoutes]
}