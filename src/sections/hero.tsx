"use client";

import { Button } from "@/components/ui/button";
import { STATS } from "@/constants";
import { IconPhone } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trustpilotRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-svh md:min-h-0">
      {/* Mobile: centered background image with top/left/bottom fade */}
      <div
        className="absolute top-[15%] bottom-1/4 left-1/4 -right-1/4 md:hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, white 25%, white 50%, transparent 90%), linear-gradient(to right, transparent 10%, white 60%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, white 25%, white 50%, transparent 90%), linear-gradient(to right, transparent 10%, white 60%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in" as unknown as string,
        }}
      >
        <Image
          src="/plastering.webp"
          alt="Tradesperson at work"
          fill
          className="object-cover"
          style={{ objectPosition: "75% center" }}
          priority
        />
      </div>

      {/* Desktop: full-width background image with left fade */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ maskImage: "linear-gradient(to bottom, white 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, white 60%, transparent 100%)" }}
      >
        <Image
          src="/plastering.webp"
          alt="Tradesperson at work"
          fill
          className="object-cover object-right-top"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--background) 40%, transparent 60%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0 pt-24 md:pt-40 pb-8 md:pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          className="flex flex-col items-start max-w-2xl"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            Premium Lead Generation Services
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-4 text-3xl leading-9 md:text-5xl lg:text-6xl tracking-tight lg:leading-14"
          >
            <span className="block md:inline">More Leads.</span>{" "}
            <span className="block md:inline">More Customers.</span>{" "}
            <span className="block md:inline text-primary">More Profit.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-4 w-1/2 text-foreground/70 text-sm lg:text-base"
          >
            We deliver high-quality, unique leads for tradespeople across the
            UK. Let us chase the customers so you can make the money.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-row items-start gap-4 mt-8"
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

          {/* Mobile stats */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4 mt-8 md:hidden"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
            ))}
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
                className="trustpilot-widget md:![transform:scale(0.7425)] md:![margin-left:-1rem] md:![margin-top:0]"
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
  );
};

export default Hero;
