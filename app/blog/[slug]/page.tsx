import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShareBar } from "@/components/share-bar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  if (!source) return { url: () => "" };
  return builder.image(source);
}

function extractFirstImage(html?: unknown) {
  if (typeof html !== "string") return null;

  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1] || null;
}

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

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* ---------------- Metadata ---------------- */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

  let ogImage: string | null = null;

  try {
    ogImage = post.mainImage
      ? urlFor(post.mainImage)
          .width(1200)
          .height(630)
          .fit("crop")
          .auto("format")
          .url()
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

/* ---------------- Page ---------------- */

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      publishedAt,
      mainImage,
      body,
      htmlContent,
      "authorName": author->name,
      "tags": categories[]->title
    }`,
    { slug },
    {
      cache: "no-store",
    }
  );

  if (!post) {
    notFound();
  }

  const optimizedHtml =
    typeof post.htmlContent === "string"
      ? optimizeSanityImages(post.htmlContent)
      : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || post.title,
    datePublished: post.publishedAt,
    image: post.mainImage
      ? urlFor(post.mainImage).width(1200).auto("format").url()
      : undefined,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pb-20 pt-36">
        <h1 className="mb-6 text-4xl font-black text-[#ff8800]">
          {post.title}
        </h1>

        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).auto("format").url()}
            alt={post.title}
            className="mb-10 w-full rounded-2xl"
          />
        )}

        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: optimizedHtml,
          }}
        />
      </main>

      <ShareBar />
      <Footer />
    </div>
  );
}

/* ---------------- Static Params ---------------- */

export async function generateStaticParams() {
  const posts = await client.fetch(
    `*[_type == "post"]{
      "slug": slug.current
    }`
  );

  return (
    posts?.map((p: any) => ({
      slug: p.slug,
    })) || []
  );
}