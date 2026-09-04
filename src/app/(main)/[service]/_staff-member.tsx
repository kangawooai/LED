"use client";

import { Button } from "@/components/ui/button";
import { staff } from "@/data/staff";
import { IconArrowLeft, IconPhone } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const StaffMemberPage = () => {
  const params = useParams();
  const slug = params.service as string;
  const member = staff.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div
            className="hero-animate"
            style={{ animationDelay: "0s" }}
          >
            <Link
              href="/meet-the-team"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors mb-8"
            >
              <IconArrowLeft className="size-4" />
              Back to Team
            </Link>
          </div>
          <p
            className="hero-animate text-sm uppercase tracking-widest text-primary font-semibold"
            style={{ animationDelay: "0.1s" }}
          >
            Our Team
          </p>
          <h1
            className="hero-animate mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
            style={{ animationDelay: "0.2s" }}
          >
            {member.name}
          </h1>
        </div>
      </section>

      {/* Profile */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div
              className="hero-animate flex justify-center"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="size-48 md:size-64 rounded-full bg-primary/10 border border-primary/20 overflow-hidden relative">
                <div
                  className="absolute"
                  style={
                    member.slug === "max-young"
                      ? { inset: 0 }
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
                          : "center 20%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="hero-animate bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                About {member.name.split(" ")[0]}
              </h2>
              <div className="text-foreground/70 text-sm lg:text-base leading-relaxed space-y-4">
                {member.bio.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      {member.videos && member.videos.length > 0 && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
            <h2 className="text-2xl md:text-3xl tracking-tight mb-8">
              Video Testimonials
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {member.videos.map((url) => {
                const videoId = url.split("v=")[1]?.split("&")[0];
                return (
                  <div
                    key={videoId}
                    className="aspect-video rounded-md overflow-hidden bg-white/5 border border-white/10"
                  >
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                      title="Video testimonial"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
              <a href="tel:+443330424424">
                <Button size="lg">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaffMemberPage;
