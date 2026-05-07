import { notFound } from "next/navigation";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

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

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;

      return (
        <img
          src={urlFor(value)}
          alt={value.alt || ""}
          className="w-full rounded-lg my-6 border border-[#00ff00]/20"
        />
      );
    },
  },

  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-white mt-8 mb-4">
        {children}
      </h1>
    ),

    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-4">
        {children}
      </h2>
    ),

    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-white mt-6 mb-3">
        {children}
      </h3>
    ),

    normal: ({ children }: any) => (
      <p className="text-gray-300 leading-8 mb-4">
        {children}
      </p>
    ),

    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#00ff00] pl-4 my-4 text-gray-400 italic">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }: any) => (
      <strong className="text-white font-bold">
        {children}
      </strong>
    ),

    em: ({ children }: any) => (
      <em className="text-[#00ff00]">
        {children}
      </em>
    ),

    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00ff00] underline hover:text-white transition-colors"
      >
        {children}
      </a>
    ),
  },
};

async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "author": author->name,
      publishedAt,
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

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 頂部導航 */}
      <div className="border-b border-[#00ff00]/20 px-6 py-4">
        <Link
          href="/blog"
          className="text-[#00ff00] hover:text-white transition-colors text-sm flex items-center gap-2"
        >
          ← 返回文章列表
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* 文章標題 */}
        <div className="mb-10 border-b border-[#00ff00]/20 pb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.author && (
              <span className="text-[#00ff00]">
                ✍ {post.author}
              </span>
            )}

            {publishedDate && (
              <span>{publishedDate}</span>
            )}
          </div>
        </div>

        {/* 文章內容 */}
        <article className="prose prose-invert max-w-none">
          {post.body ? (
            <PortableText
              value={post.body}
              components={components}
            />
          ) : (
            <p className="text-gray-500">
              No content
            </p>
          )}
        </article>

        {/* 底部返回 */}
        <div className="mt-16 pt-8 border-t border-[#00ff00]/20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 text-[#00ff00] px-6 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            ← 返回文章列表
          </Link>
        </div>
      </main>
    </div>
  );
}