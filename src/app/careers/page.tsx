"use client";

import CareersForm from "@/components/forms/careers-form";
import { COMPANY } from "@/constants";
import {
  IconCoffee,
  IconBallTennis,
  IconBarbell,
  IconConfetti,
  IconBuildingSkyscraper,
  IconCar,
  IconClock,
  IconShieldCheck,
  IconFriends,
} from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const perks = [
  {
    icon: IconCoffee,
    title: "Breakfast",
  },
  {
    icon: IconBallTennis,
    title: "Table Tennis",
  },
  {
    icon: IconBarbell,
    title: "Gym Membership",
  },
  {
    icon: IconFriends,
    title: "Work Outings",
  },
  {
    icon: IconConfetti,
    title: "Christmas Party",
  },
  {
    icon: IconBuildingSkyscraper,
    title: "Picturesque Building & Location",
  },
  {
    icon: IconCar,
    title: "On Site Parking",
  },
  {
    icon: IconClock,
    title: "No Unsociable Hours",
  },
  {
    icon: IconShieldCheck,
    title: "Security & Stability",
  },
];

const WhyWorkHere = () => {
  const perksRef = useRef(null);
  const perksInView = useInView(perksRef, { once: true, amount: 0.1 });

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
            Careers
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            What We Do &{" "}
            <span className="text-primary">Why You Should Too</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            Be a part of this dynamic business, and feel proud of the part you
            will play in building a more prosperous Britain -- for you and for
            our customers.
          </motion.p>
        </div>
      </section>

      {/* About */}
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
                Who We Are
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  For over 10 years we have been generating leads every day for
                  tradespeople. From MOT stations to tree surgeons, electricians
                  and roofers -- whatever your trade, we&apos;ve got it covered.
                </p>
                <p>
                  All the leads we generate are unique and go directly to our
                  customers. It&apos;s pay as you go, so they can leave anytime,
                  but why would they? Our family-run business has and continues
                  to generate thousands of leads every month from people who need
                  tradesmen&apos;s services right now.
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
                Why Join Us
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  We don&apos;t take a cut -- it&apos;s one affordable payment
                  per month and we&apos;ve helped grow thousands of businesses
                  all over the UK. If you want to know what our customers think,
                  just check us out on{" "}
                  <a
                    href="https://www.trustpilot.com/review/leadseveryday.co.uk"
                    target="_blank"
                    rel="noopener"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Trustpilot
                  </a>
                  .
                </p>
                <p>
                  Work is only work when you don&apos;t enjoy it or don&apos;t
                  feel you have a career path. We recognise and reward people who
                  show potential and create a work environment that makes you
                  feel good every day.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section ref={perksRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={perksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
          >
            Our Perks
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={perksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3"
          >
            What You Get
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={perksInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.07, delayChildren: 0.3 },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-12"
          >
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.title}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-5 py-5 flex items-center gap-4"
                >
                  <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {perk.title}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
          >
            <h3 className="text-2xl md:text-3xl tracking-tight text-foreground mb-2">
              Interested in Joining Us?
            </h3>
            <p className="text-foreground/70 text-sm lg:text-base mb-6">
              Upload your CV here in confidence and we&apos;ll be in touch.
            </p>
            <CareersForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WhyWorkHere;
