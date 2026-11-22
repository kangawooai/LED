"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Turn the site-wide Black Friday banner and pre-footer block on or off. */
export const BLACK_FRIDAY_PROMO_ACTIVE = true;

const OFFER_HREF = "/black-friday";

const EXTRAS = [
  "Free Website",
  "Free Ad Setup",
  "Dedicated Account Manager",
  "Free Tracking Number",
  "Free Domain",
  "No Setup Fee",
];

/** Thin strip shown above the main navigation, inside the fixed header. */
export function BlackFridayBanner() {
  if (!BLACK_FRIDAY_PROMO_ACTIVE) return null;

  return (
    <Link
      href={OFFER_HREF}
      className="group flex h-9 items-center justify-center gap-2 bg-primary px-4 text-primary-foreground text-xs sm:text-sm font-semibold tracking-wide"
    >
      <span className="hidden sm:inline rounded-sm bg-black/80 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-white">
        Black Friday
      </span>
      <span className="sm:hidden uppercase">Black Friday:</span>
      <span className="truncate">
        6 free extras, just one monthly fee
      </span>
      <span className="flex items-center gap-1 underline-offset-2 group-hover:underline whitespace-nowrap">
        <span className="hidden sm:inline">Claim the offer</span>
        <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/** Spacer matching the banner height, so page content clears the taller fixed header. */
export function BlackFridayBannerSpacer() {
  if (!BLACK_FRIDAY_PROMO_ACTIVE) return null;
  return <div aria-hidden className="h-9" />;
}

/** Promo block shown above the footer on every page except the offer page itself. */
export function BlackFridayCta() {
  const pathname = usePathname();
  if (!BLACK_FRIDAY_PROMO_ACTIVE || pathname === OFFER_HREF) return null;

  return (
    <section className="w-full px-4 md:px-6 lg:px-20 2xl:px-0 pb-20">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-md border border-primary/30 bg-white/5 backdrop-blur-md px-6 py-10 md:px-12 md:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/25 blur-[100px]"
        />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">
                Special Black Friday Offer
              </p>
              <span className="-rotate-3 rounded-sm bg-primary px-2 py-0.5 text-xs font-extrabold uppercase text-primary-foreground">
                Sale
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl tracking-tight font-bold leading-tight">
              <span className="text-primary">6 Free</span> Extras
            </h2>
            <p className="mt-2 text-sm md:text-base uppercase tracking-[0.2em] text-foreground/80">
              Just one monthly fee
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link href={OFFER_HREF}>
                <Button size="lg">
                  Claim the Offer
                  <IconArrowRight className="size-4" />
                </Button>
              </Link>
              <span className="text-sm text-foreground/60">
                or call{" "}
                <a
                  href="tel:+443330424424"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  0333 0 424 424
                </a>
              </span>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXTRAS.map((extra) => (
              <li
                key={extra}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="size-6 shrink-0 rounded-sm bg-primary flex items-center justify-center">
                  <IconCheck className="size-3.5 text-primary-foreground" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-tight">
                  {extra}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
