"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Image from "next/image";

const SECRET = "TMRW-2026";

const PROPOSAL = {
  customer: "Umer Sheikh",
  business: "Tomorrow Energy Ltd",
  address: "Pavilion 2, Finnieston Business Park Minerva Way, Glasgow, G3 8AU",
  targetArea: "Scotland",
  service: "Battery Storage",
  conversionRate: 25,
  leadsPerMonth: 200,
  customersPerMonth: 50,
  setupFee: 10_000,
  monthlyFee: 66_000,
  firstPayment: 76_000,
  vatRate: 20,
  smallestJobValue: 5_000,
} as const;

function fmt(n: number) {
  return n.toLocaleString("en-GB", { minimumFractionDigits: 0 });
}

function fmtVat(n: number) {
  return fmt(n * (1 + PROPOSAL.vatRate / 100));
}

export default function TomorrowEnergyProposal() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [error, setError] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState(false);

  useEffect(() => {
    if (searchParams.get("s") === SECRET) {
      setUnlocked(true);
    }
  }, [searchParams]);

  const trustpilotMobileRef = useCallback((el: HTMLDivElement | null) => {
    if (el && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(el, true);
    }
  }, []);

  const trustpilotDesktopRef = useCallback((el: HTMLDivElement | null) => {
    if (el && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(el, true);
    }
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (secretInput.trim() === SECRET) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  // Gate: require secret
  if (!unlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">Private Proposal</h1>
            <p className="text-sm text-foreground/50">Enter the access code to view this proposal.</p>
          </div>
          <input
            type="text"
            value={secretInput}
            onChange={(e) => {
              setSecretInput(e.target.value);
              setError(false);
            }}
            placeholder="Access code"
            autoFocus
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-center tracking-widest placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              error ? "border-red-500/50" : "border-white/10"
            }`}
          />
          {error && (
            <p className="text-xs text-red-400 text-center">Invalid access code. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            View Proposal
          </button>
        </form>
      </div>
    );
  }

  const roi = PROPOSAL.smallestJobValue * PROPOSAL.customersPerMonth;

  return (
    <>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
      />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Header: Both logos */}
        <div className="flex items-center justify-between">
          <Image
            src="/leads-everyday-neg.webp"
            alt="Leads Everyday"
            width={140}
            height={36}
            className="h-7 w-auto hidden dark:block"
          />
          <Image
            src="/leads-everyday-pos.webp"
            alt="Leads Everyday"
            width={140}
            height={36}
            className="h-7 w-auto dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/69d638f5306af35370f51b42/6146eed9-85ae-446f-9995-7a2c4904c008/White+Logo.webp?format=1500w"
            alt="Tomorrow Energy"
            className="h-8 w-auto"
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary font-semibold">Proposal</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Lead Generation for {PROPOSAL.service}
          </h1>
          <p className="text-foreground/50 text-lg">
            Prepared for <span className="text-foreground font-medium">{PROPOSAL.customer}</span>, {PROPOSAL.business}
          </p>
        </div>

        {/* Client & Campaign Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold">Client Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/50">Contact</span>
                <span className="font-medium">{PROPOSAL.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Company</span>
                <span className="font-medium">{PROPOSAL.business}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-foreground/50 shrink-0">Address</span>
                <span className="font-medium text-right">{PROPOSAL.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold">Campaign Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/50">Service</span>
                <span className="font-medium">{PROPOSAL.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Target Area</span>
                <span className="font-medium">{PROPOSAL.targetArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Conversion Rate</span>
                <span className="font-medium">{PROPOSAL.conversionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Package Summary */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
          <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold">Monthly Package</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{fmt(PROPOSAL.leadsPerMonth)}</p>
              <p className="text-xs text-foreground/40 mt-1">Leads / month</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{PROPOSAL.conversionRate}%</p>
              <p className="text-xs text-foreground/40 mt-1">Conversion rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{fmt(PROPOSAL.customersPerMonth)}</p>
              <p className="text-xs text-foreground/40 mt-1">Customers / month</p>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 space-y-4">
            <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold">Pricing</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div>
                  <p className="text-sm font-medium">Set Up Fee</p>
                  <p className="text-xs text-foreground/40">One-off campaign setup</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">£{fmt(PROPOSAL.setupFee)} <span className="text-foreground/40 font-normal">+ VAT</span></p>
                  <p className="text-[11px] text-foreground/30">£{fmtVat(PROPOSAL.setupFee)} inc. VAT</p>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <div>
                  <p className="text-sm font-medium">Lead Generation</p>
                  <p className="text-xs text-foreground/40">{fmt(PROPOSAL.leadsPerMonth)} leads per month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">£{fmt(PROPOSAL.monthlyFee)} <span className="text-foreground/40 font-normal">+ VAT</span></p>
                  <p className="text-[11px] text-foreground/30">£{fmtVat(PROPOSAL.monthlyFee)} inc. VAT</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border-t border-primary/20 px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-primary">First Payment</p>
              <p className="text-xs text-foreground/40">Setup + first month</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">£{fmt(PROPOSAL.firstPayment)} <span className="text-sm font-normal text-primary/70">+ VAT</span></p>
              <p className="text-xs text-foreground/40">£{fmtVat(PROPOSAL.firstPayment)} inc. VAT</p>
            </div>
          </div>
        </div>

        {/* ROI Projection */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 space-y-4">
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Expected Return on Investment</p>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground/60">Smallest job value</span>
              <span className="text-sm font-semibold">£{fmt(PROPOSAL.smallestJobValue)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground/60">Customers per month</span>
              <span className="text-sm font-semibold">{fmt(PROPOSAL.customersPerMonth)}</span>
            </div>
            <div className="border-t border-emerald-500/10 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-medium text-emerald-400">Monthly revenue potential</span>
              <span className="text-2xl font-bold text-emerald-400">£{fmt(roi)}</span>
            </div>
          </div>

          <p className="text-xs text-foreground/40">
            Based on your smallest job value of £{fmt(PROPOSAL.smallestJobValue)} &times; {fmt(PROPOSAL.customersPerMonth)} customers per month.
            Actual revenue will vary depending on job value and close rate.
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold">How It Works</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Discover", desc: "We learn about your business, goals and ideal customers across Scotland." },
              { step: 2, title: "Build & Target", desc: "We build targeted lists and craft compelling outreach for battery storage leads." },
              { step: 3, title: "Deliver Results", desc: "You receive high-quality, ready-to-book leads that convert into paying customers." },
            ].map((s) => (
              <div key={s.step} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm mb-3">
                  {s.step}
                </div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-foreground/50 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
          {[
            { value: "20,000+", label: "Campaigns Run" },
            { value: "1M+", label: "Unique Leads" },
            { value: "1,200+", label: "Reviews" },
            { value: "48hrs", label: "Avg. Go-Live" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-foreground/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trustpilot */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold text-center">
            What Our Clients Say
          </p>
          <div
            ref={trustpilotMobileRef}
            className="trustpilot-widget md:hidden"
            data-locale="en-US"
            data-template-id="539ad0ffdec7e10e686debd7"
            data-businessunit-id="606ea5a74e740b0001398b05"
            data-style-height="350px"
            data-style-width="100%"
            data-theme="dark"
            data-token="0c4b27aa-ddb5-49a6-9f25-9facd86690fd"
            data-stars="4,5"
            data-review-languages="en"
          >
            <a href="https://www.trustpilot.com/review/leadseveryday.co.uk" target="_blank" rel="noopener">Trustpilot</a>
          </div>
          <div
            ref={trustpilotDesktopRef}
            className="trustpilot-widget hidden md:block"
            data-locale="en-US"
            data-template-id="53aa8912dec7e10d38f59f36"
            data-businessunit-id="606ea5a74e740b0001398b05"
            data-style-height="140px"
            data-style-width="100%"
            data-theme="dark"
            data-token="cf2bd426-bc84-4c7b-b20a-42491efbf7c6"
            data-stars="4,5"
            data-review-languages="en"
          >
            <a href="https://www.trustpilot.com/review/leadseveryday.co.uk" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>

        {/* Account Manager */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-4">Your Account Manager</p>
          <div className="flex items-center gap-5">
            <Image
              src="/Rob.png"
              alt="Rob"
              width={72}
              height={72}
              className="rounded-full border-2 border-primary/30"
            />
            <div className="space-y-1">
              <p className="font-semibold text-lg">Rob</p>
              <p className="text-sm text-foreground/50">Account Manager</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                <a href="tel:+441329640680" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  01329 640680
                </a>
                <a href="mailto:robert@leadseveryday.co.uk" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  robert@leadseveryday.co.uk
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-3">
          {accepted ? (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-emerald-400">Proposal Accepted</h2>
              <p className="text-sm text-foreground/50 max-w-md mx-auto">
                Rob has been notified and will be in touch shortly to get your campaign set up.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Ready to get started?</h2>
              <p className="text-sm text-foreground/50 max-w-md mx-auto">
                Click below to accept this proposal. Rob will be notified and will get your campaign live within 48 hours.
              </p>
              {acceptError && (
                <p className="text-xs text-red-400">Something went wrong. Please try again or contact Rob directly.</p>
              )}
              <button
                onClick={async () => {
                  setAccepting(true);
                  setAcceptError(false);
                  try {
                    const res = await fetch("/api/proposals/accept", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        business: PROPOSAL.business,
                        customer: PROPOSAL.customer,
                        service: PROPOSAL.service,
                        targetArea: PROPOSAL.targetArea,
                        leadsPerMonth: PROPOSAL.leadsPerMonth,
                        customersPerMonth: PROPOSAL.customersPerMonth,
                        conversionRate: PROPOSAL.conversionRate,
                        setupFee: PROPOSAL.setupFee,
                        monthlyFee: PROPOSAL.monthlyFee,
                        firstPayment: PROPOSAL.firstPayment,
                      }),
                    });
                    if (res.ok) {
                      setAccepted(true);
                    } else {
                      setAcceptError(true);
                    }
                  } catch {
                    setAcceptError(true);
                  } finally {
                    setAccepting(false);
                  }
                }}
                disabled={accepting}
                className="inline-block bg-primary text-primary-foreground font-medium py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors text-sm mt-2 disabled:opacity-50"
              >
                {accepting ? "Sending..." : "Accept Proposal"}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-foreground/30 pb-6">
          This proposal is confidential and intended solely for {PROPOSAL.business}. Prices are quoted in GBP excluding VAT unless stated otherwise.
        </p>
      </div>
    </>
  );
}
