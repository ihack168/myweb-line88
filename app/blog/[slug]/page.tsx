import { notFound } from "next/navigation";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "t0di9pwy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      "slug": slug.current,
      "author": author->name
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

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>
      <h1>{post.title}</h1>

      <p style={{ color: "#666" }}>Author: {post.author}</p>

      <article style={{ marginTop: 20 }}>
        {post.body ? (
          post.body.map((block: any, index: number) => (
            <p key={index}>{block.children?.[0]?.text}</p>
          ))
        ) : (
          <p>No content</p>
        )}
      </article>
    </main>
  );
}