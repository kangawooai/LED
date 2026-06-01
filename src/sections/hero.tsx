"use client";

import { Button } from "@/components/ui/button";
import { STATS } from "@/constants";
import { IconPhone, IconPlayerPlayFilled, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const YOUTUBE_VIDEO_ID = "HNWbRc7WZJw";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trustpilotRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-svh md:min-h-0">
      {/* Mobile: centered background image with top/left/bottom fade */}
      <div
        className="absolute top-[15%] bottom-1/4 left-1/3 -right-1/4 md:hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, white 25%, white 50%, transparent 90%), linear-gradient(to right, transparent 10%, white 60%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, white 25%, white 50%, transparent 90%), linear-gradient(to right, transparent 10%, white 60%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in" as unknown as string,
        }}
      >
        <Image
          src="/hero-video.webp"
          alt="Tradesperson at work"
          fill
          className="object-cover"
          style={{ objectPosition: "75% center" }}
          priority
          quality={35}
          sizes="100vw"
        />
      </div>

      {/* Desktop: background image clipped to container with fades */}
      <div
        className={`absolute inset-y-0 hidden md:block transition-opacity duration-500 ${videoOpen ? "opacity-0" : "opacity-100"}`}
        style={{
          left: "max(0px, calc(50% - 60rem))",
          right: "max(0px, calc(50% - 40rem))",
          maskImage: "linear-gradient(to bottom, white 60%, transparent 100%), linear-gradient(to left, transparent 0rem, white 12rem)",
          WebkitMaskImage: "linear-gradient(to bottom, white 60%, transparent 100%), linear-gradient(to left, transparent 0rem, white 12rem)",
          maskComposite: "intersect",
          WebkitMaskComposite: "destination-in",
        }}
      >
        <Image
          src="/hero-video.webp"
          alt="Tradesperson at work"
          fill
          className="object-cover object-right-top"
          priority
          quality={60}
          sizes="(max-width: 768px) 0px, 100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--background) 30%, rgba(0,0,0,0.5) 50%, transparent 75%)" }} />
      </div>

      {/* Desktop play button — centered in right half of the container */}
      {!videoOpen && (
        <div className="absolute inset-0 z-20 hidden md:block pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0 h-full relative">
            <button
              onClick={() => setVideoOpen(true)}
              className="hero-animate absolute top-1/2 right-0 -translate-y-1/2 translate-x-[-50%] pointer-events-auto flex items-center justify-center cursor-pointer group"
              style={{ animationDelay: "1.1s", right: "25%" }}
              aria-label="Play video"
            >
              <span className="absolute size-24 rounded-full bg-primary/20 animate-ping" />
              <span className="absolute size-20 rounded-full bg-primary/30 animate-pulse" />
              <span className="relative size-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <IconPlayerPlayFilled className="size-7 text-white ml-0.5" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Inline video player — covers the hero section */}
      {videoOpen && (
        <div className="absolute inset-0 top-20 z-30 bg-background flex items-center justify-center">
          <div className="w-full h-full max-w-6xl mx-auto flex items-center px-6 lg:px-20 relative">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 lg:right-20 z-10 size-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close video"
            >
              <IconX className="size-5" />
            </button>
            <div className="w-full aspect-video rounded-md overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                title="Leads Everyday — How It Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0 pt-24 md:pt-40 pb-8 md:pb-20 transition-opacity duration-500 ${videoOpen ? "md:opacity-0 md:pointer-events-none" : ""}`}>
        <div className="flex flex-col items-start max-w-2xl">
          <p
            className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold"
            style={{ animationDelay: "0.3s" }}
          >
            Premium Lead Generation Services
          </p>

          <h1
            className="hero-animate mt-4 text-3xl leading-9 md:text-5xl lg:text-6xl tracking-tight lg:leading-14"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="block md:inline">More Leads.</span>{" "}
            <span className="block md:inline">More Customers.</span>{" "}
            <span className="block md:inline text-primary">More Profit.</span>
          </h1>

          <p
            className="hero-animate mt-4 w-1/2 text-foreground/70 text-sm lg:text-base"
            style={{ animationDelay: "0.7s" }}
          >
            We deliver high-quality, unique leads for tradespeople across the
            UK. Let us chase the customers so you can make the money.
          </p>

          <div
            className="hero-animate flex flex-row items-center gap-4 mt-8"
            style={{ animationDelay: "0.9s" }}
          >
            {/* Mobile: Call Now + Enquire Now */}
            <a href="tel:+443330424424" className="md:hidden">
              <Button size="default">
                <IconPhone className="size-4" />
                Call Now
              </Button>
            </a>
            <Link href="/book-a-call" className="md:hidden">
              <Button variant="muted" size="default">
                Enquire Now
              </Button>
            </Link>

            {/* Desktop: Enquire Now + or call text */}
            <Link href="/book-a-call" className="hidden md:block">
              <Button size="default">
                Enquire Now
              </Button>
            </Link>
            <span className="hidden md:inline text-sm text-foreground/60">
              or call{" "}
              <a href="tel:+443330424424" className="text-primary hover:text-primary/80 font-medium">
                0333 0 424 424
              </a>
            </span>
          </div>

          {/* Mobile: play button */}
          <div
            className="hero-animate mt-8 md:hidden"
            style={{ animationDelay: "1.1s" }}
          >
            <button
              onClick={() => setVideoOpen(true)}
              className="flex items-center gap-3 mb-6 group cursor-pointer"
              aria-label="Play video"
            >
              <span className="relative size-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <IconPlayerPlayFilled className="size-5 text-white ml-0.5" />
              </span>
              <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                Watch how it works
              </span>
            </button>
          </div>

          {/* Mobile stats */}
          <div
            className="hero-animate grid grid-cols-2 gap-4 md:hidden"
            style={{ animationDelay: "1.2s" }}
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
            ))}
          </div>

          {mounted && (
            <div
              className="hero-animate hidden md:block"
              style={{ animationDelay: "1.3s" }}
            >
              <div
                ref={trustpilotRef}
                className="trustpilot-widget md:![transform:scale(0.7425)] md:![margin-left:-1rem] md:![margin-top:0]"
                data-locale="en-US"
                data-template-id="53aa8807dec7e10d38f59f32"
                data-businessunit-id="606ea5a74e740b0001398b05"
                data-style-height="150px"
                data-style-width="100%"
                data-theme="dark"
                data-token="769c3dbc-db9a-4da4-b5a9-9c18f42feece"
                style={{ transformOrigin: "left", transform: "scale(0.635)", marginLeft: "-1rem", marginTop: "-1rem" }}
              >
                <a
                  href="https://www.trustpilot.com/review/leadseveryday.co.uk"
                  target="_blank"
                  rel="noopener"
                >
                  Trustpilot
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
