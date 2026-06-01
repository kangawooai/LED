"use client";

import { COMPANY, SOCIAL_LINKS } from "@/constants";
import { useCookieConsent } from "@/contexts/cookie-consent";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const footerNav = [
  { title: "Services", href: "/services" },
  { title: "About Us", href: "/about" },
  { title: "FAQs", href: "/faqs" },
  { title: "Book a Call", href: "/book-a-call" },
  { title: "Careers", href: "/careers" },
];

const serviceCategories = [
  { title: "Construction & Home", href: "/construction-and-home-improvements" },
  { title: "Motor Trade", href: "/motor-trade" },
  { title: "Trades", href: "/trades" },
  { title: "Cleaning", href: "/cleaning" },
  { title: "Other Industries", href: "/other-industries" },
];

const Footer = () => {
  const { openBanner } = useCookieConsent();

  return (
    <footer className="w-full border-t border-white/10 pt-12 pb-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="relative block h-8 w-[160px]">
              <Image
                src="/leads-everyday-neg.webp"
                alt="Leads Everyday"
                width={160}
                height={40}
                className="absolute inset-0 h-full w-auto object-contain opacity-0 dark:opacity-100 transition-opacity duration-600"
              />
              <Image
                src="/leads-everyday-pos.webp"
                alt="Leads Everyday"
                width={160}
                height={40}
                className="absolute inset-0 h-full w-auto object-contain opacity-100 dark:opacity-0 transition-opacity duration-600"
              />
            </Link>
            <p className="text-sm text-foreground/70 mt-3 max-w-xs">
              Connecting tradespeople and businesses across the UK with high-quality leads every single day to fuel growth and success.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Company
            </p>
            <nav className="flex flex-col gap-2.5">
              {footerNav.map((item) => (
                <Link
                  key={item.href}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  href={item.href}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Industries
            </p>
            <nav className="flex flex-col gap-2.5">
              {serviceCategories.map((item) => (
                <Link
                  key={item.href}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  href={item.href}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Find Us
            </p>
            <a
              href="tel:+443330428425"
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              0333 0428 425
            </a>
            <p className="text-sm text-foreground/70 mt-3 max-w-xs">
              Leads Everyday Limited, East Wing, Ground Floor Cams Hall, Cams Hill, Fareham, Hampshire, PO16 8AB
            </p>

            <p className="text-sm font-medium text-foreground mt-6 mb-3">
              Follow Us
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener"
                aria-label="X (Twitter)"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener"
                aria-label="YouTube"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <FaYoutube size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights
            reserved.
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={openBanner}
              className="text-sm text-foreground/50 hover:text-primary transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
            <Link href="/cookie-policy" className="text-sm text-foreground/50 hover:text-primary transition-colors">
              Cookie Policy
            </Link>
            <Link href="/privacy-policy" className="text-sm text-foreground/50 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-sm text-foreground/50 hover:text-primary transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
