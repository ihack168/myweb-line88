import { client } from "@/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
 * ⚠️ 重點修正：
 * 不再包 div（dangerouslySetInnerHTML 不能破壞 DOM 結構）
 * 改成「只加 class / inline style」
 */
function beautifyHtml(html: string): string {
  return html
    // img
    .replace(
      /<img([^>]*)>/g,
      `<img$1 style="border-radius:1rem;max-width:100%;margin:2rem auto;display:block;box-shadow:0 4px 32px rgba(0,0,0,0.5);" />`
    )

    // table（只加 style，不包 div）
    .replace(
      /<table([^>]*)>/g,
      `<table$1 style="width:100%;border-collapse:collapse;overflow-x:auto;display:block;margin:2rem 0;border-radius:0.75rem;border:1px solid rgba(255,255,255,0.1);">`
    )

    // th
    .replace(
      /<th([^>]*)>/g,
      `<th$1 style="background:rgba(255,136,0,0.15);color:#ff8800;padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:900;">`
    )

    // td
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

  const optimizedHtml = beautifyHtml(rawHtml);

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

      <Navbar />

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

        {/* 內容 */}
        <article
          className="
            prose prose-invert max-w-none
            prose-headings:text-[#ff8800] prose-headings:font-black
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-[#ff8800] hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-[#ff8800] prose-code:bg-white/5
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
            prose-blockquote:border-l-[#ff8800] prose-blockquote:text-gray-400
            prose-li:text-gray-300
            prose-hr:border-white/10
          "
          dangerouslySetInnerHTML={{ __html: optimizedHtml }}
        />

        <ShareBar />
      </main>

      <Footer />
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