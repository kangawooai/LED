"use client";

import { SERVICES } from "@/constants";
import {
  IconTarget,
  IconSend,
  IconUserCheck,
  IconChartBar,
} from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const serviceIcons = [IconTarget, IconSend, IconUserCheck, IconChartBar];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features-section" ref={ref} className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm uppercase tracking-widest text-primary font-semibold text-center"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-4xl md:text-5xl tracking-tight text-foreground w-full text-center mt-3"
        >
          Lead Generation That Delivers Results
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="text-foreground/70 text-sm lg:text-base text-center mt-4 max-w-2xl mx-auto"
        >
          We use proven strategies, data-driven targeting and multi-channel
          outreach to deliver high-quality leads that convert.
        </motion.p>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8 md:mt-12"
        >
          {SERVICES.map((item, index) => {
            const Icon = serviceIcons[index];
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-6 lg:px-8 lg:py-8"
              >
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
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
  );
};

export default Features;
