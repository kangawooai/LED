"use client";

import RichText from "@/components/common/rich-text";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/data/case-studies";
import { IconArrowLeft, IconCheck, IconPhone, IconQuote } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const CaseStudyPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="hero-animate">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors mb-8"
            >
              <IconArrowLeft className="size-4" />
              Back to Case Studies
            </Link>
          </div>
          <p
            className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold"
            style={{ animationDelay: "0.1s" }}
          >
            {study.industry}
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.2s" }}
          >
            {study.business}
          </h1>
          <p
            className="hero-animate mt-4 max-w-3xl text-xl md:text-2xl tracking-tight text-primary"
            style={{ animationDelay: "0.25s" }}
          >
            {study.headline}
          </p>
        </div>
      </section>

      {study.image && (
        <section className="pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
            <div
              className="hero-animate relative aspect-video rounded-md overflow-hidden border border-white/10 max-w-4xl"
              style={{ animationDelay: "0.28s" }}
            >
              <Image
                src={study.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Headline metrics */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {study.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 text-center"
                style={{ animationDelay: `${0.3 + index * 0.08}s` }}
              >
                <span className="text-3xl md:text-4xl tracking-tight text-primary">
                  {metric.value}
                </span>
                <p className="text-foreground/70 text-sm mt-2">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8">
              <RichText content={study.intro} />

              <h2 className="text-xl lg:text-2xl tracking-tight text-foreground mt-10 mb-4">
                The Challenge
              </h2>
              <RichText content={study.challenge} />

              <h2 className="text-xl lg:text-2xl tracking-tight text-foreground mt-10 mb-4">
                The Solution
              </h2>
              <RichText content={study.solution} />

              <h2 className="text-xl lg:text-2xl tracking-tight text-foreground mt-10 mb-4">
                The Results
              </h2>
              <RichText content={study.results} />

              {study.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl lg:text-2xl tracking-tight text-foreground mt-10 mb-4">
                    {section.heading}
                  </h2>
                  <RichText content={section.body} />
                  {section.bullets && (
                    <ul className="space-y-2 mt-4">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-foreground/70 text-sm lg:text-base"
                        >
                          <IconCheck className="size-4 text-primary shrink-0 mt-1" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {study.quote && (
                <div className="bg-white/5 border border-white/10 rounded-md p-6 mt-10">
                  <IconQuote className="size-5 text-primary/40 mb-3" />
                  <p className="text-foreground/90 text-base lg:text-lg italic leading-relaxed">
                    &ldquo;{study.quote.text}&rdquo;
                  </p>
                  <p className="text-foreground/50 text-sm mt-3">
                    {study.quote.attribution}
                  </p>
                </div>
              )}
            </div>

            {/* Key results */}
            <aside className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8 lg:sticky lg:top-28">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Key Results
              </h2>
              <ul className="space-y-3">
                {study.keyResults.map((result) => (
                  <li
                    key={result}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <IconCheck className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Could Your Business Be Next?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              We help trades and automotive businesses across the UK generate
              exclusive, high-quality leads designed to support real,
              measurable growth.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="tel:+443330424424">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call 0333 0 424 424
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

export default CaseStudyPage;
