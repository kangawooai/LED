"use client";

import { Button } from "@/components/ui/button";
import { industries } from "@/data/industries";
import { getServiceBySlug } from "@/data/services";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  IconBuildingSkyscraper,
  IconCar,
  IconTool,
  IconSparkles,
  IconCategory,
  IconPhone,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  IconBuildingSkyscraper,
  IconCar,
  IconTool,
  IconSparkles,
  IconCategory,
};

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => {
      if (["and", "of", "the", "in", "for", "a"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const Services = () => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <div>
      {/* Hero */}
      <section className="pt-28 md:pt-44 pb-6 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
            Our Services
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Lead Generation for{" "}
            <span className="text-primary">Every Trade</span>
          </h1>
          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            We work with over 60 industries across the UK. Find your trade
            below and discover how we can fill your diary with high-quality
            leads.
          </p>
        </div>
      </section>

      {/* Industry Categories */}
      <section ref={ref} className="pt-6 md:pt-0 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="flex flex-col gap-10">
            {industries.map((industry, index) => {
              const Icon = iconMap[industry.icon] || IconCategory;
              return (
                <div
                  key={industry.slug}
                  className={`scroll-fade-in${visible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8`}
                  style={{ transitionDelay: `${0.1 + index * 0.15}s` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl tracking-tight">
                      {industry.name}
                    </h2>
                  </div>
                  <p className="text-foreground/70 text-sm lg:text-base mb-6 max-w-2xl">
                    {industry.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {industry.services.map((slug) => {
                      const service = getServiceBySlug(slug);
                      return (
                        <Link key={slug} href={`/${slug}`}>
                          <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-white/5 border border-white/10 text-foreground/80 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer">
                            {service?.name ?? slugToName(slug)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Don&apos;t See Your Trade?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              We work with businesses across all industries. Get in touch and
              we&apos;ll build a custom campaign for you.
            </p>
            <div className="mt-6">
              <Link href="/book-a-call">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Book a Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
