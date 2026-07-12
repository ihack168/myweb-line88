import Link from "next/link";
import { Sparkles } from "lucide-react";
import { client } from "@/lib/sanity";
import {
  LatestPostCard,
  type LatestPost,
} from "@/components/latest-post-card";

interface SanityPost {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  mainImage?: string;
  htmlContent?: string;
  videoId?: string;
  tags?: string[];
  publishedAt?: string;
}

function optimizeSanityImageUrl(url?: string) {
  if (!url) {
    return "";
  }

  if (!url.includes("cdn.sanity.io/images")) {
    return url;
  }

  if (url.includes("auto=format")) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}auto=format`;
}

function extractImageFromHtml(htmlContent?: string) {
  if (!htmlContent || typeof htmlContent !== "string") {
    return "";
  }

  const imageMatch = htmlContent.match(
    /<img[^>]+src=["']([^"']+)["']/i
  );

  return imageMatch?.[1]
    ? optimizeSanityImageUrl(imageMatch[1])
    : "";
}

function extractDescriptionFromHtml(htmlContent?: string) {
  if (!htmlContent || typeof htmlContent !== "string") {
    return "";
  }

  const plainText = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return "";
  }

  return `${plainText.slice(0, 90)}${plainText.length > 90 ? "..." : ""}`;
}

async function getLatestPosts(): Promise<LatestPost[]> {
  try {
    const result = await client.fetch<SanityPost[]>(
      `*[
        _type == "post" &&
        defined(slug.current)
      ]
      | order(coalesce(publishedAt, _createdAt) desc)
      [0...6] {
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
      {},
      {
        next: {
          revalidate: 300,
        },
      }
    );

    return result
      .filter((post) => Boolean(post.id && post.slug))
      .map((post) => {
        const extractedImage = extractImageFromHtml(post.htmlContent);

        let description = post.description?.trim() || "";

        if (
          !description ||
          description === "點擊閱讀詳情..."
        ) {
          description = extractDescriptionFromHtml(post.htmlContent);
        }

        if (!description) {
          description = "閱讀完整文章，了解更多相關內容。";
        }

        const youtubeThumbnail = post.videoId
          ? `https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`
          : "";

        return {
          id: post.id as string,
          title: post.title?.trim() || "未命名文章",
          slug: post.slug as string,
          description,
          thumbnail:
            extractedImage ||
            youtubeThumbnail ||
            optimizeSanityImageUrl(post.imageUrl) ||
            optimizeSanityImageUrl(post.mainImage) ||
            "",
          videoId: post.videoId || undefined,
          tags: Array.isArray(post.tags)
            ? post.tags.filter(
                (tag): tag is string =>
                  typeof tag === "string" && Boolean(tag.trim())
              )
            : [],
          publishedAt: post.publishedAt || "",
        };
      });
  } catch (error) {
    console.error("首頁最新文章伺服器端抓取失敗：", error);

    return [];
  }
}

export async function LatestPostsSection() {
  const posts = await getLatestPosts();

  return (
    <section
      className="relative px-5 py-10 md:py-14"
      aria-labelledby="latest-posts-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 text-center md:mb-9 md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8800] md:text-sm">
              <Sparkles size={14} aria-hidden="true" />
              LATEST ARTICLES
            </p>

            <h2
              id="latest-posts-title"
              className="text-3xl font-black italic text-white md:text-4xl"
            >
              <span className="text-[#ff8800]">|</span> 最新文章
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
              分享網路行銷、SEO、AEO、GEO、AI
              工具、社群經營與網站技術文章。
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex justify-center rounded-full border border-[#ff8800]/40 bg-white/5 px-5 py-2.5 text-sm font-bold text-[#ff8800] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#ff8800]/70 hover:bg-[#ff8800] hover:text-black"
          >
            查看全部文章 →
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {posts.map((post) => (
              <LatestPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#ff8800]/30 bg-white/[0.055] px-6 py-10 text-center backdrop-blur-xl">
            <p className="text-xl font-black text-white">
              暫時沒有最新文章
            </p>

            <p className="mt-3 text-sm text-gray-400">
              之後會陸續分享 SEO、AEO、GEO、AI
              與網路行銷相關內容。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}