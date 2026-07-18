import { client } from "@/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { ShareBar } from "@/components/share-bar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.line88.tw";
const AUTHOR_NAME = "Lockhead Hex";

const builder = createImageUrlBuilder(client);

function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source);
}

/** 抓第一張圖（OG 用） */
function extractFirstImage(html?: string) {
  if (!html) return null;

  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);

  return match?.[1] || null;
}

/** Sanity CDN 圖片優化 */
function optimizeSanityImages(html: string) {
  if (!html) return "";

  return html.replace(
    /(https:\/\/cdn\.sanity\.io\/images\/[^"' )<>]+)/g,
    (url) => {
      if (url.includes("auto=format")) return url;

      return `${url}${url.includes("?") ? "&" : "?"}auto=format`;
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
      `<img$1 style="border-radius:1rem;max-width:100%;height:auto;margin:2rem auto;display:block;box-shadow:0 4px 32px rgba(0,0,0,0.5);" />`
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


/** HTML 屬性安全轉義 */
function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** 將空間圖片插入指定 H2 標題後方 */
function insertImageAfterHeading(
  html: string,
  headingText: string,
  imageUrl?: string,
  alt?: string
) {
  if (!html || !imageUrl) return html;

  const escapedHeading = headingText.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const headingRegex = new RegExp(
    `(<h2\\b[^>]*>\\s*${escapedHeading}\\s*<\\/h2>)`,
    "i"
  );

  if (!headingRegex.test(html)) {
    return html;
  }

  const safeUrl = escapeHtmlAttribute(imageUrl);
  const safeAlt = escapeHtmlAttribute(alt || headingText);

  return html.replace(
    headingRegex,
    `$1
<figure class="article-space-image">
  <img
    src="${safeUrl}"
    alt="${safeAlt}"
    loading="lazy"
    decoding="async"
  />
</figure>`
  );
}

/** 格式化日期 */
function formatDate(date?: string) {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  });
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
      title,
      description,
      publishedAt,
      _updatedAt,
      mainImage,
      htmlContent
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

    alternates: {
      canonical: `/blog/${slug}`,
    },

    authors: [
      {
        name: AUTHOR_NAME,
        url: `${SITE_URL}/about`,
      },
    ],

    openGraph: {
      title: post.title,
      description: post.description || post.title,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "洛克希德黑克斯",
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: post.title,
            },
          ]
        : [],
      locale: "zh_TW",
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post._updatedAt || post.publishedAt || undefined,
      authors: [`${SITE_URL}/about`],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.title,
      images: ogImage ? [ogImage] : [],
    },
  };
}

