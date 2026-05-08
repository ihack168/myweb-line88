import { client } from "@/lib/sanity"; 
import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";

// --- 關鍵：強制每次請求都重新抓取資料，不使用舊快取 ---
export const revalidate = 0; 
export const dynamic = 'force-dynamic';

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  if (!source) return { url: () => "" };
  return builder.image(source);
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 使用 fetch 的時候加上 cache: 'no-store' 確保資料最新
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
    { slug: slug },
    { cache: 'no-store' } 
  );

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
        <h1 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight text-[#ff8800]">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-400 mb-12">
          <span className="font-bold text-gray-200">{post.authorName || "管理員"}</span>
          <span>•</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-TW") : ""}</span>
        </div>

        {/* 主圖 */}
        {post.mainImage && (
          <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 文章內容 */}
        <div className="prose prose-invert prose-orange max-w-none prose-lg 
                        prose-h2:text-[#ff8800] prose-h2:italic prose-h2:border-l-4 prose-h2:border-[#ff8800] prose-h2:pl-4
                        prose-strong:text-[#ff8800] 
                        prose-table:border prose-table:border-white/20 prose-th:bg-white/5">
          {/* 
              注意：如果你 AI 產出的 HTML 存放在 body 欄位且是字串格式，
              請將下方 PortableText 換成：
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
          */}
          {post.body && (
            typeof post.body === 'string' 
              ? <div dangerouslySetInnerHTML={{ __html: post.body }} />
              : <PortableText value={post.body} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 靜態路由生成 (保留用於加速已知頁面，但因上方 revalidate=0，所以會動態更新)
export async function generateStaticParams() {
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const posts = await client.fetch(query);

  if (!posts) return [];

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}