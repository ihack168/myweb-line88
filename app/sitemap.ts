import type { MetadataRoute } from "next"
import { client } from "@/lib/sanity"

export const revalidate = 3600

const SITE_URL = "https://www.line88.tw"

const CONTENT_PAGE_SLUGS = [
  "line-vote-services",
  "facebook-services",
  // 確認有 page.tsx 後再加入
  // "google-services",
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
    `*[
      _type == "post" &&
      defined(slug.current)
    ] | order(coalesce(publishedAt, _createdAt) desc) {
      "slug": slug.current,
      publishedAt,
      "updatedAt": _updatedAt
    }`,
    {},
    {
      next: {
        revalidate: 3600,
      },
    }
  )

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const contentRoutes: MetadataRoute.Sitemap =
    CONTENT_PAGE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/content/${slug}`,
      changeFrequency: "monthly",
      priority: 0.9,
    }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const modifiedDate = post.updatedAt || post.publishedAt

    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(modifiedDate
        ? {
            lastModified: new Date(modifiedDate),
          }
        : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    }
  })

  return [
    ...staticRoutes,
    ...contentRoutes,
    ...blogRoutes,
  ]
}