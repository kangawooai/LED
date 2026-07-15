"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CRM_SERVICE_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconChevronDown,
  IconLock,
  IconMail,
  IconMessageCircle,
  IconPhone,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ─── Trustpilot ─── */

function TrustpilotWidget({
  templateId,
  token,
  height,
  className,
  stars,
}: {
  templateId: string;
  token: string;
  height: string;
  className?: string;
  stars?: string;
}) {
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(el, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cn("trustpilot-widget", className)}
      data-locale="en-US"
      data-template-id={templateId}
      data-businessunit-id="606ea5a74e740b0001398b05"
      data-style-height={height}
      data-style-width="100%"
      data-theme="dark"
      data-token={token}
      {...(stars ? { "data-stars": stars, "data-review-languages": "en" } : {})}
    >
      <a href="https://www.trustpilot.com/review/leadseveryday.co.uk" target="_blank" rel="noopener">Trustpilot</a>
    </div>
  );
}

/* ─── Types ─── */

interface Proposal {
  monthly_fee: number;
  setup_fee: string;
  total_fee: string;
}

interface ContactData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
}

interface ProposalData {
  proposal: Proposal;
  industry: string;
  service: string;
  target_area: string;
  required_leads: string;
  conversion_rate: string;
  customLeads: string;
  contact?: ContactData;
  avg_job_value?: number;
  desired_return?: number;
}

/* ─── Constants ─── */

const API_ENDPOINT = "/api/onboarding";

const BDM = {
  name: "Robert O'Toole",
  role: "Business Development Manager",
  phone: "+443330424424",
  phoneDisplay: "0333 0 424 424",
  email: "hello@leadseveryday.co.uk",
  photo: "/Rob.png",
};


/* ─── Accordion Section ─── */

