import { client } from "@/lib/sanity"; 
import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 0; 
export const dynamic = 'force-dynamic';

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  if (!source) return { url: () => "" };
  return builder.image(source);
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-10 flex flex-col items-center">
          <img
            src={urlFor(value).url()}
            alt={value.alt || "文章圖片"}
            className="w-full rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm text-gray-500 italic text-center">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ title, description, "mainImage": mainImage.asset->url }`,
    { slug }
  );
  if (!post) return {};
  return {
    title: `${post.title} | 洛克希德黑克斯`,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      url: `https://www.line88.tw/blog/${slug}`,
      siteName: "洛克希德黑克斯",
      images: post.mainImage ? [{ url: post.mainImage }] : [],
      locale: "zh_TW",
      type: "article",
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

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
    { cache: 'no-store' } 
  );

  if (!post) notFound();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

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
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">

        {/* 麵包屑 */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-10 font-mono">
          <Link href="/" className="hover:text-[#ff8800] transition-colors">首頁</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#ff8800] transition-colors">最新文章</Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* 標籤 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-[#ff8800] bg-[#ff8800]/10 border border-[#ff8800]/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 標題 */}
        <h1 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight text-[#ff8800]">
          {post.title}
        </h1>

        {/* 作者與日期 */}
        <div className="flex items-center gap-4 text-gray-400 mb-12 text-sm border-b border-white/10 pb-8">
          <span className="font-bold text-gray-200">✍ {post.authorName || "Lockhead Hex Admin"}</span>
          <span className="text-white/20">|</span>
          <span>{publishedDate}</span>
        </div>

        {/* 主圖 */}
        {post.mainImage && (
          <div className="relative w-full mb-16 rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(255,136,0,0.1)]">
            <img
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* 內容 */}
        <article className="
          prose prose-invert prose-orange max-w-none
          prose-lg md:prose-xl
          prose-p:text-gray-300 prose-p:leading-[1.9] prose-p:mb-4
          prose-headings:text-[#ff8800] prose-headings:font-black prose-headings:italic
          prose-h2:text-3xl prose-h2:border-l-8 prose-h2:border-[#ff8800] prose-h2:pl-6 prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-8
          prose-strong:text-[#ff8800] prose-strong:font-bold
          prose-ul:bg-white/5 prose-ul:p-8 prose-ul:rounded-2xl prose-ul:border prose-ul:border-white/10
          prose-li:marker:text-[#ff8800] prose-li:text-gray-300
          prose-table:border-collapse prose-table:my-10 prose-table:block prose-table:overflow-x-auto
          prose-thead:bg-[#ff8800]/20 prose-th:text-[#ff8800] prose-th:p-4 prose-th:border prose-th:border-white/10
          prose-td:p-4 prose-td:border prose-td:border-white/10 prose-td:text-gray-300
          prose-img:rounded-2xl prose-img:border prose-img:border-white/10
          prose-blockquote:border-l-[#ff8800] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
        ">
          {post.htmlContent ? (
            <div
              className="
                [&_tr]:!bg-transparent
                [&_th]:!bg-[#ff8800]/20
                [&_table]:!w-full
                [&_td]:!border
                [&_td]:!border-white/20
                [&_th]:!border
                [&_th]:!border-white/20
                [&_table]:!border-collapse
                [&_table]:!border
                [&_table]:!border-white/20
                [&_img]:rounded-2xl
                [&_img]:border
                [&_img]:border-white/10
                [&_img]:shadow-lg
                [&_img]:my-8
                [&_img]:mx-auto
                [&_img]:block
                [&_p]:mb-4
                [&_p]:leading-[1.9]
                [&_p]:text-gray-300
                [&_h2]:text-3xl
                [&_h2]:font-black
                [&_h2]:italic
                [&_h2]:text-[#ff8800]
                [&_h2]:border-l-8
                [&_h2]:border-[#ff8800]
                [&_h2]:pl-6
                [&_h2]:mt-12
                [&_h2]:mb-6
                [&_li]:text-gray-300
                [&_li]:mb-1
              "
              dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            />
          ) : (
            post.body && <PortableText value={post.body} components={ptComponents} />
          )}
        </article>

        {/* 底部按鈕 */}
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