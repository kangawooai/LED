"use client";

import { TRUST_LOGOS } from "@/constants";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const TrustLogos = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-widest text-foreground/50 font-semibold text-center"
        >
          Trusted by Trades & Home Service Businesses Across the UK
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-8"
        >
          {TRUST_LOGOS.map((logo) => (
            <span
              key={logo}
              className="text-sm md:text-base font-semibold text-foreground/30 tracking-wide"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustLogos;
