"use client";

import { SERVICES } from "@/constants";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  IconTarget,
  IconSend,
  IconUserCheck,
  IconChartBar,
} from "@tabler/icons-react";

const serviceIcons = [IconTarget, IconSend, IconUserCheck, IconChartBar];

const Features = () => {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <section id="features-section" ref={ref} className="w-full py-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-0 lg:px-20 2xl:px-0">
        <p
          className={`scroll-fade-in${visible ? " visible" : ""} text-sm uppercase tracking-widest text-primary font-semibold text-center`}
        >
          What We Do
        </p>
        <h2
          className={`scroll-fade-in${visible ? " visible" : ""} text-4xl md:text-5xl tracking-tight text-foreground w-full text-center mt-3`}
          style={{ transitionDelay: "0.1s" }}
        >
          Lead Generation That Delivers Results
        </h2>
        <p
          className={`scroll-fade-in${visible ? " visible" : ""} text-foreground/70 text-sm lg:text-base text-center mt-4 max-w-2xl mx-auto`}
          style={{ transitionDelay: "0.15s" }}
        >
          We use proven strategies, data-driven targeting and multi-channel
          outreach to deliver high-quality leads that convert.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8 md:mt-12">
          {SERVICES.map((item, index) => {
            const Icon = serviceIcons[index];
            return (
              <div
                key={item.title}
                className={`scroll-fade-in${visible ? " visible" : ""} w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-6 lg:px-8 lg:py-8`}
                style={{ transitionDelay: `${0.3 + index * 0.15}s` }}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
