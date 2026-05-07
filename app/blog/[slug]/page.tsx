import { notFound } from "next/navigation";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";

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
          style={{ maxWidth: "100%", marginTop: 16, marginBottom: 16 }}
        />
      );
    },
  },
};

async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "author": author->name,
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return notFound();
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>
      <h1>{post.title}</h1>
      <p style={{ color: "#666" }}>Author: {post.author}</p>
      <article style={{ marginTop: 20 }}>
        {post.body ? (
          <PortableText value={post.body} components={components} />
        ) : (
          <p>No content</p>
        )}
      </article>
    </main>
  );
}