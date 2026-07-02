import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";
import BlogPostPage from "./_client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function Page() {
  return <BlogPostPage />;
}
