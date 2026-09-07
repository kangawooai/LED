"use client";

import { Button } from "@/components/ui/button";
import { STATS } from "@/constants";
import { blogPosts } from "@/data/blog-posts";
import { caseStudies } from "@/data/case-studies";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { IconArrowRight, IconPhone } from "@tabler/icons-react";
import Link from "next/link";

const industries = [
  { title: "Construction & Home", href: "/construction-and-home-improvements" },
  { title: "Motor Trade", href: "/motor-trade" },
  { title: "Trades", href: "/trades" },
  { title: "Cleaning", href: "/cleaning" },
  { title: "Other Industries", href: "/other-industries" },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Resources = () => {
  const { ref: blogRef, visible: blogVisible } = useScrollReveal(0.1);
  const { ref: studiesRef, visible: studiesVisible } = useScrollReveal(0.1);
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.2);
  const { ref: industryRef, visible: industryVisible } = useScrollReveal(0.2);

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
            Case Studies &amp; Insights
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-primary">Resources</span>
          </h1>
          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            Real results from UK businesses we&apos;ve helped grow, plus
            practical advice on getting more from your leads.
          </p>
        </div>
      </section>

      {/* Blogs */}
      <section ref={blogRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl tracking-tight">Blogs</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0"
            >
              View all
              <IconArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div
                  className={`scroll-fade-in${blogVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8 flex flex-col h-full group`}
                  style={{ transitionDelay: `${0.1 + index * 0.12}s` }}
                >
                  {post.category && (
                    <span className="self-start text-xs uppercase tracking-widest text-primary font-semibold">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-lg md:text-xl tracking-tight mt-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mt-3 flex-1">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-foreground/50 mt-4">
                    {formatDate(post.date)}
                    {post.readTime ? ` · ${post.readTime}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section ref={studiesRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl tracking-tight">
              Case Studies
            </h2>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0"
            >
              View all
              <IconArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {caseStudies.map((study, index) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`}>
                <div
                  className={`scroll-fade-in${studiesVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8 flex flex-col h-full group`}
                  style={{ transitionDelay: `${0.1 + index * 0.12}s` }}
                >
                  <span className="self-start text-xs uppercase tracking-widest text-primary font-semibold">
                    {study.industry}
                  </span>
                  <h3 className="text-xl md:text-2xl tracking-tight mt-3 group-hover:text-primary transition-colors">
                    {study.business}
                  </h3>
                  <p className="text-foreground/70 text-sm mt-3 flex-1">
                    {study.summary}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                    {study.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="text-xl md:text-2xl tracking-tight text-primary">
                          {metric.value}
                        </p>
                        <p className="text-xs text-foreground/60 mt-1 leading-snug">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section ref={statsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <h2 className="text-2xl md:text-3xl tracking-tight mb-6">
            By The Numbers
          </h2>
          <div
            className={`scroll-fade-in${statsVisible ? " visible" : ""} grid grid-cols-2 md:grid-cols-4 gap-4`}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 text-center"
              >
                <span className="text-3xl md:text-4xl tracking-tight text-primary">
                  {stat.value}
                </span>
                <p className="text-sm font-medium text-foreground mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section ref={industryRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <h2 className="text-2xl md:text-3xl tracking-tight mb-6">
            We Work Across Every Trade
          </h2>
          <div
            className={`scroll-fade-in${industryVisible ? " visible" : ""} grid grid-cols-2 md:grid-cols-5 gap-4`}
          >
            {industries.map((industry) => (
              <Link key={industry.href} href={industry.href}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 h-full flex items-center justify-between gap-2 group">
                  <span className="text-sm font-medium">{industry.title}</span>
                  <IconArrowRight className="size-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
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
              Ready to Become Our Next Case Study?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Book a free call and we&apos;ll show you exactly how many leads we
              can deliver for your trade.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="tel:+443330424424">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
              <Link href="/book-a-call">
                <Button size="lg" variant="muted">
                  Book a Free Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
