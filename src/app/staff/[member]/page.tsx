"use client";

import { Button } from "@/components/ui/button";
import { staff } from "@/data/staff";
import { IconArrowLeft, IconPhone } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const StaffMemberPage = () => {
  const params = useParams();
  const slug = params.member as string;
  const member = staff.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/staff"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors mb-8"
            >
              <IconArrowLeft className="size-4" />
              Back to Team
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            {member.role}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            {member.name}
          </motion.h1>
        </div>
      </section>

      {/* Profile */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="flex justify-center"
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
                    style={
                      member.slug === "max-young"
                        ? { objectPosition: "center -15%" }
                        : { objectPosition: "center 20%" }
                    }
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 lg:p-8"
            >
              <h2 className="text-2xl md:text-3xl tracking-tight mb-2">
                About {member.name.split(" ")[0]}
              </h2>
              <p className="text-sm text-primary font-semibold mb-4">
                {member.role}
              </p>
              <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

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
