"use client";

import { Button } from "@/components/ui/button";
import { IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const BottomBar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trustpilotRef = useCallback((el: HTMLDivElement | null) => {
    if (el && window.Trustpilot) {
      window.Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-20 2xl:px-0 pb-2">
        <div className="pointer-events-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-4 py-0 flex items-center justify-between shadow-2xl">
          {/* Trustpilot widget */}
          <div className="flex items-center min-w-0">
            {mounted && (
              <div
                ref={trustpilotRef}
                className="trustpilot-widget"
                data-locale="en-US"
                data-template-id="53aa8807dec7e10d38f59f32"
                data-businessunit-id="606ea5a74e740b0001398b05"
                data-style-height="150px"
                data-style-width="100%"
                data-theme="dark"
                data-token="769c3dbc-db9a-4da4-b5a9-9c18f42feece"
                style={{ transformOrigin: "left", transform: "scale(0.75)", marginLeft: "-0.5rem", marginTop: "-0.5rem", marginBottom: "-2.5rem" }}
              >
                <a
                  href="https://www.trustpilot.com/review/leadseveryday.co.uk"
                  target="_blank"
                  rel="noopener"
                >
                  Trustpilot
                </a>
              </div>
            )}
          </div>

          {/* Mobile: Call Now */}
          <a href="tel:+443330424424" className="shrink-0 md:hidden">
            <Button size="sm" className="px-5">
              <IconPhone className="size-4" />
              Call Now
            </Button>
          </a>

          {/* Desktop: text + Enquire Now + or call */}
          <div className="shrink-0 hidden md:flex items-center gap-3">
            <span className="text-2xl font-bold text-white">Begin growing your business today!</span>
            <div className="flex flex-col items-end">
              <Link href="/book-a-call">
                <Button size="sm" className="px-5">
                  Enquire Now
                </Button>
              </Link>
              <span className="text-sm text-foreground/60 mt-1">
                or call{" "}
                <a href="tel:+443330424424" className="text-primary hover:text-primary/80 font-medium">
                  0333 0 424 424
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
