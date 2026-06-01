"use client";

import { Button } from "@/components/ui/button";
import { getServiceBySlug } from "@/data/services";
import { IconPhone, IconArrowRight } from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const services = [
  "mot-bookings", "servicing", "clutch-repairs-replacement",
  "suspension-repairs-replacement", "brakes-discs-repair-replacement",
  "cambelt-repair-replacement", "turbo-repair-replacement",
  "gearbox-repair-replacement", "engine-recon-rebuilds",
  "exhausts-repairs-replacements", "dpf-carbon-cleaning", "remapping",
  "tyres", "wheel-repair-alloys", "bodyshop-smart-repairs", "auto-electrician",
  "air-conditioning", "electric-hybrid-servicing", "towbar-supply-installation",
  "vehicle-immobiliser-installation", "detailing", "car-van-finance-prime-subprime",
  "vehicle-recovery", "differentials", "mobile-mechanic",
];

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => {
      if (["and", "of", "the", "in", "for", "a"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const MotorTradeHome = () => {
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.1 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const trustpilotRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-svh md:min-h-0">
        {/* Mobile background */}
        <div
          className="absolute top-[10%] bottom-1/4 left-[10%] -right-1/4 md:hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, white 20%, white 50%, transparent 90%), linear-gradient(to right, transparent 30%, white 60%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, white 20%, white 50%, transparent 90%), linear-gradient(to right, transparent 30%, white 60%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in" as unknown as string,
          }}
        >
          <Image
            src="/servicing.webp"
            alt="Motor Trade"
            fill
            className="object-cover"
            style={{ objectPosition: "95% center" }}
            priority
          />
        </div>

        {/* Desktop background */}
        <div
          className="absolute inset-y-0 left-0 hidden md:block"
          style={{
            right: "max(0px, calc(50% - 50rem))",
            maskImage: "linear-gradient(to bottom, white 60%, transparent 100%), linear-gradient(to left, transparent 0rem, white 12rem)",
            WebkitMaskImage: "linear-gradient(to bottom, white 60%, transparent 100%), linear-gradient(to left, transparent 0rem, white 12rem)",
            maskComposite: "intersect",
            WebkitMaskComposite: "destination-in",
          }}
        >
          <Image
            src="/servicing.webp"
            alt="Motor Trade"
            fill
            className="object-cover object-right-top"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--background) 40%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0 pt-28 md:pt-44 pb-12 md:pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.1 },
              },
            }}
            className="flex flex-col items-start"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-sm uppercase tracking-widest text-primary font-semibold"
            >
              Motor Trade
            </motion.p>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-4 text-3xl leading-9 md:text-5xl lg:text-6xl tracking-tight lg:leading-14 w-[70%] md:w-1/2"
            >
              Leads for Your Garage or Workshop
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-4 text-foreground/70 text-sm lg:text-base w-[70%] md:w-1/2"
            >
              MOT bookings, servicing, bodywork, and specialist repairs. We
              bring car owners to your garage ready to book. Bespoke landing
              pages and targeted Google Ads deliver leads straight to your
              phone.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-row items-center gap-4 mt-8"
            >
              {/* Mobile: Call Now + Enquire Now */}
              <a href="tel:+443330424424" className="md:hidden">
                <Button size="default">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
              <Link href="/book-a-call" className="md:hidden">
                <Button variant="muted" size="default">
                  Enquire Now
                </Button>
              </Link>

              {/* Desktop: Enquire Now + or call text */}
              <Link href="/book-a-call" className="hidden md:block">
                <Button size="default">
                  Enquire Now
                </Button>
              </Link>
              <span className="hidden md:inline text-sm text-foreground/60">
                or call{" "}
                <a href="tel:+443330424424" className="text-primary hover:text-primary/80 font-medium">
                  0333 0 424 424
                </a>
              </span>
            </motion.div>

            {mounted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden md:block"
              >
                <div
                  ref={trustpilotRef}
                  className="trustpilot-widget"
                  data-locale="en-US"
                  data-template-id="53aa8807dec7e10d38f59f32"
                  data-businessunit-id="606ea5a74e740b0001398b05"
                  data-style-height="150px"
                  data-style-width="100%"
                  data-theme="dark"
                  data-token="769c3dbc-db9a-4da4-b5a9-9c18f42feece"
                  style={{ transformOrigin: "left", transform: "scale(0.635)", marginLeft: "-1rem", marginTop: "-1rem" }}
                >
                  <a
                    href="https://www.trustpilot.com/review/leadseveryday.co.uk"
                    target="_blank"
                    rel="noopener"
                  >
                    Trustpilot
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="w-full py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            Motor Trade Services We Cover
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.3 },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12"
          >
            {services.map((slug) => {
              const service = getServiceBySlug(slug);
              return (
                <motion.div
                  key={slug}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    href={`/${slug}`}
                    className="group flex items-center justify-between gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-4 py-3.5 hover:border-primary/30 transition-colors"
                  >
                    <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">
                      {service?.name ?? slugToName(slug)}
                    </span>
                    <IconArrowRight className="size-4 text-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                  </Link>
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
              Ready to Fill Your Workshop?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Get in touch and we&apos;ll build a custom lead generation
              campaign for your garage.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              {/* Mobile: Call Now */}
              <a href="tel:+443330424424" className="md:hidden">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>

              {/* Desktop: Enquire Now + or call text */}
              <Link href="/book-a-call" className="hidden md:block">
                <Button size="lg">
                  Enquire Now
                </Button>
              </Link>
              <span className="hidden md:inline text-sm text-foreground/60">
                or call{" "}
                <a href="tel:+443330424424" className="text-primary hover:text-primary/80 font-medium">
                  0333 0 424 424
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotorTradeHome;
