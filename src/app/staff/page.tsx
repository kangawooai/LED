"use client";

import { Button } from "@/components/ui/button";
import { staff } from "@/data/staff";
import { IconPhone } from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const Staff = () => {
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 });

  return (
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            Our Team
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Meet the <span className="text-primary">Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            A dedicated team of marketing specialists working to fill your diary
            every single day. Get to know the people behind your leads.
          </motion.p>
        </div>
      </section>

      {/* Team Grid */}
      <section ref={teamRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {staff.map((member) => (
              <Link key={member.slug} href={`/staff/${member.slug}`}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-5 flex flex-col items-center text-center h-full"
                >
                  <div className="size-32 md:size-40 rounded-full bg-primary/10 border border-primary/20 overflow-hidden mb-4 relative">
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
                  <h3 className="text-sm md:text-base font-semibold tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs md:text-sm text-primary mt-1">
                    {member.role}
                  </p>
                  <p className="text-foreground/70 text-xs md:text-sm mt-2 line-clamp-3">
                    {member.bio}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
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

export default Staff;
