"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Proposals", href: "/proposals" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Leads", href: "/leads" },
  { label: "Jobs", href: "/jobs" },
  { label: "Account", href: "/account" },
];

export function MobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <header className="flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-white/10 bg-white/[0.02]">
        <Link href="/dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/led_logo_white_green.webp"
            alt="Leads Everyday"
            className="w-[120px]"
          />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground/70">
            {open ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </header>

      {open && (
        <nav className="border-b border-white/10 bg-white/[0.02] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-md text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-white/10">
            <p className="px-3 py-1 text-xs text-foreground/40 truncate">{email}</p>
          </div>
        </nav>
      )}
    </div>
  );
}
