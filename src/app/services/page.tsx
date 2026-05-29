"use client";

import { Button } from "@/components/ui/button";
import { industries } from "@/data/industries";
import { getServiceBySlug } from "@/data/services";
import {
  IconBuildingSkyscraper,
  IconCar,
  IconTool,
  IconSparkles,
  IconCategory,
  IconPhone,
  IconArrowRight,
} from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div>
      {/* Hero */}
      <section className="pt-28 md:pt-44 pb-6 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            Our Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Lead Generation for{" "}
            <span className="text-primary">Every Trade</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            We work with over 60 industries across the UK. Find your trade
            below and discover how we can fill your diary with high-quality
            leads.
          </motion.p>
        </div>
      </section>

      {/* Industry Categories */}
      <section ref={ref} className="pt-6 md:pt-0 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                },
              },
            }}
            className="flex flex-col gap-10"
          >
            {industries.map((industry) => {
              const Icon = iconMap[industry.icon] || IconCategory;
              return (
                <motion.div
                  key={industry.slug}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
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
                </motion.div>
              );
            })}
          </motion.div>
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
