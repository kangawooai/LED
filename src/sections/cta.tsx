"use client";

import { Button } from "@/components/ui/button";
import { IconPhone } from "@tabler/icons-react";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="w-full my-28 px-4 md:px-0 lg:px-20 2xl:px-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center pt-12 pb-12 md:px-12 2xl:px-28 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
        <div className="flex flex-col items-center p-4 md:p-4 w-full">
          <h3 className="text-3xl md:text-5xl tracking-tight text-foreground w-full text-center">
            Ready to Get More Leads, Everyday?
          </h3>

          <p className="mt-4 max-w-prose tracking-tight text-balance text-foreground/70 text-sm lg:text-base text-center">
            Let&apos;s talk about how we can help you grow your business.
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
  );
};

export default Cta;
