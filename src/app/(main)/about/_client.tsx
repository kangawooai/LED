"use client";

import { Button } from "@/components/ui/button";
import { COMPANY, STATS } from "@/constants";
import { staff } from "@/data/staff";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  IconPhone,
  IconTarget,
  IconUsers,
  IconTrendingUp,
  IconShieldCheck,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import Reviews from "@/sections/reviews";

const values = [
  {
    icon: IconTarget,
    title: "Results First",
    description:
      "We tell you how many leads to expect before you start. No guesswork, no empty promises, just clear forecasts backed by data.",
  },
  {
    icon: IconShieldCheck,
    title: "No Commission, Ever",
    description:
      "You pay a flat monthly fee. Every lead is 100% yours. We never take a cut of your jobs or earnings.",
  },
  {
    icon: IconUsers,
    title: "Exclusive Leads",
    description:
      "Your leads are never shared or resold. When a customer enquires, they're contacting you and only you.",
  },
  {
    icon: IconTrendingUp,
    title: "Proven at Scale",
    description:
      "With over 15,000 campaigns and 60+ industries, we've refined a system that works for trades businesses of every size.",
  },
];

const About = () => {
  const { ref: valuesRef, visible: valuesVisible } = useScrollReveal(0.2);
  const { ref: teamRef, visible: teamVisible } = useScrollReveal(0.1);

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
            About Us
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            We Help Tradespeople{" "}
            <span className="text-primary">Grow</span>
          </h1>
          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            {COMPANY.name} was built with one goal: give tradespeople a
            reliable, honest way to get more customers. No commissions, no
            shared leads, no long contracts. Just real enquiries from real
            people who need your services.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div
              className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  We started because we saw an industry full of broken promises.
                  Lead generation companies charging commission, sharing leads
                  between competitors, and locking businesses into contracts with
                  no results.
                </p>
                <p>
                  We knew there was a better way. We build bespoke landing pages
                  for each trade, run targeted Google Ads, and deliver leads
                  directly to our clients. No middlemen, no sharing, no
                  commission.
                </p>
                <p>
                  Today, we work with over 1,000 businesses across 60+ industries
                  and have delivered tens of thousands of leads. Our clients stay
                  because the results speak for themselves.
                </p>
              </div>
            </div>

            <div
              className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                How It Works
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  We build you a professional, mobile-optimised landing page
                  tailored to your trade. Then we run targeted Google Ads so that
                  when someone in your area searches for your service, they find
                  your page first.
                </p>
                <p>
                  The customer fills in an enquiry form or calls you directly.
                  You get the lead instantly, name, number, what they need, and
                  where they are. No chasing, no cold calls, just warm
                  enquiries.
                </p>
                <p>
                  We monitor and optimise your campaign daily to keep leads
                  flowing and costs down. Most clients see their first leads
                  within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-left md:text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero-animate">
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

      {/* Values */}
      <section ref={valuesRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p
            className={`scroll-fade-in${valuesVisible ? " visible" : ""} text-sm uppercase tracking-widest text-primary font-semibold text-center`}
          >
            Why Choose Us
          </p>
          <h2
            className={`scroll-fade-in${valuesVisible ? " visible" : ""} text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3`}
            style={{ transitionDelay: "0.1s" }}
          >
            Built Different
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mt-8 md:mt-12">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`scroll-fade-in${valuesVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-6 py-6 lg:px-8 lg:py-8`}
                  style={{ transitionDelay: `${0.3 + index * 0.15}s` }}
                >
                  <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="size-5 text-primary" />
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

      {/* Team */}
      <section ref={teamRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p
            className={`scroll-fade-in${teamVisible ? " visible" : ""} text-sm uppercase tracking-widest text-primary font-semibold text-center`}
          >
            Our Team
          </p>
          <h2
            className={`scroll-fade-in${teamVisible ? " visible" : ""} text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3`}
            style={{ transitionDelay: "0.1s" }}
          >
            The People Behind Your Leads
          </h2>
          <p
            className={`scroll-fade-in${teamVisible ? " visible" : ""} text-foreground/70 text-sm lg:text-base text-center mt-4 max-w-2xl mx-auto`}
            style={{ transitionDelay: "0.15s" }}
          >
            A dedicated team of marketing specialists working to fill your diary
            every single day.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 md:mt-12">
            {staff.map((member, index) => (
              <Link key={member.slug} href={`/${member.slug}`}>
                <div
                  className={`scroll-fade-in${teamVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 flex flex-col items-center text-center h-full`}
                  style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="size-32 md:size-40 rounded-full bg-primary/10 border border-primary/20 overflow-hidden mb-4 relative">
                    <div
                      className="absolute"
                      style={
                        member.slug === "max-young"
                          ? { inset: 0 }
                          : member.slug === "maximilian-filipowicz"
                            ? { inset: "-25%", top: "-10%", left: "-15%" }
                            : { inset: "-25%", top: "-10%" }
                      }
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        style={{
                          objectPosition:
                            member.slug === "max-young"
                              ? "center -15%"
                              : member.slug === "maximilian-filipowicz"
                                ? "75% 20%"
                                : "center 20%",
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold tracking-tight">
                    {member.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <Reviews />

      {/* CTA */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
          <div className="flex flex-col items-center p-4 md:p-4 w-full">
            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
              Ready to Work With Us?
            </h3>
            <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
              Book a free call and we&apos;ll show you exactly how many leads we
              can deliver for your trade.
            </p>
            <div className="mt-6">
              <Link href="/book-a-call">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Book a Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
