"use client";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants";
import { IconPhone } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="fixed top-0 z-[100] w-full bg-background/70 backdrop-blur-xl border-b border-white/10 transition-colors duration-600 pt-[env(safe-area-inset-top)]"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="relative h-7.5 md:h-9 w-[150px] md:w-[175px]">
            <Image
              src="/leads-everyday-neg.webp"
              alt="Leads Everyday"
              width={160}
              height={40}
              className="absolute inset-0 h-full w-auto object-contain opacity-0 dark:opacity-100 transition-opacity duration-600"
              priority
            />
            <Image
              src="/leads-everyday-pos.png"
              alt="Leads Everyday"
              width={160}
              height={40}
              className="absolute inset-0 h-full w-auto object-contain opacity-100 dark:opacity-0 transition-opacity duration-600"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-primary transition-colors duration-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <aside className="hidden md:flex items-center">
              <a href="tel:+443330424424">
                <Button variant="muted" size="sm" className="px-5">
                  <IconPhone className="size-4" />
                  Call Now
                </Button>
              </a>
            </aside>

            <aside className="md:hidden">
              <motion.button
                initial="hide"
                animate={open ? "show" : "hide"}
                onClick={toggleMenu}
                className="flex flex-col space-y-1.5 h-10 w-10 items-center justify-center"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <motion.span
                  variants={{
                    hide: { rotate: 0 },
                    show: { rotate: 45, y: 4 },
                  }}
                  className="w-5 bg-foreground h-[2px] block transition-colors duration-600"
                />
                <motion.span
                  variants={{
                    hide: { rotate: 0 },
                    show: { rotate: -45, y: -4 },
                  }}
                  className="w-5 bg-foreground h-[2px] block transition-colors duration-600"
                />
              </motion.button>
            </aside>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden md:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2.5 text-foreground/80 hover:text-primary transition-colors duration-600"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3">
                  <a href="tel:+443330424424" onClick={() => setOpen(false)}>
                    <Button variant="muted" className="w-full">
                      <IconPhone className="size-4" />
                      Call Now
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navigation;
