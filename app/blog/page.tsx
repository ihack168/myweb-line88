import { cache } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity";
import Link from "next/link";
import type { Metadata } from "next";
import { PostThumbnail } from "@/components/post-thumbnail";

export const runtime = "nodejs";
// searchParams keeps this page dynamic; the data and processed cards are cached.

const POSTS_PER_PAGE = 15;

// 文章快 200 篇了，首頁上方 tag 不要太多。
// 1 個「全部」+ 熱門前 12 個 tag，對 SEO / AEO / GEO 比較乾淨。
const TOP_TAG_LIMIT = 12;

const siteUrl = "https://www.line88.tw";

interface RawPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  mainImage?: string;
  htmlContent?: string;
  videoId?: string;
  tags: string[];
  publishedAt: string;
}

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

interface TagItem {
  name: string;
  count: number;
}

function optimizeSanityImageUrl(url?: string) {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io/images")) return url;
  if (url.includes("auto=format")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}auto=format`;
}

function processPost(post: RawPost): Post {
  let extractedImg = "";
  let extractedDesc = post.description || "";

  if (post.htmlContent) {
    const imgMatch = post.htmlContent.match(/<img[^>]+src="([^">]+)"/);

    if (imgMatch && imgMatch[1]) {
      extractedImg = optimizeSanityImageUrl(imgMatch[1]);
    }

    if (!extractedDesc || extractedDesc === "點擊閱讀詳情...") {
      const pureText = post.htmlContent.replace(/<[^>]*>?/gm, "").trim();
      extractedDesc =
        pureText.substring(0, 100) + (pureText.length > 100 ? "..." : "");
    }
  }

  if (!extractedDesc) extractedDesc = "點擊閱讀詳情...";

  const youtubeThumb = post.videoId
    ? `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`
    : "";

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    videoId: post.videoId,
    publishedAt: post.publishedAt,
    thumbnail:
      extractedImg ||
      youtubeThumb ||
      optimizeSanityImageUrl(post.imageUrl) ||
      optimizeSanityImageUrl(post.mainImage) ||
      "",
    description: extractedDesc,
    tags: cleanTags(post.tags),
  };
}

function buildBlogUrl(tag: string, page: number) {
  const params = new URLSearchParams();
  if (tag !== "全部") params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

type BlogSearchParams = {
  tag?: string | string[];
  page?: string | string[];
};

function cleanTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  // Keep the original tag spelling so the GROQ filter matches it exactly.
  return [...new Set(tags.filter(
    (tag): tag is string => typeof tag === "string" && tag.trim().length > 0
  ))];
}

// One shared catalog: count tags only when this cache is refreshed.
const getTagCatalog = cache(unstable_cache(
  async (): Promise<TagItem[]> => {
    const rows = await client.fetch<{ tags?: string[] }[]>(
      `*[_type == "post" && defined(slug.current) && slug.current != ""]{tags}`,
      {},
      // The outer unstable_cache stores the processed result for one hour.
      { cache: "no-store" }
    );
    const counts = new Map<string, number>();
    for (const row of rows) {
      for (const tag of cleanTags(row.tags)) {
        if (tag !== "全部") counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    const tags = Array.from(counts, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return [{ name: "全部", count: rows.length }, ...tags];
  },
  ["line88-blog-tag-catalog-v1"],
  { revalidate: 3600 }
));

// Only validated tag/page combinations reach this cache.
// Store compact cards, not article HTML, and process HTML only on cache refresh.
const getPostCards = unstable_cache(
  async (selectedTag: string, page: number): Promise<Post[]> => {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const rows = await client.fetch<RawPost[]>(
      `*[_type == "post" && defined(slug.current) && slug.current != ""
        && ($selectedTag == "全部" || $selectedTag in tags)]
      | order(coalesce(publishedAt, _createdAt) desc, _id asc) [$start...$end] {
        "id": _id,
        title,
        "slug": slug.current,
        description,
        imageUrl,
        "mainImage": mainImage.asset->url,
        htmlContent,
        "videoId": youtubeVideoId,
        tags,
        "publishedAt": coalesce(publishedAt, _createdAt)
      }`,
      { selectedTag, start, end },
      { cache: "no-store" }
    );
    return rows.map(processPost);
  },
  ["line88-blog-post-cards-v1"],
  { revalidate: 3600 }
);

function parseSelection(params: BlogSearchParams) {
  if (Array.isArray(params.tag) || Array.isArray(params.page)) notFound();
  const selectedTag = params.tag || "全部";
  const pageText = params.page || "1";
  if (!/^[0-9]+$/.test(pageText)) notFound();
  const page = Number(pageText);
  if (!Number.isSafeInteger(page) || page < 1) notFound();
  return { selectedTag, page };
}

function validateSelection(
  selectedTag: string,
  page: number,
  allTags: TagItem[]
) {
  const selected = allTags.find((tag) => tag.name === selectedTag);
  if (!selected) notFound();
  const totalPosts = selected.count;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  if (page > totalPages) notFound();
  return { totalPosts, totalPages };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}): Promise<Metadata> {
  const { selectedTag, page } = parseSelection(await searchParams);
  const allTags = await getTagCatalog();
  validateSelection(selectedTag, page, allTags);

  const title =
    selectedTag === "全部"
      ? "最新文章｜洛克希德黑克斯"
      : `${selectedTag} 相關文章｜洛克希德黑克斯`;

  const description =
    selectedTag === "全部"
      ? "洛克希德黑克斯最新文章，分享網路投票、社群流量、AEO、GEO、SEO 與 AI 數位行銷相關知識。"
      : `洛克希德黑克斯「${selectedTag}」主題文章整理，分享網路投票、社群流量、AEO、GEO、SEO 與 AI 數位行銷相關知識。`;

  const url = `${siteUrl}${buildBlogUrl(selectedTag, page)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "洛克希德黑克斯",
      locale: "zh_TW",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}) {
  const { selectedTag, page } = parseSelection(await searchParams);
  const allTags = await getTagCatalog();
  const { totalPosts, totalPages } = validateSelection(selectedTag, page, allTags);
  const posts = await getPostCards(selectedTag, page);

  const topTags = allTags.filter((t) => t.name !== "全部").slice(0, TOP_TAG_LIMIT);

  const selectedTagItem =
    selectedTag !== "全部" && !topTags.some((t) => t.name === selectedTag)
      ? allTags.find((t) => t.name === selectedTag)
      : null;

  const visibleTags: TagItem[] = [
    ...allTags.filter((t) => t.name === "全部"),
    ...topTags,
    ...(selectedTagItem ? [selectedTagItem] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <header>
            <h1 className="text-4xl md:text-6xl font-black italic text-[#ff8800] tracking-tighter">
              最新文章
            </h1>

            <p className="text-gray-400 mt-2 italic">
              {selectedTag === "全部" ? "全部文章" : `目前分類：${selectedTag}`}
            </p>
          </header>

          <p className="text-gray-500 font-mono text-sm">
            文章數量: {totalPosts}
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {visibleTags.map((tagItem) => (
              <Link
                key={tagItem.name}
                href={buildBlogUrl(tagItem.name, 1)}
                className={`text-xs md:text-sm font-bold px-4 py-2 rounded-full border transition-all ${
                  selectedTag === tagItem.name
                    ? "bg-[#ff8800] text-black border-[#ff8800] shadow-[0_0_20px_rgba(255,136,0,0.35)]"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-[#ff8800]/50 hover:text-[#ff8800]"
                }`}
              >
                #{tagItem.name}
                <span
                  className={`ml-1 text-[10px] ${
                    selectedTag === tagItem.name ? "text-black/60" : "text-gray-500"
                  }`}
                >
                  {tagItem.count}
                </span>
              </Link>
            ))}
          </div>

          {allTags.length > TOP_TAG_LIMIT + 1 && (
            <p className="mt-4 text-xs text-gray-600">
              已依全站文章標籤數量排序，顯示熱門前 {TOP_TAG_LIMIT} 個主題。
            </p>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-[#ff8800]/30 transition-all shadow-2xl"
              >
                <PostThumbnail
                  slug={post.slug}
                  title={post.title}
                  thumbnail={post.thumbnail}
                  videoId={post.videoId}
                />

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((t) => (
                      <Link
                        key={t}
                        href={buildBlogUrl(t, 1)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border transition-all ${
                          selectedTag === t
                            ? "bg-[#ff8800] text-black border-[#ff8800]"
                            : "bg-[#ff8800]/10 text-[#ff8800] border-[#ff8800]/20 hover:bg-[#ff8800] hover:text-black"
                        }`}
                      >
                        #{t}
                      </Link>
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
              <Link
                href="/blog"
                className="mt-4 inline-block px-6 py-3 rounded-xl bg-[#ff8800] text-black font-black"
              >
                查看全部文章
              </Link>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-20 flex flex-wrap justify-center items-center gap-2">
            <Link
              href={buildBlogUrl(selectedTag, Math.max(1, page - 1))}
              aria-disabled={page === 1}
              className={`mr-2 text-xs font-bold tracking-widest border border-white/20 px-6 py-3 rounded-xl hover:bg-white/5 transition-all text-white uppercase ${
                page === 1 ? "pointer-events-none opacity-10" : ""
              }`}
            >
              Prev
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Link
                key={num}
                href={buildBlogUrl(selectedTag, num)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-mono font-bold transition-all duration-300 border ${
                  page === num
                    ? "bg-[#ff8800] text-black border-[#ff8800] shadow-[0_0_20px_rgba(255,136,0,0.4)] scale-110"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-[#ff8800]/50 hover:text-[#ff8800]"
                }`}
              >
                {num}
              </Link>
            ))}

            <Link
              href={buildBlogUrl(selectedTag, Math.min(totalPages, page + 1))}
              aria-disabled={page >= totalPages}
              className={`ml-2 text-xs font-bold tracking-widest border border-white/20 px-6 py-3 rounded-xl hover:bg-white/5 transition-all text-white uppercase ${
                page >= totalPages ? "pointer-events-none opacity-10" : ""
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}