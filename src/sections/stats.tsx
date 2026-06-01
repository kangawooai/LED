"use client";

import { STATS } from "@/constants";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Stats = () => {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <section ref={ref} className="hidden md:block w-full py-4 -mt-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
        <div
          className={`scroll-fade-in${visible ? " visible" : ""} grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-left md:text-center`}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground mt-1">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
