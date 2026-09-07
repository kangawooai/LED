"use client";

import RichText from "@/components/common/rich-text";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog-posts";
import { IconArrowLeft, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const BlogPostPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div
            className="hero-animate"
            style={{ animationDelay: "0s" }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors mb-8"
            >
              <IconArrowLeft className="size-4" />
              Back to Blog
            </Link>
          </div>
          <p
            className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold"
            style={{ animationDelay: "0.1s" }}
          >
            {post.category ? `${post.category} · ` : ""}
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {post.readTime ? ` · ${post.readTime}` : ""}
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.2s" }}
          >
            {post.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div
            className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8 max-w-3xl"
            style={{ animationDelay: "0.3s" }}
          >
            <RichText content={post.content} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Ready to Get More Leads?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Book a free call and we&apos;ll show you exactly how many leads we
              can deliver for your trade.
            </p>
            <div className="mt-6">
              <a href="tel:+443330424424">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
