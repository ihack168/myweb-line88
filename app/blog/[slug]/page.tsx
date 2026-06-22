import { client } from "@/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const builder = createImageUrlBuilder(client);

function urlFor(source: any) {
  if (!source) return { url: () => "" };
  return builder.image(source);
}

/**
 * 👉 抓 HTML 第一張圖片（用於 OG fallback）
 */
function extractFirstImage(html?: string) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1] || null;
}

/**
 * 👉 你的 HTML 優化
 */
function optimizeSanityImages(html?: string) {
  if (!html) return "";

  return html.replace(
    /(https:\/\/cdn\.sanity\.io\/images\/[^"' )<>]+)/g,
    (url) => {
      if (url.includes("auto=format")) return url;
      if (url.includes("?")) return url + "&auto=format";
      return url + "?auto=format";
    }
  );
}

/**
 * PortableText image renderer
 */
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;

      return (
        <figure className="my-10 flex flex-col items-center">
          <img
            src={urlFor(value).auto("format").url()}
            alt={value.alt || "文章圖片"}
            className="w-full rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm text-gray-500 italic text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      mainImage,
      htmlContent
    }`,
    { slug }
  );

  if (!post) return {};

  // 👉 先抓 body 第一張圖
  const firstBodyImage = extractFirstImage(post.htmlContent);

  // 👉 OG image 邏輯
  const ogImage = post.mainImage
    ? urlFor(post.mainImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : firstBodyImage;

  return {
    title: `${post.title} | 洛克希德黑克斯`,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      url: `https://www.line88.tw/blog/${slug}`,
      siteName: "洛克希德黑克斯",
      images: ogImage ? [{ url: ogImage }] : [],
      locale: "zh_TW",
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      publishedAt,
      mainImage,
      body,
      htmlContent,
      "authorName": author->name,
      "tags": categories[]->title
    }`,
    { slug },
    { cache: "no-store" }
  );

  if (!post) notFound();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const optimizedHtml = optimizeSanityImages(post.htmlContent);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || post.title,
    author: {
      "@type": "Person",
      name: post.authorName || "洛克希德黑克斯",
    },
    publisher: {
      "@type": "Organization",
      name: "洛克希德黑克斯",
      url: "https://www.line88.tw",
    },
    datePublished: post.publishedAt,
    url: `https://www.line88.tw/blog/${slug}`,
    image: post.mainImage
      ? urlFor(post.mainImage).width(1200).auto("format").url()
      : undefined,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-10 font-mono">
          <Link href="/" className="hover:text-[#ff8800] transition-colors">
            首頁
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#ff8800] transition-colors">
            最新文章
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs">
            {post.title}
          </span>
        </nav>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[#ff8800] bg-[#ff8800]/10 border border-[#ff8800]/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight text-[#ff8800]">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-400 mb-12 text-sm border-b border-white/10 pb-8">
          <span className="text-white/20">|</span>
          <span>{publishedDate}</span>
        </div>

        {post.mainImage && (
          <div className="relative w-full mb-16 rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(255,136,0,0.1)]">
            <img
              src={urlFor(post.mainImage).auto("format").url()}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <article
          className="prose prose-invert prose-orange max-w-none prose-lg md:prose-xl"
        >
          {post.htmlContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: optimizedHtml }}
            />
          ) : (
            post.body && (
              <PortableText value={post.body} components={ptComponents} />
            )
          )}
        </article>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#ff8800] px-6 py-3 rounded-xl transition-all text-sm font-black border border-white/10"
          >
            ← 返回文章列表
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-[#ff8800] hover:bg-[#ff8800]/80 text-black px-6 py-3 rounded-xl transition-colors text-sm font-black shadow-[0_0_20px_rgba(255,136,0,0.3)]"
          >
            立即聯絡我們 →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const posts = await client.fetch(query);

  if (!posts) return [];

  return posts.map((post: any) => ({ slug: post.slug }));
}