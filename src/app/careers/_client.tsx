"use client";

import CareersForm from "@/components/forms/careers-form";
import { COMPANY } from "@/constants";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  IconCoffee,
  IconBallTennis,
  IconBarbell,
  IconConfetti,
  IconBuildingSkyscraper,
  IconCar,
  IconClock,
  IconShieldCheck,
  IconFriends,
} from "@tabler/icons-react";

const perks = [
  {
    icon: IconCoffee,
    title: "Breakfast",
  },
  {
    icon: IconBallTennis,
    title: "Table Tennis",
  },
  {
    icon: IconBarbell,
    title: "Gym Membership",
  },
  {
    icon: IconFriends,
    title: "Work Outings",
  },
  {
    icon: IconConfetti,
    title: "Christmas Party",
  },
  {
    icon: IconBuildingSkyscraper,
    title: "Picturesque Building & Location",
  },
  {
    icon: IconCar,
    title: "On Site Parking",
  },
  {
    icon: IconClock,
    title: "No Unsociable Hours",
  },
  {
    icon: IconShieldCheck,
    title: "Security & Stability",
  },
];

const WhyWorkHere = () => {
  const { ref: perksRef, visible: perksVisible } = useScrollReveal(0.1);

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold">
            Careers
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            What We Do &{" "}
            <span className="text-primary">Why You Should Too</span>
          </h1>
          <p
            className="hero-animate mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            Be a part of this dynamic business, and feel proud of the part you
            will play in building a more prosperous Britain, for you and for
            our customers.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div
              className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                Who We Are
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  For over 10 years we have been generating leads every day for
                  tradespeople. From MOT stations to tree surgeons, electricians
                  and roofers, whatever your trade, we&apos;ve got it covered.
                </p>
                <p>
                  All the leads we generate are unique and go directly to our
                  customers. It&apos;s pay as you go, so they can leave anytime,
                  but why would they? Our family-run business has and continues
                  to generate thousands of leads every month from people who need
                  tradesmen&apos;s services right now.
                </p>
              </div>
            </div>

            <div
              className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                Why Join Us
              </h2>
              <div className="space-y-4 text-foreground/70 text-sm lg:text-base">
                <p>
                  We don&apos;t take a cut, it&apos;s one affordable payment
                  per month and we&apos;ve helped grow thousands of businesses
                  all over the UK. If you want to know what our customers think,
                  just check us out on{" "}
                  <a
                    href="https://www.trustpilot.com/review/leadseveryday.co.uk"
                    target="_blank"
                    rel="noopener"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Trustpilot
                  </a>
                  .
                </p>
                <p>
                  Work is only work when you don&apos;t enjoy it or don&apos;t
                  feel you have a career path. We recognise and reward people who
                  show potential and create a work environment that makes you
                  feel good every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section ref={perksRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <p
            className={`scroll-fade-in${perksVisible ? " visible" : ""} text-sm uppercase tracking-widest text-primary font-semibold text-center`}
          >
            Our Perks
          </p>
          <h2
            className={`scroll-fade-in${perksVisible ? " visible" : ""} text-4xl md:text-5xl tracking-tight text-foreground text-center mt-3`}
            style={{ transitionDelay: "0.1s" }}
          >
            What You Get
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-12">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className={`scroll-fade-in${perksVisible ? " visible" : ""} bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-5 py-5 flex items-center gap-4`}
                  style={{ transitionDelay: `${0.3 + index * 0.07}s` }}
                >
                  <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {perk.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="w-full mb-28 px-4 md:px-0 lg:px-20 2xl:px-0">
        <div className="max-w-2xl mx-auto">
          <div className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8">
            <h3 className="text-2xl md:text-3xl tracking-tight text-foreground mb-2">
              Interested in Joining Us?
            </h3>
            <p className="text-foreground/70 text-sm lg:text-base mb-6">
              Upload your CV here in confidence and we&apos;ll be in touch.
            </p>
            <CareersForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyWorkHere;
