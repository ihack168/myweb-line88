import { client } from "@/lib/sanity"; 
import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";

// 修正圖片 Builder 棄用問題
const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  if (!source) return { url: () => "" };
  return builder.image(source);
}

// 關鍵修正：params 在新版 Next.js 是 Promise，類型需定義為 Promise
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. 必須先 await 才能拿到真正的 slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 2. 執行查詢：確保傳入的變數名稱與 GROQ 語法中的 $slug 對應
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      publishedAt,
      mainImage,
      body,
      "authorName": author->name,
      "tags": categories[]->title
    }`,
    { slug: slug } // <--- 這裡傳入剛才 await 拿到的 slug
  );

  // 3. 如果找不到文章，回傳 404
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        {/* 文章標籤 */}
        <div className="flex gap-2 mb-6">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="text-[#ff8800] bg-[#ff8800]/10 px-3 py-1 rounded-full text-sm font-bold">
              #{tag}
            </span>
          ))}
        </div>

        {/* 標題與發布日期 */}
        <h1 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-400 mb-12">
          <span>{post.authorName || "管理員"}</span>
          <span>•</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-TW") : ""}</span>
        </div>

        {/* 主圖 */}
        {post.mainImage && (
          <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 文章內容 */}
        <div className="prose prose-invert prose-orange max-w-none prose-lg">
          {post.body && <PortableText value={post.body} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 4. 靜態路由生成
export async function generateStaticParams() {
  // 注意：這裡不需要 params，單純抓取所有 slug
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const posts = await client.fetch(query);

  if (!posts) return [];

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}