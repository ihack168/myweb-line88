import { notFound } from "next/navigation";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import type { Metadata } from "next";

const client = createClient({
  projectId: "t0di9pwy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source).url();
}

async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      "author": author->name,
      publishedAt,
      "tags": categories[]->title,
      "mainImage": mainImage.asset->url,
      body[]{
        ...,
        _type == "image" => {
          ...,
          asset->
        }
      }
    }
  `;
  return client.fetch(query, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
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

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <img
            src={urlFor(value)}
            alt={value.alt || ""}
            className="w-full rounded-2xl border border-white/10 shadow-lg mx-auto block"
          />
          {value.caption && (
            <figcaption className="text-center text-gray-500 text-sm mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-black italic text-[#ff8800] border-l-8 border-[#ff8800] pl-6 mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-black italic text-[#ff8800] mt-8 mb-4">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-300 leading-8 mb-6 text-lg">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#ff8800] bg-white/5 py-2 px-6 rounded-r-xl italic my-6 text-gray-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-6 space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-6 space-y-2 list-decimal list-inside">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-gray-300 flex items-start gap-2">
        <span className="text-[#ff8800] mt-1">▸</span>
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="text-[#ff8800] font-bold">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="text-gray-200 italic">{children}</em>
    ),
    link: ({ value, children }: any) => (
      
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#ff8800] underline hover:text-white transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

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
      name: post.author || "洛克希德黑克斯",
    },
    publisher: {
      "@type": "Organization",
      name: "洛克希德黑克斯",
      url: "https://www.line88.tw",
    },
    datePublished: post.publishedAt,
    url: `https://www.line88.tw/blog/${slug}`,
    ...(post.mainImage && { image: post.mainImage }),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10 font-mono">
          <Link href="/" className="hover:text-[#ff8800] transition-colors">首頁</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#ff8800] transition-colors">最新文章</Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs font-bold bg-[#ff8800]/10 text-[#ff8800] px-3 py-1 rounded border border-[#ff8800]/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-black italic leading-tight text-[#ff8800] mb-8">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-400 mb-12 text-sm">
          {post.author && (
            <span className="font-bold text-gray-200">By {post.author}</span>
          )}
          {post.author && publishedDate && (
            <span className="text-white/20">|</span>
          )}
          {publishedDate && <span>{publishedDate}</span>}
        </div>

        {post.mainImage && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={post.mainImage}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <article>
          {post.body ? (
            <PortableText value={post.body} components={components} />
          ) : (
            <p className="text-gray-500">No content</p>
          )}
        </article>

        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#ff8800]/10 hover:bg-[#ff8800]/20 text-[#ff8800] px-6 py-3 rounded-xl transition-colors text-sm font-black border border-[#ff8800]/20"
          >
            ← 返回文章列表
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-[#ff8800] hover:bg-[#ff8800]/80 text-black px-6 py-3 rounded-xl transition-colors text-sm font-black"
          >
            聯絡我們 →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}