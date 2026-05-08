import { client } from "@/lib/sanity"; 
import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";

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
        <div className="my-8 flex flex-col items-center">
          <img
            src={urlFor(value).url()}
            alt={value.alt || "文章圖片"}
            className="rounded-xl border border-white/10 shadow-lg"
            loading="lazy"
          />
          {value.caption && (
            <p className="mt-2 text-sm text-gray-400 italic">{value.caption}</p>
          )}
        </div>
      );
    },
  },
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      publishedAt,
      mainImage,
      body,
      htmlContent, 
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
        {/* 標籤區 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="text-[#ff8800] bg-[#ff8800]/10 border border-[#ff8800]/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              #{tag}
            </span>
          ))}
        </div>

        {/* 標題區 */}
        <h1 className="text-4xl md:text-6xl font-black mb-8 italic leading-tight text-[#ff8800]">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-400 mb-12 text-sm">
          <span className="font-bold text-gray-200">By {post.authorName || "Lockhead Hex Admin"}</span>
          <span className="text-white/20">|</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("zh-TW") : ""}</span>
        </div>

        {/* 主圖 */}
        {post.mainImage && (
          <div className="relative w-full h-[300px] md:h-[450px] mb-16 rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(255,136,0,0.1)]">
            <img
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 內容渲染區 */}
        <article className="prose prose-invert prose-orange max-w-none 
                        prose-lg md:prose-xl
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                        prose-headings:text-[#ff8800] prose-headings:font-black prose-headings:italic
                        prose-h2:text-3xl prose-h2:border-l-8 prose-h2:border-[#ff8800] prose-h2:pl-6 prose-h2:mt-12 prose-h2:mb-6
                        prose-h3:text-2xl prose-h3:mt-8
                        prose-strong:text-[#ff8800] prose-strong:font-bold
                        
                        prose-ul:bg-white/5 prose-ul:p-8 prose-ul:rounded-2xl prose-ul:border prose-ul:border-white/10
                        prose-li:marker:text-[#ff8800] prose-li:text-gray-300
                        
                        /* 強制處理 Excel 的表格樣式 */
                        prose-table:border-collapse prose-table:my-10 prose-table:block prose-table:overflow-x-auto
                        prose-thead:bg-[#ff8800]/20 prose-th:text-[#ff8800] prose-th:p-4 prose-th:border prose-th:border-white/10
                        prose-td:p-4 prose-td:border prose-td:border-white/10 prose-td:text-gray-300
                        
                        prose-img:rounded-2xl prose-img:border prose-img:border-white/10
                        prose-blockquote:border-l-[#ff8800] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic">
          
          {post.htmlContent ? (
            <div 
              className="excel-content-fix [&_tr]:!bg-transparent [&_th]:!bg-[#ff8800]/20 [&_table]:!w-full [&_div]:!contents"
              dangerouslySetInnerHTML={{ __html: post.htmlContent }} 
            />
          ) : (
            post.body && <PortableText value={post.body} components={ptComponents} />
          )}

        </article>
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