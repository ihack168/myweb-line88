import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.line88.tw'

  // 1. 定義固定頁面
  const routes = [
    '',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. 嘗試抓取最新的文章列表，讓 Google 能爬到你的分頁內容
  // 注意：這裡直接抓取你的 blog API 資訊
  let postRoutes: any[] = []
  try {
    const res = await fetch(`${baseUrl}/api/blog?page=1`, { next: { revalidate: 3600 } })
    const data = await res.json()
    
    // 這裡我們只產生分頁網址 (例如 page=1~10)，因為你的內頁目前是連回外部的 blog.line88.tw
    const totalPages = data.pagination?.totalPages || 1
    postRoutes = Array.from({ length: totalPages }, (_, i) => ({
      url: `${baseUrl}/blog?page=${i + 1}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Sitemap fetch error:', error)
  }

  return [...routes, ...postRoutes]
}