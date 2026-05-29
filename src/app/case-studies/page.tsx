"use client";

import { Button } from "@/components/ui/button";
import { COMPANY } from "@/constants";
import { testimonials } from "@/data/testimonials";
import {
  IconPhone,
  IconStar,
  IconQuote,
} from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const caseStudies = [
  {
    business: "DM Plumbing & Heating",
    industry: "Plumbing & Heating",
    location: "Manchester",
    challenge:
      "Dean was relying on word-of-mouth and the odd job from Checkatrade. His diary had gaps most weeks and he was spending hours chasing quotes that went nowhere.",
    solution:
      "We built a dedicated landing page for plumbing and heating services in Manchester and launched targeted Google Ads within 48 hours.",
    results: [
      "First leads within 24 hours of going live",
      "Diary fully booked 2-3 weeks in advance",
      "Averaging 30+ qualified enquiries per month",
      "Stopped paying for shared lead platforms entirely",
    ],
    quote:
      "Leads Everyday has transformed our business. The quality of leads is unbelievable and our diary is now full weeks in advance.",
    name: "Dean M.",
  },
  {
    business: "TR Roofing Solutions",
    industry: "Roofing",
    location: "Birmingham",
    challenge:
      "Tom's roofing company was growing but he was wasting time on leads that were also sent to five other roofers. Win rates were low and advertising costs were high.",
    solution:
      "We created an exclusive landing page for roof repairs in Birmingham and ran highly targeted ads so Tom was the only roofer customers contacted.",
    results: [
      "100% exclusive leads -- no competition",
      "Win rate jumped from 15% to over 40%",
      "Consistent flow of 20+ leads per month",
      "Reduced overall marketing spend by 35%",
    ],
    quote:
      "We used to waste so much time chasing leads that went nowhere. Now we get qualified enquiries every single day.",
    name: "Tom R.",
  },
  {
    business: "CB Electrical",
    industry: "Electrical",
    location: "Leeds",
    challenge:
      "Chris had just started his own electrical company after years working for someone else. He had the skills but no reliable way to get customers.",
    solution:
      "We launched a targeted campaign for electricians in Leeds, building Chris a professional online presence and driving local searches to his page.",
    results: [
      "Went from zero to fully booked in under a month",
      "Now turns down work due to high demand",
      "Expanded to hire two additional electricians",
      "ROI of over 5x on advertising spend",
    ],
    quote:
      "Professional, reliable and results-driven. Highly recommend to any trade business serious about growth.",
    name: "Chris B.",
  },
];

const CaseStudies = () => {
  const studiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const studiesInView = useInView(studiesRef, { once: true, amount: 0.1 });
  const reviewsInView = useInView(reviewsRef, { once: true, amount: 0.2 });

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
            Case Studies
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Real Results From{" "}
            <span className="text-primary">Real Businesses</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            See how tradespeople across the UK are using {COMPANY.name} to fill
            their diaries and grow their businesses. No fluff -- just the
            numbers.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: COMPANY.leadsDelivered, label: "Leads Delivered" },
              { value: COMPANY.businessesGrown, label: "Businesses Grown" },
              { value: COMPANY.averageRoi, label: "Average ROI" },
              { value: COMPANY.clientRetention, label: "Client Retention" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 text-center"
              >
                <span className="text-3xl md:text-4xl tracking-tight text-primary">
                  {stat.value}
                </span>
                <p className="text-foreground/70 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section ref={studiesRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial="hidden"
            animate={studiesInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.1 },
              },
            }}
            className="flex flex-col gap-6"
          >
            {caseStudies.map((study) => (
              <motion.div
                key={study.business}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                        {study.industry}
                      </span>
                      <span className="text-foreground/30">·</span>
                      <span className="text-xs text-foreground/50">
                        {study.location}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl tracking-tight">
                      {study.business}
                    </h3>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider mb-1">
                          The Challenge
                        </h4>
                        <p className="text-foreground/70 text-sm lg:text-[15px]">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider mb-1">
                          Our Solution
                        </h4>
                        <p className="text-foreground/70 text-sm lg:text-[15px]">
                          {study.solution}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider mb-3">
                      Results
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {study.results.map((result) => (
                        <li
                          key={result}
                          className="flex items-start gap-2 text-sm lg:text-[15px]"
                        >
                          <IconStar className="size-4 text-primary shrink-0 mt-0.5 fill-primary" />
                          <span className="text-foreground/80">{result}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-white/5 border border-white/10 rounded-md p-4">
                      <IconQuote className="size-5 text-primary/40 mb-2" />
                      <p className="text-foreground/80 text-sm italic leading-relaxed">
                        &ldquo;{study.quote}&rdquo;
                      </p>
                      <p className="text-foreground/50 text-xs mt-2">
                        -- {study.name}, {study.business}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* More Reviews */}
      <section ref={reviewsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              reviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            What Our Clients Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={
              reviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            Trusted by {COMPANY.businessesGrown} Businesses
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={reviewsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.3 },
              },
            }}
            className="grid md:grid-cols-3 gap-4 mt-8 md:mt-12"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-8 flex flex-col"
              >
                <div className="flex gap-0.5 text-primary mb-4">
                  <IconStar className="size-4 fill-primary" />
                  <IconStar className="size-4 fill-primary" />
                  <IconStar className="size-4 fill-primary" />
                  <IconStar className="size-4 fill-primary" />
                  <IconStar className="size-4 fill-primary" />
                </div>
                <p className="text-foreground/90 text-balance leading-relaxed flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex flex-col mt-6 pt-4 border-t border-border">
                  <span className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </span>
                  <span className="text-xs text-foreground/70">
                    {testimonial.industry}
                  </span>
                </div>
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
              Ready to Be Our Next Success Story?
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

export default CaseStudies;