function AccordionSection({
  stepNumber, title, isOpen, isCompleted, isLocked, onToggle, children,
}: {
  stepNumber: number; title: string; isOpen: boolean; isCompleted: boolean; isLocked: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "bg-white/5 border rounded-xl overflow-hidden transition-colors",
      isOpen ? "border-primary/30" : isCompleted ? "border-primary/20" : "border-white/10"
    )}>
      <button
        type="button"
        onClick={isLocked ? undefined : onToggle}
        disabled={isLocked}
        className={cn(
          "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors",
          isLocked ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-white/5"
        )}
      >
        <div className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
          isCompleted ? "bg-primary text-primary-foreground"
            : isOpen ? "bg-primary/10 border border-primary/20 text-primary"
            : "border border-white/20 text-foreground/40"
        )}>
          {isCompleted ? <IconCheck className="size-3.5" /> : stepNumber}
        </div>
        <span className={cn("flex-1 text-sm font-semibold", isLocked ? "text-foreground/40" : "")}>{title}</span>
        {isLocked ? <IconLock className="size-4 text-foreground/30" /> : (
          <IconChevronDown className={cn("size-4 text-foreground/50 transition-transform duration-200", isOpen && "rotate-180")} />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sticky Timeline ─── */

const TIMELINE_STEPS = [
  { step: 1, title: "Your proposal is ready", desc: "Built around your specific business requirements – ready for you to review below." },
  { step: 2, title: "Review & decide", desc: "If it fits, simply approve – there's no long-term tie-in." },
  { step: 3, title: "Approve & launch", desc: "We build and launch your campaign – typically live within 48 hours." },
];

function StickyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.8;
      const end = viewH * 0.2;
      const t = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setProgress(t);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const stepOpacities = useMemo(() => {
    return TIMELINE_STEPS.map((_, i) => {
      if (i === 0) return 1;
      const threshold = i / TIMELINE_STEPS.length;
      return Math.min(1, Math.max(0.15, (progress - threshold + 0.3) / 0.3));
    });
  }, [progress]);

  const lineProgress = useMemo(() => {
    return Math.min(1, Math.max(0, progress * 1.2));
  }, [progress]);

  return (
    <div ref={containerRef} className="sticky top-24 self-start bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">How It Works</p>
      <div className="relative">
        {/* Track line background */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10" />
        {/* Animated fill */}
        <div
          className="absolute left-[15px] top-4 w-px bg-primary/50 origin-top transition-transform duration-150"
          style={{ height: "calc(100% - 2rem)", transform: `scaleY(${lineProgress})` }}
        />

        {TIMELINE_STEPS.map((s, i) => (
          <div
            key={s.step}
            className="relative flex gap-3 pb-5 last:pb-0 transition-opacity duration-500"
            style={{ opacity: stepOpacities[i] }}
          >
            <div className={cn(
              "relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
              stepOpacities[i] > 0.7
                ? "bg-primary/10 border border-primary/20 text-primary"
                : "bg-white/5 border border-white/10 text-foreground/30"
            )}>
              {s.step}
            </div>
            <div className="pt-1">
              <p className="font-semibold text-sm">{s.title}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function ProposalClient({ leadId }: { leadId: string }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [industry, setIndustry] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [proposalEdits, setProposalEdits] = useState({ service_type: "", required_leads: "20", conversion_rate: "80", avg_job_value: "" });
  const [proposalCustomLeads, setProposalCustomLeads] = useState("");
  const [quotedValues, setQuotedValues] = useState({ service_type: "", required_leads: "20", conversion_rate: "80", customLeads: "" });
  const [avgJobValue, setAvgJobValue] = useState(0);
  const [desiredReturn, setDesiredReturn] = useState(0);
  const [detailsForm, setDetailsForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", business_name: "",
    company_address: "", street_address: "", city: "", country: "", post_code: "", company_number: "",
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [discussOpen, setDiscussOpen] = useState(false);
  const [discussSent, setDiscussSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirectingToStripe, setRedirectingToStripe] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [stripePaymentId, setStripePaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [pandadocStatus, setPandadocStatus] = useState<string>("pending");
  const [pandadocLoading, setPandadocLoading] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [googleReady, setGoogleReady] = useState(false);
  const addressAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const addressCallbackRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) { if (addressAutocompleteRef.current) { google.maps.event.clearInstanceListeners(addressAutocompleteRef.current); addressAutocompleteRef.current = null; } return; }
    if (addressAutocompleteRef.current) return;
    if (!window.google?.maps?.places) return;
    const ac = new google.maps.places.Autocomplete(node, { types: ["address"], componentRestrictions: { country: "gb" }, fields: ["formatted_address", "address_components"] });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (place.formatted_address) {
        const parts = place.address_components || [];
        const get = (type: string) => parts.find((c) => c.types.includes(type))?.long_name || "";
        setDetailsForm((prev) => ({ ...prev, company_address: place.formatted_address!, street_address: [get("street_number"), get("route")].filter(Boolean).join(" "), city: get("postal_town") || get("locality"), country: get("country"), post_code: get("postal_code") }));
      }
    });
    addressAutocompleteRef.current = ac;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleReady]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const saveProgress = useCallback((updates: Record<string, unknown>) => {
    fetch("/api/proposal", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead_id: leadId, ...updates }) }).catch(() => {});
  }, [leadId]);

  useEffect(() => {
    let cancelled = false;
    async function loadProposal() {
      try {
        const res = await fetch(`/api/proposal?lead_id=${encodeURIComponent(leadId)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && !data.error) {
            setProposal({ monthly_fee: data.monthly_fee, setup_fee: data.setup_fee, total_fee: data.total_fee });
            if (data.created_at) setCreatedAt(data.created_at);
            setIndustry(data.industry); setTargetArea(data.target_area);
            const edits = { service_type: data.service, required_leads: data.required_leads, conversion_rate: data.conversion_rate, avg_job_value: String(data.avg_job_value || "") };
            setProposalEdits(edits); setQuotedValues({ ...edits, customLeads: data.custom_leads || "" });
            if (Number(data.required_leads) > 100) setProposalCustomLeads(data.custom_leads || "");
            setAvgJobValue(data.avg_job_value || 0); setDesiredReturn(data.desired_return || 0);
            const loadedSteps = new Set<string>(data.completed_steps ?? []);
            const loadedAccepted = data.proposal_accepted ?? false;
            setProposalAccepted(loadedAccepted); setCompletedSteps(loadedSteps);
            const savedSection = data.active_section ?? null;
            if (savedSection) { setActiveSection(savedSection); }
            else if (loadedAccepted) {
              const next = !loadedSteps.has("details") ? "details" : !loadedSteps.has("terms") ? "terms" : !loadedSteps.has("payment") ? "payment" : null;
              setActiveSection(next);
            } else { setActiveSection("details"); }
            if (data.stripe_payment_id) setStripePaymentId(data.stripe_payment_id);
            if (data.pandadoc_status) setPandadocStatus(data.pandadoc_status);
            if (data.first_name || data.email) {
              setContact({ first_name: data.first_name || "", last_name: data.last_name || "", email: data.email || "", phone: data.phone || "", business_name: data.business_name || "" });
              setDetailsForm({ first_name: data.first_name || "", last_name: data.last_name || "", email: data.email || "", phone: data.phone || "", business_name: data.business_name || "", company_address: data.company_address || "", street_address: data.street_address || "", city: data.city || "", country: data.country || "", post_code: data.post_code || "", company_number: data.company_number || "" });
            }
            setLoaded(true); return;
          }
        }
      } catch {}
      try {
        const raw = sessionStorage.getItem("proposal_data");
        if (raw) {
          const data: ProposalData = JSON.parse(raw);
          if (!cancelled) {
            setProposal(data.proposal); setIndustry(data.industry); setTargetArea(data.target_area);
            const edits = { service_type: data.service, required_leads: data.required_leads, conversion_rate: data.conversion_rate, avg_job_value: String(data.avg_job_value || "") };
            setProposalEdits(edits); setQuotedValues({ ...edits, customLeads: data.customLeads || "" });
            if (Number(data.required_leads) > 100) setProposalCustomLeads(data.customLeads);
            if (data.avg_job_value) setAvgJobValue(data.avg_job_value);
            if (data.desired_return) setDesiredReturn(data.desired_return);
            if (data.contact) { setContact(data.contact); setDetailsForm((prev) => ({ ...prev, first_name: data.contact!.first_name || "", last_name: data.contact!.last_name || "", email: data.contact!.email || "", phone: data.contact!.phone || "", business_name: data.contact!.business_name || "" })); }
            try { await fetch("/api/proposal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead_id: leadId, monthly_fee: data.proposal.monthly_fee, setup_fee: data.proposal.setup_fee, total_fee: data.proposal.total_fee, industry: data.industry, service: data.service, target_area: data.target_area, required_leads: data.required_leads, conversion_rate: data.conversion_rate, custom_leads: data.customLeads || null, avg_job_value: data.avg_job_value ?? 0, desired_return: data.desired_return ?? 0 }) }); } catch {}
          }
        }
      } catch {}
      if (!cancelled) setLoaded(true);
    }
    loadProposal();
    return () => { cancelled = true; };
  }, [leadId]);

  useEffect(() => {
    if (!leadId) return;
    fetch("/api/company-details/fetch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead_id: leadId }) })
      .then((res) => res.json()).then((data) => {
        if (data.error) return;
        const cd: ContactData = { first_name: data.first_name || "", last_name: data.last_name || "", email: data.email || "", phone: data.phone != null ? String(data.phone) : "", business_name: data.business_name || "" };
        setContact((prev) => prev ?? cd);
        setDetailsForm((prev) => ({ ...prev, first_name: prev.first_name || cd.first_name, last_name: prev.last_name || cd.last_name, email: prev.email || cd.email, phone: prev.phone || cd.phone, business_name: prev.business_name || cd.business_name, company_address: prev.company_address || data.address || "", street_address: prev.street_address || data.street_address || "", city: prev.city || data.city || "", country: prev.country || data.country || "", post_code: prev.post_code || data.post_code || "", company_number: prev.company_number || (data.company_number != null ? String(data.company_number) : "") }));
      }).catch(() => {});
  }, [leadId]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || !loaded || completedSteps.has("confirm")) return;
    let cancelled = false;
    async function verify() {
      setVerifyingPayment(true);
      try {
        const res = await fetch("/api/billing/verify-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionId, lead_id: leadId }) });
        if (!res.ok) { setVerifyingPayment(false); return; }
        const { customer_id, payment_intent_id } = await res.json();
        if (cancelled) return;
        setStripePaymentId(payment_intent_id);
        try { await fetch("/api/webhooks/lead-to-opportunity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead_id: leadId, customer_id: customer_id || "", payment_id: payment_intent_id || "", subscription_date: new Date().toISOString(), subscription_id: "" }) }); } catch {}
        if (cancelled) return;
        const newSteps = new Set([...completedSteps, "payment", "confirm"]);
        setCompletedSteps(newSteps); setActiveSection(null);
        saveProgress({ completed_steps: [...newSteps], active_section: null, stripe_customer_id: customer_id, stripe_payment_id: payment_intent_id });
        const url = new URL(window.location.href); url.searchParams.delete("session_id"); window.history.replaceState({}, "", url.pathname);
      } catch {} finally { if (!cancelled) setVerifyingPayment(false); }
    }
    verify();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loaded]);

  /* ─── Derived ─── */
  const proposalServices = CRM_SERVICE_OPTIONS.find((g) => g.group === industry)?.options ?? [];
  const resolveCrmValue = (label: string) => CRM_SERVICE_OPTIONS.find((g) => g.group === industry)?.options.find((o) => o.label === label)?.value ?? label;
  const getEffectiveLeads = (sv: string, c: string) => Number(sv) > 100 ? Number(c) : Number(sv);
  const formatLeadsDisplay = (v: string) => Number(v) > 100 ? "100+" : v;
  const formatFee = (fee: string | number) => { const n = typeof fee === "string" ? parseFloat(fee) : fee; if (isNaN(n)) return fee; return `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; };
  const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
  const toggleSection = (s: string) => setActiveSection((prev) => prev === s ? null : s);

  const clientName = contact?.first_name || detailsForm.first_name || "there";
  const companyName = contact?.business_name || detailsForm.business_name || "";
  const displayName = companyName || clientName;
  const customers = getEffectiveLeads(quotedValues.required_leads, quotedValues.customLeads);
  const rate = Number(quotedValues.conversion_rate);
  const leadsNeeded = Math.ceil(customers / (rate / 100));
  const hasDiscovery = avgJobValue > 0 && desiredReturn > 0;
  const discoveryJobs = hasDiscovery ? Math.max(1, Math.ceil(desiredReturn / avgJobValue)) : 0;
  const discoveryLeads = hasDiscovery ? Math.max(1, Math.ceil(discoveryJobs / (rate / 100))) : 0;
  const isPaid = completedSteps.has("confirm") || !!stripePaymentId;
  const pandadocDone = pandadocStatus === "document.completed";
  const pandadocDeclined = pandadocStatus === "document.voided" || pandadocStatus === "document.declined";
  const needsPandaDoc = isPaid && !pandadocDone && !pandadocDeclined;
  const datePrepared = new Date(createdAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const todayFormatted = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  /* ─── Handlers ─── */
  const recalculateProposal = async () => {
    if (submitting) return; setSubmitting(true); setError(null);
    try {
      const res = await fetch(API_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step: 2, required_leads: getEffectiveLeads(proposalEdits.required_leads, proposalCustomLeads), conversion_rate: Number(proposalEdits.conversion_rate), service_type: resolveCrmValue(proposalEdits.service_type), LeadID: leadId, TargetArea: targetArea }) });
      const data = await res.json();
      if (data.Successful === "200") { setProposal({ monthly_fee: data.monthly_fee, setup_fee: data.setup_fee, total_fee: data.total_fee }); if (Number(data.average_job_value)) setAvgJobValue(Number(data.average_job_value)); if (Number(data.roi)) setDesiredReturn(Number(data.roi)); setQuotedValues({ ...proposalEdits, customLeads: proposalCustomLeads }); saveProgress({ monthly_fee: data.monthly_fee, setup_fee: data.setup_fee, total_fee: data.total_fee, required_leads: proposalEdits.required_leads, conversion_rate: proposalEdits.conversion_rate, service: proposalEdits.service_type, custom_leads: proposalCustomLeads || null, avg_job_value: Number(data.average_job_value) || avgJobValue, desired_return: Number(data.roi) || desiredReturn }); }
    } catch { setError("Failed to update quote. Please try again."); } finally { setSubmitting(false); }
  };

  const handleDiscussProposal = async () => {
    if (submitting) return; setSubmitting(true);
    let cd = contact; if (!cd) { try { const raw = sessionStorage.getItem("proposal_data"); if (raw) { const s = JSON.parse(raw); if (s.contact) cd = s.contact; } } catch {} }
    try { await fetch("/api/discuss-proposal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, service: quotedValues.service_type, customers, conversionRate: rate, leads: leadsNeeded, targetArea, setupFee: proposal ? formatFee(proposal.setup_fee) : "", monthlyFee: proposal ? formatFee(proposal.monthly_fee) : "", contact: cd }) }); } catch {}
    finally { setSubmitting(false); setDiscussSent(true); setDiscussOpen(true); }
  };

  const getNextStep = (steps: Set<string>) => {
    if (!steps.has("details")) return "details";
    if (!steps.has("terms")) return "terms";
    if (!steps.has("payment")) return "payment";
    return null;
  };

  const handleAcceptProposal = () => {
    setProposalAccepted(true);
    const ns = new Set([...completedSteps, "requirements"]);
    const next = getNextStep(ns);
    setCompletedSteps(ns); setActiveSection(next);
    saveProgress({ proposal_accepted: true, completed_steps: [...ns], active_section: next });
  };

  const handleSaveCompanyDetails = async (e: React.FormEvent) => {
    e.preventDefault(); if (submitting) return; setSubmitting(true); setError(null);
    fetch("/api/company-details", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ first_name: detailsForm.first_name, last_name: detailsForm.last_name, business_name: detailsForm.business_name, phone: detailsForm.phone, email: detailsForm.email, company_number: detailsForm.company_number, lead_id: leadId, street_address: detailsForm.street_address, city: detailsForm.city, country: detailsForm.country, post_code: detailsForm.post_code }) }).catch(() => {});
    setContact({ first_name: detailsForm.first_name, last_name: detailsForm.last_name, email: detailsForm.email, phone: detailsForm.phone, business_name: detailsForm.business_name });
    const ns = new Set([...completedSteps, "details"]); setCompletedSteps(ns); setActiveSection("terms");
    saveProgress({ completed_steps: [...ns], active_section: "terms", ...detailsForm });
    setSubmitting(false);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => setDetailsForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    if (atBottom) setTermsScrolled(true);
  };

  const handleAcceptTerms = () => {
    const ns = new Set([...completedSteps, "terms"]); setCompletedSteps(ns); setActiveSection("payment");
    saveProgress({ completed_steps: [...ns], active_section: "payment" });
  };

  useEffect(() => {
    if (!isPaid || pandadocDone || pandadocDeclined) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/proposal?lead_id=${encodeURIComponent(leadId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.pandadoc_status && data.pandadoc_status !== pandadocStatus) {
          setPandadocStatus(data.pandadoc_status);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaid, pandadocDone, pandadocDeclined, leadId, pandadocStatus]);

  const launchPandaDoc = async () => {
    if (pandadocLoading) return;
    setPandadocLoading(true);
    try {
      const res = await fetch("/api/pandadoc/create-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId }),
      });
      const data = await res.json();
      if (data.sessionUrl) {
        sessionStorage.setItem("pandadoc_return_lead", leadId);
        window.open(data.sessionUrl, "_blank");
        setPandadocLoading(false);
      } else {
        setPandadocLoading(false);
      }
    } catch {
      setPandadocLoading(false);
    }
  };

  /* ─── Loading / Error ─── */
  if (!loaded) return null;
  if (verifyingPayment) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto animate-pulse">
          <IconCheck className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Verifying Payment</h1>
        <p className="text-sm text-foreground/50">Please wait while we confirm your payment...</p>
      </div>
    </div>
  );
  if (proposal && isPaid && pandadocDone) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <IconCheck className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-emerald-400">You&apos;re All Set</h1>
          <p className="text-sm text-foreground/50">Payment complete and agreement signed. Your campaign is now active &mdash; we&apos;ll be in touch shortly.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-2 mx-auto w-full">
          {[
            ["Setup Fee Paid", formatFee(proposal.setup_fee)],
            ["Monthly Fee (DD)", formatFee(proposal.monthly_fee)],
            ["Payment Date", todayFormatted],
          ].map(([l, v], i) => (
            <div key={i} className={cn("flex justify-between items-center py-1.5 text-sm", i < 2 && "border-b border-white/5")}>
              <span className="text-foreground/50">{l}</span>
              <span className="font-medium">{String(v)}</span>
            </div>
          ))}
          <div className="border-t border-white/5 pt-2 space-y-1">
            <span className="text-foreground/50 text-sm">Payment ID</span>
            <p className="font-mono text-xs text-foreground/60 break-all">{stripePaymentId || "—"}</p>
          </div>
        </div>

        <Link href={`/api/auth/auto-login?lead_id=${leadId}`}>
          <Button className="mt-2">View Campaign</Button>
        </Link>
      </div>
    </div>
  );
  if (proposal && needsPandaDoc) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <IconCheck className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Complete</h1>
          <p className="text-sm text-foreground/50">Just one more step, verify your identity and sign the service agreement to activate your campaign.</p>
        </div>

        {(pandadocStatus === "document.sent" || pandadocStatus === "document.viewed") ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto animate-pulse">
              <IconCheck className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold text-sm">Awaiting Signature</p>
            <p className="text-xs text-foreground/50">We&apos;re waiting for your signed agreement. If you haven&apos;t completed signing, click below to continue.</p>
            <Button size="lg" onClick={launchPandaDoc} disabled={pandadocLoading} className="w-full gap-2 text-base mt-2">
              {pandadocLoading ? "Redirecting..." : "Continue Signing"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button size="lg" onClick={launchPandaDoc} disabled={pandadocLoading} className="w-full gap-2 text-base">
              {pandadocLoading ? "Preparing document..." : "Verify Identity & Sign Contract"}
            </Button>
            <p className="text-xs text-foreground/40">Quick ID check and contract signing, powered by PandaDoc.</p>
          </div>
        )}
      </div>
    </div>
  );
  if (!proposal) return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold">Proposal Not Found</h1>
        <p className="text-sm text-foreground/50">This proposal has expired or is not available.</p>
        <Link href="/get-started"><Button>Get Started</Button></Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Title + How It Works */}
        <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Left — Title & Intro */}
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-primary font-semibold">Lead Generation Proposal &middot; Prepared for {clientName}</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {clientName}, your tailored plan to grow <span className="text-primary">{displayName}</span>.
              </h1>
              <p className="text-foreground/50 py-4">
                Our aim is simple: more leads, more customers and more profit for {displayName}. This proposal sets out exactly how we will deliver it, high-quality, exclusive leads brought straight to you, so you can focus on the work.
              </p>
              <div className="inline-block bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Date prepared</p>
                <p className="text-sm font-semibold mt-0.5">{datePrepared}</p>
              </div>
            </div>
          </div>

          {/* Right — How It Works (sticky timeline) */}
          <StickyTimeline />
        </div>

        {/* Your Account Manager */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6 items-center">
            <Image
              src={BDM.photo}
              alt={BDM.name}
              width={240}
              height={240}
              className="rounded-full border-2 border-primary/30 object-cover w-full aspect-square mx-auto max-w-[200px] md:max-w-none"
            />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">Dedicated Point of Contact</p>
              <p className="font-semibold text-lg">{BDM.name}</p>
              <p className="text-sm text-foreground/50">{BDM.role}</p>
              <p className="text-sm text-foreground/50">&ldquo;I have prepared this proposal personally for you, {clientName}. If you have any questions at all, please call me directly, I am here to help get your business in front of more customers.&rdquo;</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pt-1">
                <a href={`tel:${BDM.phone}`} className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5">
                  <IconPhone className="w-3.5 h-3.5" /> {BDM.phoneDisplay}
                </a>
                <a href={`mailto:${BDM.email}?subject=My%20proposal%20-%20a%20question`} className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5">
                  <IconMail className="w-3.5 h-3.5" /> Email me directly
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 border border-white/10 rounded-xl p-6">
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

        {/* Introduction */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Introduction</p>
          <div className="space-y-4 text-sm text-foreground/70">
            <p>Dear {clientName},</p>
            <p>Thank you for our conversation today. Below you&apos;ll find the details of our service, tailored to prioritise your success, please reach out with any questions at all.</p>
            <p>We specialise in direct lead generation, delivering genuine customers straight to you. Using advanced, data-driven targeting, we make sure your business gets in front of more people actively searching for your services online.</p>
            <p>Every lead we send is exclusive to you. We never resell the same lead to your competitors. And everything we do is built on strategies refined across thousands of successful UK tradespeople, so you benefit from what already works.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            {[
              { title: "Targeted lead generation", desc: "We find and target your ideal customers using proven, data-driven methods." },
              { title: "Exclusive, unique leads", desc: "Every enquiry is yours alone, never shared or sold to anyone else in your trade." },
              { title: "Transparent reporting", desc: "You see exactly how many leads we deliver, no guesswork, no smoke and mirrors." },
            ].map((card) => (
              <div key={card.title} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-sm">{card.title}</p>
                <p className="text-xs text-foreground/50">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How We Arrived At This */}
        {hasDiscovery && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">How We Arrived At This</p>
              <p className="font-semibold text-lg text-foreground">The leads you need, based on your own figures</p>
              <p className="text-sm text-foreground max-w-2xl mx-auto">Every number in the box below came straight from you during our conversation. We&apos;ve simply worked out how many leads it takes to hit them, and that leads figure is exactly what your package is built to deliver.</p>
            </div>

            <p className="text-xs uppercase tracking-widest text-primary font-semibold">The figures you gave us</p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "You told us your conversion rate is", value: `${rate}%`, sub: "of leads you turn into won jobs" },
                { label: "You told us your average job value is", value: gbp(avgJobValue), sub: "revenue from a typical job" },
                { label: "You told us your estimated return is", value: gbp(desiredReturn), sub: "per month you're aiming to generate" },
              ].map((d, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-5 text-center space-y-2">
                  <p className="text-xs text-foreground">{d.label}</p>
                  <p className="text-3xl font-bold text-primary">{d.value}</p>
                  <p className="text-xs text-foreground">{d.sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">In simple terms, every month</p>
              <p className="text-2xl md:text-3xl font-bold">
                <span className="text-primary">{discoveryLeads}</span> leads = <span className="text-primary">{discoveryJobs}</span> jobs = <span className="text-primary">{gbp(desiredReturn)}</span> return
              </p>
              <p className="text-sm text-foreground/50">That&apos;s the package we&apos;ve built for you below.</p>
            </div>
          </div>
        )}

        {/* Adjust Requirements */}
        {!isPaid && (
          <div>
            <button
              type="button"
              onClick={() => toggleSection("requirements")}
              className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <span>Adjust Your Requirements</span>
              <IconChevronDown className={cn("size-4 transition-transform", activeSection === "requirements" && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {activeSection === "requirements" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                  <div className="mt-2 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <select value={proposalEdits.service_type} onChange={(e) => setProposalEdits((p) => ({ ...p, service_type: e.target.value }))} className="w-full h-9 bg-white/5 border border-white/10 rounded-md px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                        {proposalServices.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>Number of Customers</Label><span className="text-sm font-semibold text-primary">{formatLeadsDisplay(proposalEdits.required_leads)}</span></div>
                      <input type="range" min={5} max={101} step={1} value={proposalEdits.required_leads} onChange={(e) => setProposalEdits((p) => ({ ...p, required_leads: e.target.value }))} className="w-full accent-primary" />
                      {Number(proposalEdits.required_leads) > 100 && <Input type="number" min={101} placeholder="Enter exact number..." value={proposalCustomLeads} onChange={(e) => setProposalCustomLeads(e.target.value)} className="mt-2" />}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>Conversion Rate</Label><span className="text-sm font-semibold text-primary">{proposalEdits.conversion_rate}%</span></div>
                      <input type="range" min={10} max={100} step={10} value={proposalEdits.conversion_rate} onChange={(e) => setProposalEdits((p) => ({ ...p, conversion_rate: e.target.value }))} className="w-full accent-primary" />
                    </div>
                    {error && activeSection === "requirements" && <p className="text-xs text-red-400">{error}</p>}
                    <Button variant="outline" className="w-full" onClick={recalculateProposal} disabled={submitting}>
                      {submitting ? "Recalculating..." : "Update Quote"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Pricing */}
        <div className="relative -mx-6 px-6 py-12 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">Your Tailored Package</p>
              <p className="font-bold text-2xl md:text-3xl">Prepared for <span className="text-primary">{displayName}</span></p>
              <p className="text-sm text-foreground/60">Straightforward pricing. No commission, no hidden fees, just leads.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Leads required */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">Leads required</p>
                <p className="text-4xl font-bold text-foreground">{leadsNeeded}</p>
                <p className="text-sm text-primary font-medium">exclusive leads / month</p>
                <p className="text-xs text-foreground/50">Every lead is unique to your business and matched to your services.</p>
              </div>

              {/* One-off setup */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">One-off setup</p>
                <p className="text-4xl font-bold text-foreground">{formatFee(proposal.setup_fee)}</p>
                <p className="text-sm text-foreground/50 font-medium">+ VAT &middot; paid once</p>
                <p className="text-xs text-foreground/50">Covers campaign build, targeting and go-live, a single upfront cost.</p>
              </div>

              {/* Ongoing — glow card */}
              <div className="relative bg-primary/10 border-2 border-primary/40 rounded-xl p-6 text-center space-y-3 shadow-[0_0_40px_-5px] shadow-primary/30 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-xl bg-primary/5 blur-xl -z-10" />
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">Ongoing</p>
                <p className="text-4xl font-bold text-foreground">{formatFee(proposal.monthly_fee)}</p>
                <p className="text-sm text-foreground/50 font-medium">+ VAT &middot; per month</p>
                <p className="text-xs text-foreground/50">Your monthly package. Cancel any time after month one with 30 days&apos; notice.</p>
              </div>
            </div>

            <p className="text-xs text-foreground/40">All figures exclude VAT. No long-term contract, after your first month you&apos;re free to give 30 days&apos; notice at any time.</p>

            {!isPaid && (
              <Button size="lg" onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })} className="gap-2 text-base px-8 py-3">
                Get My Campaign
              </Button>
            )}
          </div>
        </div>

        {/* Testimonials — Trustpilot Widgets */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold text-center">What Our Clients Say</p>
          <p className="text-sm text-foreground/50 text-center">Feedback from UK businesses we work with, a selection of results from clients across the trades.</p>
          <TrustpilotWidget templateId="539adbd6dec7e10e686debee" token="e51bb89f-6489-4210-8653-2e7fd9723019" height="500px" stars="4,5" className="hidden md:block" />
          <TrustpilotWidget templateId="54ad5defc6454f065c28af8b" token="9b2e47c2-971b-41ff-ba7f-7855fc6678d2" height="240px" stars="4,5" className="md:hidden" />
        </div>

        {/* No Contract */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 text-center">
          <p className="font-semibold">No long-term contract</p>
          <p className="text-sm text-foreground/50 max-w-md mx-auto">After your first month, you are free to give 30 days&apos; notice at any time. We are confident the results will speak for themselves.</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              "Leads within days of going live",
              "Low risk, high return",
              "Rolling monthly, cancel any time",
            ].map((pill, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 text-xs font-medium text-primary">
                <IconCheck className="size-3" /> {pill}
              </span>
            ))}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* CTA */}
        <div id="get-started" ref={ctaRef} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-4">
          {isPaid && pandadocDone ? (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <IconCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-emerald-400">You&apos;re All Set</h2>
              <p className="text-sm text-foreground/50 max-w-md mx-auto">Payment complete and agreement signed. Your campaign is now active &mdash; we&apos;ll be in touch shortly.</p>

              {/* Payment details */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left space-y-2 max-w-sm mx-auto">
                {[
                  ["Setup Fee Paid", formatFee(proposal.setup_fee)],
                  ["Monthly Fee (DD)", formatFee(proposal.monthly_fee)],
                  ["Payment Date", todayFormatted],
                  ["Payment ID", stripePaymentId || "—"],
                ].map(([l, v], i) => (
                  <div key={i} className={cn("flex justify-between items-center py-1.5 text-sm", i < 3 && "border-b border-white/5")}>
                    <span className="text-foreground/50">{l}</span>
                    <span className={cn("font-medium", i === 3 && "font-mono text-xs text-foreground/60")}>{String(v)}</span>
                  </div>
                ))}
              </div>

              <Link href={`/api/auth/auto-login?lead_id=${leadId}`}>
                <Button className="mt-2">View Campaign</Button>
              </Link>
            </>
          ) : needsPandaDoc ? (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <IconCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-emerald-400">Payment Complete</h2>
              <p className="text-sm text-foreground/50 max-w-md mx-auto">Just one more step &mdash; verify your identity and sign the service agreement to activate your campaign.</p>

              <Button size="lg" onClick={launchPandaDoc} disabled={pandadocLoading} className="gap-2 text-base px-8">
                {pandadocLoading ? "Preparing document..." : "Verify Identity & Sign Contract"}
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Ready to get started?</h2>
              <p className="text-sm text-foreground/50 max-w-md mx-auto">
                You&apos;ve seen the service, the pricing and the evidence. When you&apos;re ready to proceed, we&apos;ll take care of everything from here.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                {proposalAccepted ? (
                  <div className="inline-flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-3 text-sm font-semibold text-emerald-400">
                    <IconCheck className="size-4" /> Proposal Accepted
                  </div>
                ) : (
                  <Button onClick={handleAcceptProposal} className="gap-2">
                    <IconCheck className="size-4" /> Accept Proposal
                  </Button>
                )}
                <Button variant="outline" onClick={handleDiscussProposal} disabled={submitting || discussSent} className="gap-2">
                  <IconMessageCircle className="size-4" /> {discussSent ? "Request Sent" : "Discuss Your Proposal"}
                </Button>
              </div>

              {/* Step 1: Company Details */}
              <div className="space-y-3 mt-4 text-left">
                <AccordionSection stepNumber={1} title="Company Details" isOpen={activeSection === "details"} isCompleted={completedSteps.has("details")} isLocked={!proposalAccepted} onToggle={() => toggleSection("details")}>
                  <p className="text-sm text-foreground/50 mb-4">Please confirm your details below.</p>
                  <form onSubmit={handleSaveCompanyDetails} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>First Name *</Label><Input name="first_name" placeholder="First name" value={detailsForm.first_name} onChange={handleDetailsChange} required /></div>
                      <div className="space-y-2"><Label>Last Name *</Label><Input name="last_name" placeholder="Last name" value={detailsForm.last_name} onChange={handleDetailsChange} required /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" placeholder="you@example.com" value={detailsForm.email} onChange={handleDetailsChange} required /></div>
                      <div className="space-y-2"><Label>Phone *</Label><Input name="phone" type="tel" placeholder="07700 900000" value={detailsForm.phone} onChange={handleDetailsChange} required /></div>
                    </div>
                    <div className="space-y-2"><Label>Business Name *</Label><Input name="business_name" placeholder="Your business name" value={detailsForm.business_name} onChange={handleDetailsChange} required /></div>
                    <div className="space-y-2"><Label>Company Address *</Label><Input name="company_address" placeholder="Start typing your address..." value={detailsForm.company_address} onChange={handleDetailsChange} ref={addressCallbackRef} required /></div>
                    {detailsForm.street_address && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Street Address</Label><Input name="street_address" value={detailsForm.street_address} onChange={handleDetailsChange} /></div>
                        <div className="space-y-2"><Label>City</Label><Input name="city" value={detailsForm.city} onChange={handleDetailsChange} /></div>
                        <div className="space-y-2"><Label>Country</Label><Input name="country" value={detailsForm.country} onChange={handleDetailsChange} /></div>
                        <div className="space-y-2"><Label>Post Code</Label><Input name="post_code" value={detailsForm.post_code} onChange={handleDetailsChange} /></div>
                      </div>
                    )}
                    <div className="space-y-2"><Label>Company Number</Label><Input name="company_number" placeholder="e.g. 12345678" value={detailsForm.company_number} onChange={handleDetailsChange} /></div>
                    {error && activeSection === "details" && <p className="text-xs text-red-400">{error}</p>}
                    <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Saving..." : "Save & Continue"}</Button>
                  </form>
                </AccordionSection>

                {/* Step 2: Terms & Conditions */}
                <AccordionSection stepNumber={2} title="Terms & Conditions" isOpen={activeSection === "terms"} isCompleted={completedSteps.has("terms")} isLocked={!completedSteps.has("details")} onToggle={() => toggleSection("terms")}>
                  <p className="text-sm text-foreground/50 mb-4">Please read the terms below. You must scroll to the bottom before accepting.</p>
                  <div
                    ref={termsRef}
                    onScroll={handleTermsScroll}
                    className="h-64 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-4 text-xs text-foreground/60 space-y-3 mb-4"
                  >
                    <p className="font-semibold text-foreground text-sm">Leads Every Day &mdash; Terms and Conditions</p>
                    <p className="text-foreground/40">Last updated: July 2026</p>
                    <p>By purchasing a Lead Generation package from Leads Every Day (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you (&ldquo;the Client&rdquo;) agree to be bound by the following terms and conditions. Please read them carefully before proceeding.</p>

                    <p className="font-semibold text-foreground">1. Package and Pricing</p>
                    <p>1.1. Your Lead Generation package comprises an initial setup fee and an ongoing monthly subscription fee, as agreed at the time of purchase and confirmed in your PandaDoc welcome document.</p>
                    <p>1.2. All fees quoted are exclusive of VAT, which will be charged at the prevailing rate.</p>

                    <p className="font-semibold text-foreground">2. Lead Generation Estimates</p>
                    <p>2.1. We will target the geographic areas discussed and agreed upon at the time of sale, with the aim of generating an estimated average number of enquiries per month as outlined in your package confirmation.</p>
                    <p>2.2. Monthly lead averages are calculated by dividing the total number of leads predicted to be generated over a twelve-month period (based on your budget and our national lead calculator) by twelve. As a result, actual lead volumes will fluctuate from month to month. Some months may yield fewer leads than the stated average, while others may exceed it.</p>
                    <p>2.3. Lead estimates are indicative only and do not constitute a guarantee of performance.</p>

                    <p className="font-semibold text-foreground">3. Payment Terms</p>
                    <p>3.1. Your first monthly payment, including the setup fee, is due on the date of purchase.</p>
                    <p>3.2. All subsequent monthly payments will be collected automatically via recurring card payment on the agreed date each month, using the same payment card provided at the time of purchase. Payments will appear on your bank or card statement as &ldquo;Leads Every Day&rdquo;.</p>
                    <p>3.3. It is the Client&apos;s responsibility to ensure that valid and up-to-date payment details are held on file. If you change bank accounts, obtain a replacement card, or update your payment details for any reason, you must notify us in advance of your next payment date.</p>
                    <p>3.4. In the event of repeated payment failures, we reserve the right to suspend or terminate your campaign and discontinue the provision of our services without further notice.</p>

                    <p className="font-semibold text-foreground">4. Minimum Term and Cancellation</p>
                    <p>4.1. There is no long-term contract. Your campaign operates on a rolling month-to-month basis, subject to a minimum initial term of two (2) months.</p>
                    <p>4.2. Should you wish to cancel your campaign, you must submit a written cancellation request by email to cancellations@leadseveryday.co.uk. Cancellation requests made by any other means (including telephone or verbal requests) will not be accepted.</p>
                    <p>4.3. Upon receipt of a valid cancellation request, one further monthly payment will be taken, and you will receive a final monthly cycle of leads before your campaign is terminated.</p>
                    <p>4.4. We are not obliged to process cancellation requests submitted to any email address other than the one specified in clause 4.2.</p>

                    <p className="font-semibold text-foreground">5. Refund Policy</p>
                    <p>5.1. All services are paid for in advance on a month-to-month basis. As our service is delivered on a rolling monthly cycle and no long-term contract is in place, all payments are non-refundable.</p>

                    <p className="font-semibold text-foreground">6. Onboarding and Verification</p>
                    <p>6.1. Following your purchase, you will receive a verification call from a member of our Customer Relations team to confirm the details of your campaign.</p>
                    <p>6.2. Upon completion of the verification call, you will receive a PandaDoc welcome document via email, which must be electronically signed before your campaign can go live.</p>
                    <p>6.3. You must also provide a copy of valid photographic identification as soon as possible after purchase.</p>
                    <p>6.4. Your campaign will not commence on the agreed start date unless both the signed PandaDoc document and a copy of your identification have been received by us.</p>

                    <p className="font-semibold text-foreground">7. General</p>
                    <p>7.1. We reserve the right to amend these terms and conditions from time to time. Any material changes will be communicated to active clients in writing.</p>
                    <p>7.2. These terms and conditions are governed by and construed in accordance with the laws of England and Wales.</p>
                    <p>7.3. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

                    <p className="font-semibold text-foreground mt-4">Leads Every Day</p>
                    <p>Email: cancellations@leadseveryday.co.uk</p>
                  </div>
                  <Button className="w-full text-xs sm:text-sm px-3 py-2 whitespace-normal" disabled={!termsScrolled} onClick={handleAcceptTerms}>
                    {termsScrolled ? "I Accept the Terms & Conditions" : "Please scroll to the bottom to accept"}
                  </Button>
                </AccordionSection>

                {/* Step 3: Pay Setup Fee */}
                <AccordionSection stepNumber={3} title="Pay Setup Fee" isOpen={activeSection === "payment"} isCompleted={completedSteps.has("payment")} isLocked={!completedSteps.has("terms")} onToggle={() => toggleSection("payment")}>
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Setup Fee</p>
                      <p className="text-2xl font-bold mt-1">{formatFee(proposal.setup_fee)} <span className="text-sm font-normal text-foreground/50">+ VAT</span></p>
                    </div>
                    <p className="text-xs text-foreground/50 text-center">
                      You&apos;ll be securely redirected to Stripe to pay the one-off setup fee. Monthly payments of <span className="text-primary font-semibold">{formatFee(proposal.monthly_fee)}</span> will begin via Direct Debit.
                    </p>
                    <Button
                      className="w-full"
                      disabled={redirectingToStripe || verifyingPayment}
                      onClick={async () => {
                        setRedirectingToStripe(true);
                        try {
                          const res = await fetch("/api/billing/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead_id: leadId, setup_fee: proposal.setup_fee, customer_email: detailsForm.email, business_name: detailsForm.business_name }) });
                          const data = await res.json();
                          if (data.url) window.location.href = data.url; else setRedirectingToStripe(false);
                        } catch { setRedirectingToStripe(false); }
                      }}
                    >
                      {redirectingToStripe ? "Redirecting to Stripe..." : verifyingPayment ? "Verifying payment..." : "Pay Setup Fee"}
                    </Button>
                  </div>
                </AccordionSection>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-foreground/30 pb-6">
          This proposal is subject to our standard Terms &amp; Conditions of Business. Prices exclude VAT. Final costs are confirmed on approval. No long-term contract &ndash; after your first month you&apos;re free to give 30 days&apos; notice at any time.
        </p>
      </div>

      {/* Sticky Bottom Bar */}
      {!isPaid && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-white/10 transition-all duration-300 pb-[env(safe-area-inset-bottom)]",
          ctaVisible ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
        )}>
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="font-semibold text-sm">Ready to get started?</p>
              <p className="text-xs text-foreground/50">Setup {formatFee(proposal.setup_fee)} + {formatFee(proposal.monthly_fee)}/mo</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                className="flex-1 sm:flex-none gap-2"
                onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get My Campaign
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2" onClick={handleDiscussProposal} disabled={submitting || discussSent}>
                <IconMessageCircle className="size-4" /> {discussSent ? "Sent" : "Discuss"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Discuss Dialog */}
      <Dialog open={discussOpen} onOpenChange={setDiscussOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <IconCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <DialogTitle className="text-center text-lg">Request Received</DialogTitle>
            <DialogDescription className="text-center">A member of our team will be in touch with you as soon as possible to discuss your proposal.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center"><Button onClick={() => setDiscussOpen(false)}>OK</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} onLoad={() => setGoogleReady(true)} />
    </>
  );
}
