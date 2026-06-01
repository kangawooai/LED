"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NAV_LINKS } from "@/constants";
import {
  IconPhone,
  IconBuildingSkyscraper,
  IconCar,
  IconTool,
  IconSparkles,
  IconCategory,
  IconArrowRight,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const INDUSTRY_LINKS = [
  {
    href: "/construction-and-home-improvements",
    label: "Construction & Home Improvements",
    description: "Plastering, roofing, extensions, and more",
    icon: IconBuildingSkyscraper,
  },
  {
    href: "/motor-trade",
    label: "Motor Trade",
    description: "MOT, servicing, bodywork, and repairs",
    icon: IconCar,
  },
  {
    href: "/trades",
    label: "Trades",
    description: "Electricians, plumbers, locksmiths, and more",
    icon: IconTool,
  },
  {
    href: "/cleaning",
    label: "Cleaning",
    description: "Carpet, window, exterior, and oven cleaning",
    icon: IconSparkles,
  },
  {
    href: "/other-industries",
    label: "Other Industries",
    description: "Beauty, legal, driving, logistics, and beyond",
    icon: IconCategory,
  },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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
              src="/leads-everyday-pos.webp"
              alt="Leads Everyday"
              width={160}
              height={40}
              className="absolute inset-0 h-full w-auto object-contain opacity-100 dark:opacity-0 transition-opacity duration-600"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm text-white bg-transparent hover:bg-white/10 data-popup-open:bg-white/10">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[420px]">
                    <div className="flex flex-col gap-0.5 p-2">
                      {INDUSTRY_LINKS.map((industry) => {
                        const Icon = industry.icon;
                        return (
                          <NavigationMenuLink
                            key={industry.href}
                            href={industry.href}
                            className="flex items-center gap-3 rounded-md p-3 hover:bg-white/5 transition-colors"
                          >
                            <div className="size-9 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <Icon className="size-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {industry.label}
                              </p>
                              <p className="text-xs text-foreground/50">
                                {industry.description}
                              </p>
                            </div>
                          </NavigationMenuLink>
                        );
                      })}
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <NavigationMenuLink
                          href="/services"
                          className="flex items-center gap-2 rounded-md p-3 hover:bg-white/5 transition-colors"
                        >
                          <span className="text-sm font-medium text-primary">
                            View All Services
                          </span>
                          <IconArrowRight className="size-3.5 text-primary" />
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {NAV_LINKS.filter((link) => link.label !== "Services").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white hover:text-primary transition-colors duration-600 px-4 py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <aside className="hidden md:flex items-center">
              <Link href="/book-a-call">
                <Button variant="muted" size="sm" className="px-5">
                  Enquire Now
                </Button>
              </Link>
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

        {/* Mobile menu */}
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
                {/* Services with expandable sub-menu */}
                <button
                  onClick={() => setServicesOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full py-2.5 text-white hover:text-primary transition-colors duration-600 text-left"
                >
                  <span>Services</span>
                  <motion.span
                    animate={{ rotate: servicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconArrowRight className="size-4 rotate-90" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-0.5 pb-2">
                        {INDUSTRY_LINKS.map((industry) => {
                          const Icon = industry.icon;
                          return (
                            <Link
                              key={industry.href}
                              href={industry.href}
                              className="flex items-center gap-3 py-2 text-foreground/70 hover:text-primary transition-colors"
                              onClick={() => setOpen(false)}
                            >
                              <Icon className="size-4 text-primary/70" />
                              <span className="text-sm">{industry.label}</span>
                            </Link>
                          );
                        })}
                        <Link
                          href="/services"
                          className="flex items-center gap-2 py-2 text-primary hover:text-primary/80 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-sm font-medium">View All Services</span>
                          <IconArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Other nav links */}
                {NAV_LINKS.filter((link) => link.label !== "Services").map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2.5 text-white hover:text-primary transition-colors duration-600"
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
