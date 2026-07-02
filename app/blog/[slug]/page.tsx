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
 * 🚨 去除內容開頭重複的標題與首圖
 *
 * AI 產文流程生成的 htmlContent，常常自己就包含完整的 <h1> 標題
 * 和一張首圖，但頁面模板本身也會用 post.title / post.mainImage
 * 各渲染一次，兩者疊在一起就會造成標題跟主圖在畫面上各出現兩次，
 * 對 SEO 也不利（同一頁出現兩個 H1）。
 *
 * - hasMainImage：頁面是否已經另外渲染過首圖，是的話才把內容裡的首圖拿掉
 */
function stripDuplicateLeadContent(html: string, hasMainImage: boolean) {
  let result = html;

  if (hasMainImage) {
    // 只拿掉「內容最開頭」那張圖（可能前面夾雜空白），避免誤刪文章中段的圖
    result = result.replace(/^\s*<img[^>]*>\s*/i, "");
  }

  // 拿掉內容裡第一個出現的 <h1>，頁面已經用 post.title 渲染過標題了
  result = result.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");

  return result;
}

/**
 * 🚑 防呆：AI 產文流程偶爾會漏轉 Markdown 粗體語法，
 * 導致 **文字** 直接顯示成裸露的星號而不是 <strong>。
 * 這裡在渲染前統一補一次轉換，不管 Sanity 裡的 HTML 有沒有漏轉都會生效，
 * 治標但能立即讓現有與未來文章都不再出現星號 —— 根本解法仍建議回頭
 * 修正產文 pipeline 裡 Markdown → HTML 轉換的邏輯。
 */
function convertLeftoverMarkdownBold(html: string) {
  // [^*]+ 避免貪婪比對跨越多組 **...**，只吃掉單一組星號之間的內容
  return html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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
<article className="prose prose-invert max-w-none ...">
  <div
    className="
      [&_h2]:!mt-10 [&_h2]:!mb-4 [&_h2]:!text-2xl [&_h2]:!text-[#ff8800] [&_h2]:!font-black
      [&_h3]:!mt-8 [&_h3]:!text-xl [&_h3]:!text-[#ff8800]
      [&_p]:!text-gray-300 [&_p]:!leading-relaxed
      [&_img]:!rounded-2xl [&_img]:!my-8 [&_img]:!block [&_img]:!mx-auto [&_img]:!max-w-full
      [&_li]:!text-gray-300
      [&_a]:!text-[#ff8800]
      [&_strong]:!text-white
      [&_table]:!w-full [&_table]:!border-collapse
      [&_th]:!bg-orange-900/20 [&_th]:!text-[#ff8800] [&_th]:!p-4 [&_th]:!border [&_th]:!border-white/10
      [&_td]:!p-4 [&_td]:!border [&_td]:!border-white/10 [&_td]:!text-gray-300
    "
    dangerouslySetInnerHTML={{ __html: optimizedHtml }}
  />
</article>

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
