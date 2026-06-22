import { client } from "@/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShareBar } from "@/components/share-bar";
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
 * 👉 抓 HTML 第一張圖（OG fallback）
 */
function extractFirstImage(html?: string) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1] || null;
}

/**
 * 👉 optimize images
 */
function optimizeSanityImages(html?: string) {
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
            className="w-full rounded-2xl border border-white/10"
            loading="lazy"
          />
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

  const firstImage = extractFirstImage(post.htmlContent);

  const ogImage = post.mainImage
    ? urlFor(post.mainImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : firstImage;

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
          <Link href="/">首頁</Link>
          <span>/</span>
          <Link href="/blog">最新文章</Link>
        </nav>

        <h1 className="text-4xl md:text-6xl font-black mb-6 text-[#ff8800]">
          {post.title}
        </h1>

        <div className="text-gray-400 mb-10 text-sm">
          {publishedDate}
        </div>

        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).auto("format").url()}
            className="w-full mb-10 rounded-2xl"
          />
        )}

        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: optimizedHtml }}
        />
      </main>

      {/* 🔥 SHARE BAR（你已做好的） */}
      <ShareBar />

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current }`
  );

  return posts?.map((p: any) => ({ slug: p.slug })) || [];
}