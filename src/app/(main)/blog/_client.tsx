"use client";

import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog-posts";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { IconArrowRight, IconPhone } from "@tabler/icons-react";
import Link from "next/link";

const Blog = () => {
  const { ref: postsRef, visible: postsVisible } = useScrollReveal(0.1);

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
            Blog
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Insights & <span className="text-primary">Tips</span>
          </h1>
          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            Practical advice and insights to help tradespeople get more
            customers, grow their businesses and make the most of lead
            generation.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section ref={postsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div
                  className={`scroll-fade-in${postsVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8 flex flex-col h-full group`}
                  style={{ transitionDelay: `${0.3 + index * 0.15}s` }}
                >
                  {post.category && (
                    <span className="self-start text-xs uppercase tracking-widest text-primary font-semibold">
                      {post.category}
                    </span>
                  )}
                  <p className="text-xs text-foreground/50 mt-2">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {post.readTime ? ` · ${post.readTime}` : ""}
                  </p>
                  <h3 className="text-lg md:text-xl tracking-tight mt-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mt-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-4">
                    Read More
                    <IconArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
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

export default Blog;
