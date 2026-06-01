"use client";

import { STATS } from "@/constants";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const SocialProof = () => {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <section ref={ref} className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 md:px-12 xl:px-0">
        <div
          className={`scroll-fade-in${visible ? " visible" : ""} text-center mb-8`}
        >
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
            Trusted by thousands of UK businesses
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`scroll-fade-in${visible ? " visible" : ""} text-center`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
