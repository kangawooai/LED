"use client";

import { BookACallForm } from "@/components/book-a-call-form";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Reviews from "@/sections/reviews";
import Cta from "@/sections/cta";
import {
  IconBan,
  IconCheck,
  IconLink,
  IconPhone,
  IconSettings,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";
import Link from "next/link";

const extras = [
  {
    icon: IconWorld,
    tag: "Free",
    title: "Website",
    description:
      "A professional, mobile-optimised website built for your trade and designed to turn visitors into enquiries.",
  },
  {
    icon: IconSettings,
    tag: "Free",
    title: "Ad Setup",
    description:
      "We build and launch your Google Ads campaign for you, targeting the right customers in your area.",
  },
  {
    icon: IconUser,
    tag: "Dedicated",
    title: "Account Manager",
    description:
      "One named contact who knows your business, keeps you updated and optimises your campaign.",
  },
  {
    icon: IconPhone,
    tag: "Free",
    title: "Tracking Number",
    description:
      "A dedicated call tracking number so you can see exactly which calls your campaign brings in.",
  },
  {
    icon: IconLink,
    tag: "Free",
    title: "Domain",
    description:
      "We register a domain name for your website, so you look established from day one.",
  },
  {
    icon: IconBan,
    tag: "No",
    title: "Setup Fee",
    description:
      "Nothing to pay upfront to get started. No hidden costs, just one simple monthly fee.",
  },
];

const included = [
  "Exclusive leads, never shared or resold",
  "No commission on your jobs, ever",
  "Most clients see their first leads within 24 hours",
];

const BlackFriday = () => {
  const { ref: extrasRef, visible: extrasVisible } = useScrollReveal(0.15);
  const { ref: formRef, visible: formVisible } = useScrollReveal(0.15);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-12 md:pb-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
              Special Black Friday Offer
            </p>
            <span
              className="hero-animate -rotate-3 rounded-sm bg-primary px-2.5 py-0.5 text-sm font-extrabold uppercase tracking-wide text-primary-foreground"
              style={{ animationDelay: "0.05s" }}
            >
              Sale
            </span>
          </div>

          <h1
            className="hero-animate mt-4 text-4xl md:text-6xl lg:text-7xl tracking-tight font-bold leading-[1.05]"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="block text-primary">Leads</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium uppercase tracking-[0.2em] mt-2">
              for your business
            </span>
            <span className="block mt-4">
              <span className="text-primary">6 Free</span> Extras
            </span>
          </h1>

          <p
            className="hero-animate mt-5 text-lg md:text-xl uppercase tracking-[0.2em] text-foreground/80"
            style={{ animationDelay: "0.2s" }}
          >
            Just one monthly fee
          </p>

          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.25s" }}
          >
            Sign up this Black Friday and we&apos;ll throw in everything you
            need to start winning customers: your website, domain, ad setup,
            call tracking and a dedicated account manager, with no setup fee.
          </p>

          <div
            className="hero-animate mt-8 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="#claim">
              <Button size="lg">Claim the Offer</Button>
            </Link>
            <span className="text-sm text-foreground/60">
              or call{" "}
              <a
                href="tel:+443330424424"
                className="text-primary hover:text-primary/80 font-medium"
              >
                0333 0 424 424
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* The 6 extras */}
      <section ref={extrasRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p
            className={`scroll-fade-in${extrasVisible ? " visible" : ""} text-sm uppercase tracking-widest text-primary font-semibold text-center`}
          >
            What&apos;s Included
          </p>
          <h2
            className={`scroll-fade-in${extrasVisible ? " visible" : ""} text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3`}
            style={{ transitionDelay: "0.1s" }}
          >
            Your 6 Free Extras
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 md:mt-12">
            {extras.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`scroll-fade-in${extrasVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-6 lg:px-8 lg:py-8`}
                  style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="size-12 rounded-md bg-primary flex items-center justify-center mb-5">
                    <Icon className="size-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl md:text-2xl tracking-tight font-bold uppercase leading-tight">
                    <span className="block text-primary text-base md:text-lg">
                      {item.tag}
                    </span>
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 mt-3 text-sm lg:text-[15px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Claim form */}
      <section id="claim" ref={formRef} className="py-20 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`scroll-fade-in${formVisible ? " visible" : ""}`}>
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">
                Claim Your Extras
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl tracking-tight">
                More <span className="text-primary">Leads.</span> More{" "}
                <span className="text-primary">Customers.</span> More{" "}
                <span className="text-primary">Profit.</span>
              </h2>
              <p className="mt-4 max-w-xl text-foreground/70 text-sm lg:text-base">
                Leave your details and we&apos;ll call you back to show you how
                many leads we can deliver for your trade, and get your free
                extras set up.
              </p>

              <ul className="mt-8 space-y-4">
                {included.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="size-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <IconCheck className="size-3.5 text-primary" />
                    </span>
                    <span className="text-foreground/80 text-sm lg:text-base">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`scroll-fade-in${formVisible ? " visible" : ""}`}
              style={{ transitionDelay: "0.15s" }}
            >
              <BookACallForm defaultUtm={{ utm_campaign: "black-friday" }} />
            </div>
          </div>
        </div>
      </section>

      <Reviews />

      <Cta />
    </div>
  );
};

export default BlackFriday;
