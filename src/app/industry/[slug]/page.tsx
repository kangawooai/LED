"use client";

import { Button } from "@/components/ui/button";
import { getIndustryBySlug } from "@/data/industries";
import { getServicesByCategory } from "@/data/services";
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
import { notFound, useParams } from "next/navigation";
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

const IndustryPage = () => {
  const params = useParams<{ slug: string }>();
  const industry = getIndustryBySlug(params.slug);

  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.1 });

  if (!industry) {
    notFound();
  }

  const Icon = iconMap[industry.icon] || IconCategory;
  const categoryServices = getServicesByCategory(industry.category);

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="size-5 text-primary" />
            </div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">
              {industry.name}
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Lead Generation for{" "}
            <span className="text-primary">{industry.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            {industry.description}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              servicesInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={
              servicesInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-3xl md:text-4xl tracking-tight text-foreground mt-3"
          >
            {categoryServices.length} Services Available
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.2,
                },
              },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 md:mt-12"
          >
            {categoryServices.map((service) => (
              <motion.div
                key={service.slug}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link href={`/${service.slug}`} className="block h-full">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 lg:p-6 h-full hover:border-primary/30 transition-colors group">
                    <h3 className="text-lg md:text-xl tracking-tight group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-foreground/70 text-sm mt-2 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-medium">
                      View Service
                      <IconArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Ready to Get More {industry.name} Leads?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Give us a call and we&apos;ll show you exactly how many leads we
              can deliver for your {industry.name.toLowerCase()} business.
            </p>
            <div className="mt-6">
              <Link href="tel:+443330424424">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Us Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryPage;