/* ================= PAGE ================= */

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
      publishedAt,
      _updatedAt,
      mainImage,
      livingRoomImage,
      diningRoomImage,
      masterBedroomImage,
      secondBedroomImage,
      htmlContent,
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

  const dedupedHtml = stripDuplicateLeadContent(
    rawHtml,
    Boolean(post.mainImage)
  );

  const markdownFixedHtml = convertLeftoverMarkdownBold(dedupedHtml);
  const optimizedHtml = beautifyHtml(markdownFixedHtml);

  const livingRoomImageUrl = post.livingRoomImage
    ? urlFor(post.livingRoomImage)?.width(1600)?.fit("max")?.auto("format")?.url()
    : undefined;

  const diningRoomImageUrl = post.diningRoomImage
    ? urlFor(post.diningRoomImage)?.width(1600)?.fit("max")?.auto("format")?.url()
    : undefined;

  const masterBedroomImageUrl = post.masterBedroomImage
    ? urlFor(post.masterBedroomImage)?.width(1600)?.fit("max")?.auto("format")?.url()
    : undefined;

  const secondBedroomImageUrl = post.secondBedroomImage
    ? urlFor(post.secondBedroomImage)?.width(1600)?.fit("max")?.auto("format")?.url()
    : undefined;

  let finalHtml = optimizedHtml;

  finalHtml = insertImageAfterHeading(
    finalHtml,
    "客廳設計",
    livingRoomImageUrl,
    post.livingRoomImage?.alt || `${post.title}-客廳`
  );

  finalHtml = insertImageAfterHeading(
    finalHtml,
    "餐廳設計",
    diningRoomImageUrl,
    post.diningRoomImage?.alt || `${post.title}-餐廳`
  );

  finalHtml = insertImageAfterHeading(
    finalHtml,
    "主臥設計",
    masterBedroomImageUrl,
    post.masterBedroomImage?.alt || `${post.title}-主臥`
  );

  finalHtml = insertImageAfterHeading(
    finalHtml,
    "次臥設計",
    secondBedroomImageUrl,
    post.secondBedroomImage?.alt || `${post.title}-次臥`
  );

  const articleUrl = `${SITE_URL}/blog/${slug}`;

  const mainImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(1200)?.auto("format")?.url()
    : extractFirstImage(post.htmlContent) || undefined;

  const formattedPublishedDate = formatDate(post.publishedAt);
  const formattedUpdatedDate = formatDate(post._updatedAt);

  const showUpdatedDate =
    formattedPublishedDate &&
    formattedUpdatedDate &&
    formattedPublishedDate !== formattedUpdatedDate;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}/#article`,
    headline: post.title,
    description: post.description || post.title,
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    datePublished: post.publishedAt || undefined,
    dateModified: post._updatedAt || post.publishedAt || undefined,
    inLanguage: "zh-Hant",
    author: {
      "@type": "Organization",
      name: AUTHOR_NAME,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "洛克希德黑克斯",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    image: mainImageUrl ? [mainImageUrl] : undefined,
    keywords:
      Array.isArray(post.tags) && post.tags.length > 0
        ? post.tags.join(", ")
        : undefined,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Navbar 已在 layout.tsx 全域掛載，這裡不重複渲染 */}

      <main className="mx-auto max-w-4xl px-6 pb-32 pt-36">
        {/* 標題 */}
        <h1 className="mb-4 text-3xl font-black leading-tight text-[#ff8800] md:text-5xl">
          {post.title}
        </h1>

        {/* 作者與日期 */}
        <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
          <span>
            作者：
            <a
              href="/about"
              rel="author"
              className="ml-1 font-bold text-gray-300 transition hover:text-[#ff8800]"
            >
              {AUTHOR_NAME}
            </a>
          </span>

          {formattedPublishedDate && (
            <>
              <span aria-hidden="true" className="text-white/20">
                |
              </span>

              <time dateTime={post.publishedAt}>
                發布於 {formattedPublishedDate}
              </time>
            </>
          )}

          {showUpdatedDate && (
            <>
              <span aria-hidden="true" className="text-white/20">
                |
              </span>

              <time dateTime={post._updatedAt}>
                最後更新於 {formattedUpdatedDate}
              </time>
            </>
          )}
        </div>

        {/* 主圖 */}
        {post.mainImage && (
          <img
            src={urlFor(post.mainImage)?.auto("format")?.url()}
            alt={post.title}
            width={1200}
            height={675}
            className="mb-10 h-auto w-full rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
          />
        )}

        {/* 內文 */}
        <article className="prose prose-invert max-w-none">
          <div
            className="
              [&_h2]:!mb-4 [&_h2]:!mt-10 [&_h2]:!text-2xl [&_h2]:!font-black [&_h2]:!text-[#ff8800]
              [&_h3]:!mb-3 [&_h3]:!mt-8 [&_h3]:!text-xl [&_h3]:!font-black [&_h3]:!text-[#ff8800]
              [&_p]:!leading-relaxed [&_p]:!text-gray-300
              [&_li]:!text-gray-300
              [&_a]:!text-[#ff8800] [&_a:hover]:!underline
              [&_strong]:!text-white
              [&_code]:!bg-white/5 [&_code]:!text-[#ff8800]
              [&_pre]:!border [&_pre]:!border-white/10 [&_pre]:!bg-white/5
              [&_blockquote]:!border-l-[#ff8800] [&_blockquote]:!text-gray-400
              [&_hr]:!border-white/10
              [&_img]:!mx-auto [&_img]:!my-8 [&_img]:!block [&_img]:!max-w-full [&_img]:!rounded-2xl [&_img]:!shadow-[0_4px_32px_rgba(0,0,0,0.5)]
              [&_table]:!my-8 [&_table]:!w-full [&_table]:!border-collapse [&_table]:!overflow-hidden [&_table]:!rounded-xl [&_table]:!border [&_table]:!border-white/10
              [&_th]:!border [&_th]:!border-white/10 [&_th]:!bg-orange-900/20 [&_th]:!p-4 [&_th]:!text-left [&_th]:!font-black [&_th]:!text-[#ff8800]
              [&_td]:!border [&_td]:!border-white/10 [&_td]:!p-4 [&_td]:!align-top [&_td]:!text-gray-300
            "
            dangerouslySetInnerHTML={{ __html: finalHtml }}
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
    `*[_type == "post" && defined(slug.current)]{
      "slug": slug.current
    }`
  );

  return (
    posts
      ?.filter((post: any) => Boolean(post.slug))
      .map((post: any) => ({
        slug: post.slug,
      })) || []
  );
}