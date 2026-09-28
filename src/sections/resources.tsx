"use client";

import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog-posts";
import { caseStudies } from "@/data/case-studies";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

/**
 * One case study leads — it carries a headline number the blog posts can't —
 * followed by the two newest posts. Three rows is what the panel holds beside
 * the promo; everything else lives behind "Explore Resources".
 */
const items = [
  ...caseStudies.slice(0, 1).map((study) => ({
    key: `case-${study.slug}`,
    href: `/case-studies/${study.slug}`,
    image: study.image,
    label: "Case Study",
    metric: study.metrics[0]?.value,
    title: study.business,
    detail: study.metrics[0]?.label.toLowerCase(),
  })),
  ...blogPosts.slice(0, 2).map((post) => ({
    key: `blog-${post.slug}`,
    href: `/blog/${post.slug}`,
    image: post.image,
    label: post.category ? `Blog · ${post.category}` : "Blog",
    metric: undefined,
    title: post.title,
    detail: undefined,
  })),
];

const Resources = () => {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
        <div
          className={`scroll-fade-in${visible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden grid lg:grid-cols-[1.4fr_1fr]`}
        >
          {/* Promo */}
          <div className="relative flex min-h-[340px] lg:min-h-[420px]">
            <Image
              src="/tyres.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              /* The panel is near-square on mobile, and a centre crop clips the
                 subject against the right edge; pull the focal point left. */
              className="object-cover object-[35%_center] lg:object-center"
            />
            {/* The copy sits over the photo, so it gets a flat wash on mobile
                and a left-to-right fade on desktop that leaves the subject
                visible against the divider. */}
            <div className="absolute inset-0 bg-background/70 lg:bg-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />

            <div className="relative flex flex-col justify-center max-w-md p-8 lg:p-12">
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">
                Resources
              </p>
              <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground mt-3">
                <span className="lg:whitespace-nowrap">Case Studies &amp;</span>{" "}
                <span className="text-primary">Insights</span>
              </h3>
              <p className="mt-4 text-foreground/70 text-sm lg:text-base">
                Case studies and tips from UK trades businesses growing with
                Leads Everyday.
              </p>
              <div className="mt-6">
                <Link href="/resources">
                  <Button size="lg">Explore Resources</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Latest */}
          <div className="divide-y divide-white/10 border-t lg:border-t-0 lg:border-l border-white/10">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group flex items-center gap-3 lg:gap-4 p-4 lg:p-6 hover:bg-white/5 transition-colors"
              >
                {item.image && (
                  <div className="relative w-20 lg:w-28 shrink-0 aspect-video rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                    {item.label}
                  </p>
                  {item.metric ? (
                    <>
                      <p className="text-2xl lg:text-3xl tracking-tight text-primary mt-1">
                        {item.metric}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {item.title}
                        <span className="text-foreground/60">
                          {" "}
                          · {item.detail}
                        </span>
                      </p>
                    </>
                  ) : (
                    <h4 className="text-sm lg:text-base font-semibold tracking-tight text-foreground mt-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  )}
                </div>

                <IconArrowRight className="size-4 shrink-0 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
