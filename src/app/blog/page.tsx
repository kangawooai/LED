"use client";

import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog-posts";
import { IconArrowRight, IconPhone } from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const Blog = () => {
  const postsRef = useRef(null);
  const postsInView = useInView(postsRef, { once: true, amount: 0.1 });

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            Blog
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Insights & <span className="text-primary">Tips</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            Practical advice and insights to help tradespeople get more
            customers, grow their businesses and make the most of lead
            generation.
          </motion.p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section ref={postsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial="hidden"
            animate={postsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.3 },
              },
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8 flex flex-col h-full group"
                >
                  <p className="text-xs text-foreground/50 uppercase tracking-wider">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
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
                </motion.div>
              </Link>
            ))}
          </motion.div>
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
