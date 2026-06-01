"use client";

import { TRUST_LOGOS } from "@/constants";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const TrustLogos = () => {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <section ref={ref} className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0">
        <p
          className={`scroll-fade-in${visible ? " visible" : ""} text-xs uppercase tracking-widest text-foreground/50 font-semibold text-center`}
        >
          Trusted by Trades & Home Service Businesses Across the UK
        </p>
        <div
          className={`scroll-fade-in${visible ? " visible" : ""} flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-8`}
          style={{ transitionDelay: "0.1s" }}
        >
          {TRUST_LOGOS.map((logo) => (
            <span
              key={logo}
              className="text-sm md:text-base font-semibold text-foreground/30 tracking-wide"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
