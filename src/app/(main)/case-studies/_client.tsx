"use client";

import { Button } from "@/components/ui/button";
import { COMPANY } from "@/constants";
import { caseStudies } from "@/data/case-studies";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { IconArrowRight, IconCheck, IconPhone } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import Reviews from "@/sections/reviews";

const CaseStudies = () => {
  const { ref: studiesRef, visible: studiesVisible } = useScrollReveal(0.1);

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
            Case Studies
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Real Results From{" "}
            <span className="text-primary">Real Businesses</span>
          </h1>
          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            See how businesses across the UK are using {COMPANY.name} to fill
            their diaries and grow. No fluff, just the numbers.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section ref={studiesRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="flex flex-col gap-4">
            {caseStudies.map((study, index) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`}>
                <div
                  className={`scroll-fade-in${studiesVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden group`}
                  style={{ transitionDelay: `${0.1 + index * 0.15}s` }}
                >
                  {study.image && (
                    <div className="relative h-52 md:h-64 overflow-hidden">
                      <Image
                        src={study.image}
                        alt=""
                        fill
                        sizes="(max-width: 1280px) 100vw, 1120px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                        {study.industry}
                      </span>
                      <h2 className="text-2xl md:text-3xl tracking-tight mt-2 group-hover:text-primary transition-colors">
                        {study.business}
                      </h2>
                      <p className="text-lg tracking-tight text-foreground/90 mt-2">
                        {study.headline}
                      </p>
                      <p className="text-foreground/70 text-sm lg:text-[15px] mt-4">
                        {study.summary}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mt-6">
                        {study.metrics.map((metric) => (
                          <div key={metric.label}>
                            <p className="text-2xl tracking-tight text-primary">
                              {metric.value}
                            </p>
                            <p className="text-xs text-foreground/60 mt-1 leading-snug">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider mb-3">
                        Key Results
                      </h3>
                      <ul className="space-y-2">
                        {study.keyResults.slice(0, 6).map((result) => (
                          <li
                            key={result}
                            className="flex items-start gap-2 text-sm lg:text-[15px]"
                          >
                            <IconCheck className="size-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{result}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-6">
                        Read the full case study
                        <IconArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      {/* CTA */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Ready to Become Our Next Case Study?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Book a free call and we&apos;ll show you exactly how many leads we
              can deliver for your trade.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="tel:+443330424424">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
              <Link href="/book-a-call">
                <Button size="lg" variant="muted">
                  Book a Free Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
