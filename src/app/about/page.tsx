"use client";

import { Button } from "@/components/ui/button";
import { COMPANY, STATS } from "@/constants";
import { staff } from "@/data/staff";
import {
  IconPhone,
  IconTarget,
  IconUsers,
  IconTrendingUp,
  IconShieldCheck,
} from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const values = [
  {
    icon: IconTarget,
    title: "Results First",
    description:
      "We tell you how many leads to expect before you start. No guesswork, no empty promises -- just clear forecasts backed by data.",
  },
  {
    icon: IconShieldCheck,
    title: "No Commission, Ever",
    description:
      "You pay a flat monthly fee. Every lead is 100% yours. We never take a cut of your jobs or earnings.",
  },
  {
    icon: IconUsers,
    title: "Exclusive Leads",
    description:
      "Your leads are never shared or resold. When a customer enquires, they're contacting you and only you.",
  },
  {
    icon: IconTrendingUp,
    title: "Proven at Scale",
    description:
      "With over 15,000 campaigns and 60+ industries, we've refined a system that works for trades businesses of every size.",
  },
];

const About = () => {
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 });

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
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            We Help Tradespeople{" "}
            <span className="text-primary">Grow</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            {COMPANY.name} was built with one goal: give tradespeople a
            reliable, honest way to get more customers. No commissions, no
            shared leads, no long contracts. Just real enquiries from real
            people who need your services.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  We started because we saw an industry full of broken promises.
                  Lead generation companies charging commission, sharing leads
                  between competitors, and locking businesses into contracts with
                  no results.
                </p>
                <p>
                  We knew there was a better way. We build bespoke landing pages
                  for each trade, run targeted Google Ads, and deliver leads
                  directly to our clients. No middlemen, no sharing, no
                  commission.
                </p>
                <p>
                  Today, we work with over 200 businesses across 60+ industries
                  and have delivered tens of thousands of leads. Our clients stay
                  because the results speak for themselves.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                How It Works
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  We build you a professional, mobile-optimised landing page
                  tailored to your trade. Then we run targeted Google Ads so that
                  when someone in your area searches for your service, they find
                  your page first.
                </p>
                <p>
                  The customer fills in an enquiry form or calls you directly.
                  You get the lead instantly -- name, number, what they need, and
                  where they are. No chasing, no cold calls, just warm
                  enquiries.
                </p>
                <p>
                  We monitor and optimise your campaign daily to keep leads
                  flowing and costs down. Most clients see their first leads
                  within 24 hours.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-left md:text-center">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            Built Different
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.3 },
              },
            }}
            className="grid md:grid-cols-2 gap-4 mt-8 md:mt-12"
          >
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-6 lg:px-8 lg:py-8"
                >
                  <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 mt-2 text-sm lg:text-[15px]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            Our Team
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            The People Behind Your Leads
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="text-foreground/70 text-sm lg:text-base text-center mt-4 max-w-2xl mx-auto"
          >
            A dedicated team of marketing specialists working to fill your diary
            every single day.
          </motion.p>

          <motion.div
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 md:mt-12"
          >
            {staff.map((member) => (
              <motion.div
                key={member.slug}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 flex flex-col items-center text-center"
              >
                <div className="size-32 md:size-40 rounded-full bg-primary/10 border border-primary/20 overflow-hidden mb-4 relative">
                  <div
                    className="absolute"
                    style={
                      member.slug === "max-young"
                        ? { inset: 0 }
                        : { inset: "-25%", top: "-10%" }
                    }
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      style={
                        member.slug === "max-young"
                          ? { objectPosition: "center -15%" }
                          : { objectPosition: "center 20%" }
                      }
                    />
                  </div>
                </div>
                <h3 className="text-sm md:text-base font-semibold tracking-tight">
                  {member.name}
                </h3>
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
              Ready to Work With Us?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Book a free call and we&apos;ll show you exactly how many leads we
              can deliver for your trade.
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

export default About;
