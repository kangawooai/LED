"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { blogPosts } from "@/data/blog-posts";
import { caseStudies } from "@/data/case-studies";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Case studies lead — they are the strongest proof we have, and the section
 * sits straight after the reviews. Blog posts follow in the order the data
 * file keeps them, which is newest first.
 */
const cards = [
  ...caseStudies.map((study) => ({
    key: `case-${study.slug}`,
    href: `/case-studies/${study.slug}`,
    image: study.image,
    eyebrow: "Case Study",
    title: study.business,
    description: study.summary,
    meta: study.industry,
  })),
  ...blogPosts.map((post) => ({
    key: `blog-${post.slug}`,
    href: `/blog/${post.slug}`,
    image: post.image,
    eyebrow: post.category || "Article",
    title: post.title,
    description: post.excerpt,
    meta: [formatDate(post.date), post.readTime].filter(Boolean).join(" · "),
  })),
];

const Resources = () => {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
        <Carousel opts={{ align: "start" }}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p
                className={`scroll-fade-in${visible ? " visible" : ""} text-sm uppercase tracking-widest text-primary font-semibold`}
              >
                Case Studies &amp; Insights
              </p>
              <h3
                className={`scroll-fade-in${visible ? " visible" : ""} text-4xl md:text-5xl tracking-tight text-foreground mt-3`}
                style={{ transitionDelay: "0.1s" }}
              >
                Learn From Businesses Like Yours
              </h3>
              <p
                className={`scroll-fade-in${visible ? " visible" : ""} mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base`}
                style={{ transitionDelay: "0.2s" }}
              >
                Real results from UK businesses we&apos;ve helped grow, plus
                practical advice on getting more from your leads.
              </p>
            </div>

            {/* Arrows live in the header: the component positions them outside
                the track by default, which would overhang the page on mobile. */}
            <div
              className={`scroll-fade-in${visible ? " visible" : ""} hidden md:flex items-center gap-2 shrink-0 pb-2`}
              style={{ transitionDelay: "0.2s" }}
            >
              <CarouselPrevious className="static top-auto left-auto translate-y-0 size-9" />
              <CarouselNext className="static top-auto right-auto translate-y-0 size-9" />
            </div>
          </div>

          {/* The reveal sits on a wrapper, not on CarouselContent: that class
              animates `transform`, which is the same property embla drives to
              move the track, and the two fight. */}
          <div
            className={`scroll-fade-in${visible ? " visible" : ""} mt-8 md:mt-12`}
            style={{ transitionDelay: "0.3s" }}
          >
            <CarouselContent>
              {cards.map((card) => (
                <CarouselItem
                  key={card.key}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
                >
                  <Link href={card.href} className="block h-full">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden flex flex-col h-full group">
                      {card.image && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={card.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <span className="self-start text-xs uppercase tracking-widest text-primary font-semibold">
                          {card.eyebrow}
                        </span>
                        <h4 className="text-lg md:text-xl tracking-tight mt-3 group-hover:text-primary transition-colors">
                          {card.title}
                        </h4>
                        <p className="text-foreground/70 text-sm mt-3 flex-1 line-clamp-4">
                          {card.description}
                        </p>
                        <p className="text-xs text-foreground/50 mt-4">
                          {card.meta}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>

        <div
          className={`scroll-fade-in${visible ? " visible" : ""} mt-8 flex justify-center md:justify-start`}
          style={{ transitionDelay: "0.4s" }}
        >
          <Link href="/resources">
            <Button variant="outline" size="lg">
              View All Resources
              <IconArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Resources;
