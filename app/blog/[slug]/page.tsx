import { client } from "@/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { ShareBar } from "@/components/share-bar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const builder = createImageUrlBuilder(client);

function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source);
}

/** 抓第一張圖（OG用） */
function extractFirstImage(html?: string) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1] || null;
}

/** Sanity CDN 圖片優化 */
function optimizeSanityImages(html: string) {
  if (!html) return "";
  return html.replace(
    /(https:\/\/cdn\.sanity\.io\/images\/[^"' )<>]+)/g,
    (url) => {
      if (url.includes("auto=format")) return url;
      return url + (url.includes("?") ? "&" : "?") + "auto=format";
    }
  );
}

/**
 * 去除內容開頭重複的標題與首圖
 */
function stripDuplicateLeadContent(html: string, hasMainImage: boolean) {
  let result = html;
  if (hasMainImage) {
    result = result.replace(/^\s*<img[^>]*>\s*/i, "");
  }
  result = result.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");
  return result;
}

/**
 * 修正 AI 產文漏轉的 Markdown 粗體語法
 */
function convertLeftoverMarkdownBold(html: string) {
  return html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/**
 * 美化 HTML（img / table / th / td）
 */
function beautifyHtml(html: string): string {
  return html
    .replace(
      /<img([^>]*)>/g,
      `<img$1 style="border-radius:1rem;max-width:100%;margin:2rem auto;display:block;box-shadow:0 4px 32px rgba(0,0,0,0.5);" />`
    )
    .replace(
      /<table([^>]*)>/g,
      `<table$1 style="width:100%;border-collapse:collapse;overflow-x:auto;display:block;margin:2rem 0;border-radius:0.75rem;border:1px solid rgba(255,255,255,0.1);">`
    )
    .replace(
      /<th([^>]*)>/g,
      `<th$1 style="background:rgba(255,136,0,0.15);color:#ff8800;padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:900;">`
    )
    .replace(
      /<td([^>]*)>/g,
      `<td$1 style="padding:0.75rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);vertical-align:top;">`
    );
}

/** Next.js App Router 正確型別 */
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, description, mainImage, htmlContent
    }`,
    { slug }
  );

  if (!post) return {};

  const firstImage = extractFirstImage(post?.htmlContent);
  let ogImage: string | null = null;

  try {
    ogImage = post.mainImage
      ? urlFor(post.mainImage)
          ?.width(1200)
          ?.height(630)
          ?.fit("crop")
          ?.auto("format")
          ?.url()
      : firstImage;
  } catch {
    ogImage = firstImage;
  }

  return {
    title: post.title,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      url: `https://www.line88.tw/blog/${slug}`,
      siteName: "網站",
      images: ogImage ? [{ url: ogImage }] : [],
      locale: "zh_TW",
      type: "article",
    },
  };
}

/* ================= PAGE ================= */

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, description, publishedAt, mainImage, htmlContent,
      "authorName": author->name,
      "tags": categories[]->title
    }`,
    { slug },
    { cache: "no-store" }
  );

  if (!post) notFound();

  const rawHtml =
    typeof post.htmlContent === "string"
      ? optimizeSanityImages(post.htmlContent)
      : "";

  const dedupedHtml = stripDuplicateLeadContent(rawHtml, Boolean(post.mainImage));
  const markdownFixedHtml = convertLeftoverMarkdownBold(dedupedHtml);
  const optimizedHtml = beautifyHtml(markdownFixedHtml);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || post.title,
    datePublished: post.publishedAt,
    image: post.mainImage
      ? urlFor(post.mainImage)?.width(1200)?.auto("format")?.url()
      : undefined,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar 已在 layout.tsx 全域掛載，這裡不重複渲染 */}

      <main className="mx-auto max-w-4xl px-6 pb-32 pt-36">
        {/* 標題 */}
        <h1 className="mb-4 text-3xl md:text-5xl font-black text-[#ff8800] leading-tight">
          {post.title}
        </h1>

        {/* 日期 */}
        {post.publishedAt && (
          <p className="mb-8 text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString("zh-TW", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* 主圖 */}
        {post.mainImage && (
          <img
            src={urlFor(post.mainImage)?.auto("format")?.url()}
            alt={post.title}
            className="mb-10 w-full rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
          />
        )}

        {/* 內文 */}
        <article className="prose prose-invert max-w-none">
          <div
            className="
              [&_h2]:!text-[#ff8800] [&_h2]:!font-black [&_h2]:!text-2xl [&_h2]:!mt-10 [&_h2]:!mb-4
              [&_h3]:!text-[#ff8800] [&_h3]:!font-black [&_h3]:!text-xl [&_h3]:!mt-8 [&_h3]:!mb-3
              [&_p]:!text-gray-300 [&_p]:!leading-relaxed
              [&_li]:!text-gray-300
              [&_a]:!text-[#ff8800] [&_a:hover]:!underline
              [&_strong]:!text-white
              [&_code]:!text-[#ff8800] [&_code]:!bg-white/5
              [&_pre]:!bg-white/5 [&_pre]:!border [&_pre]:!border-white/10
              [&_blockquote]:!border-l-[#ff8800] [&_blockquote]:!text-gray-400
              [&_hr]:!border-white/10
              [&_img]:!rounded-2xl [&_img]:!mx-auto [&_img]:!block [&_img]:!max-w-full [&_img]:!my-8 [&_img]:!shadow-[0_4px_32px_rgba(0,0,0,0.5)]
              [&_table]:!w-full [&_table]:!border-collapse [&_table]:!my-8 [&_table]:!rounded-xl [&_table]:!overflow-hidden [&_table]:!border [&_table]:!border-white/10
              [&_th]:!bg-orange-900/20 [&_th]:!text-[#ff8800] [&_th]:!p-4 [&_th]:!border [&_th]:!border-white/10 [&_th]:!font-black [&_th]:!text-left
              [&_td]:!p-4 [&_td]:!border [&_td]:!border-white/10 [&_td]:!text-gray-300 [&_td]:!align-top
            "
            dangerouslySetInnerHTML={{ __html: optimizedHtml }}
          />
        </article>

        <ShareBar />
      </main>

      {/* Footer 已在 layout.tsx 全域掛載，這裡不重複渲染 */}
    </div>
  );
}

/* ================= STATIC PARAMS ================= */

export async function generateStaticParams() {
  const posts = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current }`
  );

  return posts?.map((p: any) => ({ slug: p.slug })) || [];
}