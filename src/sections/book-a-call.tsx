"use client";

import { BookACallForm } from "@/components/book-a-call-form";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { IconChartBar, IconClock, IconUserCheck } from "@tabler/icons-react";

const points = [
  { icon: IconChartBar, title: "Free lead forecast", desc: "Exactly how many leads to expect for your trade and area." },
  { icon: IconClock, title: "Callback within 24 hours", desc: "At a time that suits you — quick and easy." },
  { icon: IconUserCheck, title: "No obligation", desc: "No hard sell, no contracts. Just a straightforward chat." },
];

const BookACallSection = () => {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <section id="book-a-call" ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className={`scroll-fade-in${visible ? " visible" : ""}`}>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">
              Book a Free Call
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl tracking-tight">
              See how many <span className="text-primary">leads</span> we can
              deliver
            </h2>
            <p className="mt-4 max-w-xl text-foreground/70 text-sm lg:text-base">
              Tell us about your business and we&apos;ll show you exactly how many
              leads we can bring you. No obligation, no hard sell.
            </p>

            <ul className="mt-8 space-y-5">
              {points.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.title} className="flex items-start gap-4">
                    <div className="size-10 shrink-0 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{p.title}</p>
                      <p className="text-foreground/70 text-sm">{p.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Form */}
          <div
            className={`scroll-fade-in${visible ? " visible" : ""}`}
            style={{ transitionDelay: "0.15s" }}
          >
            <BookACallForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookACallSection;
