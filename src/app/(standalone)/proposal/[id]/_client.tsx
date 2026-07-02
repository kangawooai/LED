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
import { CRM_SERVICE_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconChevronDown,
  IconLock,
  IconMessageCircle,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

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
}

/* ─── Constants ─── */

const API_ENDPOINT = "/api/onboarding";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

/* ─── AccordionSection ─── */

function AccordionSection({
  stepNumber,
  title,
  isOpen,
  isCompleted,
  isLocked,
  onToggle,
  children,
}: {
  stepNumber: number;
  title: string;
  isOpen: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-md border rounded-md overflow-hidden transition-colors",
        isOpen
          ? "border-primary/30"
          : isCompleted
            ? "border-primary/20"
            : "border-white/10"
      )}
    >
      <button
        type="button"
        onClick={isLocked ? undefined : onToggle}
        disabled={isLocked}
        className={cn(
          "w-full flex items-center gap-3 p-4 md:p-5 text-left transition-colors",
          isLocked
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer hover:bg-white/5"
        )}
      >
        <div
          className={cn(
            "size-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0 transition-colors",
            isCompleted
              ? "bg-primary border-primary text-primary-foreground"
              : isOpen
                ? "bg-primary/20 border-primary text-primary"
                : "border-white/20 text-white/40"
          )}
        >
          {isCompleted ? <IconCheck className="size-3.5" /> : stepNumber}
        </div>
        <span
          className={cn(
            "font-semibold text-sm flex-1 transition-colors",
            isLocked ? "text-white/40" : "text-foreground"
          )}
        >
          {title}
        </span>
        {isLocked ? (
          <IconLock className="size-4 text-white/30" />
        ) : (
          <IconChevronDown
            className={cn(
              "size-4 text-white/50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SliderField ─── */

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayValue,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-semibold text-primary">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="slider w-full"
      />
      {children}
    </div>
  );
}

/* ─── Main Component ─── */

export default function ProposalClient({ leadId }: { leadId: string }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [industry, setIndustry] = useState("");
  const [targetArea, setTargetArea] = useState("");

  // Requirements edits
  const [proposalEdits, setProposalEdits] = useState({
    service_type: "",
    required_leads: "20",
    conversion_rate: "80",
  });
  const [proposalCustomLeads, setProposalCustomLeads] = useState("");

  // Snapshot of values used for the current quote (updated only on recalculate)
  const [quotedValues, setQuotedValues] = useState({
    service_type: "",
    required_leads: "20",
    conversion_rate: "80",
    customLeads: "",
  });

  // Company details form (contact fields + address + company number)
  const [detailsForm, setDetailsForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    business_name: "",
    company_address: "",
    street_address: "",
    city: "",
    country: "",
    post_code: "",
    company_number: "",
  });

  // Step progression
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set()
  );
  const [proposalAccepted, setProposalAccepted] = useState(false);

  // Contact data (from sessionStorage, for discuss proposal email)
  const [contact, setContact] = useState<ContactData | null>(null);

  // Discuss proposal dialog
  const [discussOpen, setDiscussOpen] = useState(false);
  const [discussSent, setDiscussSent] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [redirectingToStripe, setRedirectingToStripe] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [stripePaymentId, setStripePaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const searchParams = useSearchParams();

  // Google Places for address lookup
  const [googleReady, setGoogleReady] = useState(false);
  const addressAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const addressCallbackRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (!node) {
        if (addressAutocompleteRef.current) {
          google.maps.event.clearInstanceListeners(addressAutocompleteRef.current);
          addressAutocompleteRef.current = null;
        }
        return;
      }

      if (addressAutocompleteRef.current) return;
      if (!window.google?.maps?.places) return;

      const ac = new google.maps.places.Autocomplete(node, {
        types: ["address"],
        componentRestrictions: { country: "gb" },
        fields: ["formatted_address", "address_components"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place.formatted_address) {
          const parts = place.address_components || [];
          const get = (type: string) =>
            parts.find((c) => c.types.includes(type))?.long_name || "";

          const streetNumber = get("street_number");
          const route = get("route");
          const street = [streetNumber, route].filter(Boolean).join(" ");

          setDetailsForm((prev) => ({
            ...prev,
            company_address: place.formatted_address!,
            street_address: street,
            city: get("postal_town") || get("locality"),
            country: get("country"),
            post_code: get("postal_code"),
          }));
        }
      });

      addressAutocompleteRef.current = ac;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [googleReady]
  );

  // Save progress to Supabase (fire-and-forget)
  const saveProgress = useCallback(
    (updates: Record<string, unknown>) => {
      fetch("/api/proposal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, ...updates }),
      })
        .then((res) => {
          if (!res.ok) console.error("[saveProgress] PATCH failed:", res.status);
        })
        .catch((err) => console.error("[saveProgress] error:", err));
    },
    [leadId]
  );

  // Load proposal data: try Supabase first, fall back to sessionStorage
  useEffect(() => {
    let cancelled = false;

    async function loadProposal() {
      // 1. Try Supabase
      try {
        const res = await fetch(
          `/api/proposal?lead_id=${encodeURIComponent(leadId)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && !data.error) {
            setProposal({
              monthly_fee: data.monthly_fee,
              setup_fee: data.setup_fee,
              total_fee: data.total_fee,
            });
            setIndustry(data.industry);
            setTargetArea(data.target_area);
            const edits = {
              service_type: data.service,
              required_leads: data.required_leads,
              conversion_rate: data.conversion_rate,
            };
            setProposalEdits(edits);
            setQuotedValues({
              ...edits,
              customLeads: data.custom_leads || "",
            });
            if (Number(data.required_leads) > 100) {
              setProposalCustomLeads(data.custom_leads || "");
            }
            // Restore step progress
            setProposalAccepted(data.proposal_accepted ?? false);
            setCompletedSteps(new Set(data.completed_steps ?? []));
            setActiveSection(data.active_section ?? null);

            // Restore Stripe payment ID for confirmation display
            if (data.stripe_payment_id) {
              setStripePaymentId(data.stripe_payment_id);
            }

            // Restore company details if saved
            if (data.first_name || data.email) {
              const contactData: ContactData = {
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                phone: data.phone || "",
                business_name: data.business_name || "",
              };
              setContact(contactData);
              setDetailsForm({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                phone: data.phone || "",
                business_name: data.business_name || "",
                company_address: data.company_address || "",
                street_address: data.street_address || "",
                city: data.city || "",
                country: data.country || "",
                post_code: data.post_code || "",
                company_number: data.company_number || "",
              });
            }

            setLoaded(true);
            return;
          }
        }
      } catch {
        // Supabase fetch failed, try sessionStorage
      }

      // 2. Fallback: sessionStorage
      try {
        const raw = sessionStorage.getItem("proposal_data");
        if (raw) {
          const data: ProposalData = JSON.parse(raw);
          if (!cancelled) {
            setProposal(data.proposal);
            setIndustry(data.industry);
            setTargetArea(data.target_area);
            const edits = {
              service_type: data.service,
              required_leads: data.required_leads,
              conversion_rate: data.conversion_rate,
            };
            setProposalEdits(edits);
            setQuotedValues({
              ...edits,
              customLeads: data.customLeads || "",
            });
            if (Number(data.required_leads) > 100) {
              setProposalCustomLeads(data.customLeads);
            }
            if (data.contact) {
              setContact(data.contact);
              setDetailsForm((prev) => ({
                ...prev,
                first_name: data.contact!.first_name || "",
                last_name: data.contact!.last_name || "",
                email: data.contact!.email || "",
                phone: data.contact!.phone || "",
                business_name: data.contact!.business_name || "",
              }));
            }

            // Sync sessionStorage data to Supabase so future PATCHes work
            // Await this so the row exists before user can interact
            try {
              await fetch("/api/proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  lead_id: leadId,
                  monthly_fee: data.proposal.monthly_fee,
                  setup_fee: data.proposal.setup_fee,
                  total_fee: data.proposal.total_fee,
                  industry: data.industry,
                  service: data.service,
                  target_area: data.target_area,
                  required_leads: data.required_leads,
                  conversion_rate: data.conversion_rate,
                  custom_leads: data.customLeads || null,
                }),
              });
            } catch {
              // Sync failed — PATCHes may not persist but UI still works
            }
          }
        }
      } catch {
        // Invalid sessionStorage data
      }
      if (!cancelled) setLoaded(true);
    }

    loadProposal();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  // Fetch lead data from Salesforce on mount (overwrites sessionStorage fallback)
  useEffect(() => {
    if (!leadId) return;

    fetch("/api/company-details/fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        const contactData: ContactData = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone != null ? String(data.phone) : "",
          business_name: data.business_name || "",
        };
        // Only update contact/details if they haven't been set from Supabase
        setContact((prev) => prev ?? contactData);
        setDetailsForm((prev) => ({
          ...prev,
          first_name: prev.first_name || contactData.first_name,
          last_name: prev.last_name || contactData.last_name,
          email: prev.email || contactData.email,
          phone: prev.phone || contactData.phone,
          business_name: prev.business_name || contactData.business_name,
          company_address: prev.company_address || data.address || "",
          street_address: prev.street_address || data.street_address || "",
          city: prev.city || data.city || "",
          country: prev.country || data.country || "",
          post_code: prev.post_code || data.post_code || "",
          company_number: prev.company_number || (data.company_number != null ? String(data.company_number) : ""),
        }));
      })
      .catch(() => {
        // Salesforce fetch failed — sessionStorage fallback is already set
      });
  }, [leadId]);

  // Handle return from Stripe Checkout
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || !loaded || completedSteps.has("confirm")) return;

    let cancelled = false;

    async function verifyStripePayment() {
      setVerifyingPayment(true);
      try {
        const res = await fetch("/api/billing/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, lead_id: leadId }),
        });

        if (!res.ok) {
          const data = await res.json();
          console.error("[stripe] verification failed:", data.error);
          setVerifyingPayment(false);
          return;
        }

        const { customer_id, payment_intent_id } = await res.json();
        if (cancelled) return;

        setStripePaymentId(payment_intent_id);

        // Fire Omnitoria lead-to-opportunity webhook with real Stripe IDs
        try {
          const webhookRes = await fetch("/api/webhooks/lead-to-opportunity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lead_id: leadId,
              customer_id: customer_id || "",
              payment_id: payment_intent_id || "",
              subscription_date: new Date().toISOString(),
              subscription_id: "",
            }),
          });

          if (webhookRes.ok) {
            const webhookData = await webhookRes.json();
            console.log("[stripe] lead-to-opportunity linked_id:", webhookData.linked_id);
          } else {
            console.error("[stripe] lead-to-opportunity webhook failed");
          }
        } catch (err) {
          console.error("[stripe] lead-to-opportunity webhook error:", err);
        }

        if (cancelled) return;

        // Mark all payment steps as complete
        const newSteps = new Set([...completedSteps, "payment", "confirm"]);
        setCompletedSteps(newSteps);
        setActiveSection(null);
        saveProgress({
          completed_steps: [...newSteps],
          active_section: null,
          stripe_customer_id: customer_id,
          stripe_payment_id: payment_intent_id,
        });

        // Clean the session_id from the URL without triggering a reload
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.pathname);
      } catch (err) {
        console.error("[stripe] verification error:", err);
      } finally {
        if (!cancelled) setVerifyingPayment(false);
      }
    }

    verifyStripePayment();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loaded]);

  const proposalServices =
    CRM_SERVICE_OPTIONS.find((g) => g.group === industry)?.options ?? [];

  const resolveCrmValue = (label: string) => {
    const option = CRM_SERVICE_OPTIONS.find(
      (g) => g.group === industry
    )?.options.find((o) => o.label === label);
    return option?.value ?? label;
  };

  const getEffectiveLeads = (sliderValue: string, custom: string) =>
    Number(sliderValue) > 100 ? Number(custom) : Number(sliderValue);

  const formatLeadsDisplay = (value: string) =>
    Number(value) > 100 ? "100+" : value;

  const formatFee = (fee: string | number) => {
    const num = typeof fee === "string" ? parseFloat(fee) : fee;
    if (isNaN(num)) return fee;
    return `\u00A3${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  /* ── Update Quote ── */
  const recalculateProposal = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      required_leads: getEffectiveLeads(
        proposalEdits.required_leads,
        proposalCustomLeads
      ),
      conversion_rate: Number(proposalEdits.conversion_rate),
      service_type: resolveCrmValue(proposalEdits.service_type),
      LeadID: leadId,
      TargetArea: targetArea,
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, ...payload }),
      });
      const data = await res.json();
      if (data.Successful === "200") {
        setProposal({
          monthly_fee: data.monthly_fee,
          setup_fee: data.setup_fee,
          total_fee: data.total_fee,
        });
        setQuotedValues({
          ...proposalEdits,
          customLeads: proposalCustomLeads,
        });
        saveProgress({
          monthly_fee: data.monthly_fee,
          setup_fee: data.setup_fee,
          total_fee: data.total_fee,
          required_leads: proposalEdits.required_leads,
          conversion_rate: proposalEdits.conversion_rate,
          service: proposalEdits.service_type,
          custom_leads: proposalCustomLeads || null,
        });
      }
    } catch {
      setError("Failed to update quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Discuss Proposal ── */
  const handleDiscussProposal = async () => {
    if (submitting) return;
    setSubmitting(true);

    const customers = getEffectiveLeads(
      quotedValues.required_leads,
      quotedValues.customLeads
    );
    const rate = Number(quotedValues.conversion_rate);
    const leads = Math.ceil(customers / (rate / 100));

    // Use contact state, or fall back to re-reading sessionStorage
    let contactData = contact;
    if (!contactData) {
      try {
        const raw = sessionStorage.getItem("proposal_data");
        if (raw) {
          const stored = JSON.parse(raw);
          if (stored.contact) contactData = stored.contact;
        }
      } catch {
        // ignore
      }
    }

    try {
      await fetch("/api/discuss-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          service: quotedValues.service_type,
          customers,
          conversionRate: rate,
          leads,
          targetArea,
          setupFee: proposal ? formatFee(proposal.setup_fee) : "",
          monthlyFee: proposal ? formatFee(proposal.monthly_fee) : "",
          contact: contactData,
        }),
      });
    } catch {
      // Silently fail — still show the confirmation
    } finally {
      setSubmitting(false);
      setDiscussSent(true);
      setDiscussOpen(true);
    }
  };

  /* ── Accept Proposal ── */
  const handleAcceptProposal = () => {
    setProposalAccepted(true);
    const newSteps = new Set([...completedSteps, "requirements"]);
    setCompletedSteps(newSteps);
    setActiveSection("details");
    saveProgress({
      proposal_accepted: true,
      completed_steps: [...newSteps],
      active_section: "details",
    });
  };

  /* ── Save Company Details ── */
  const handleSaveCompanyDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    // Save to Salesforce (may fail — don't block step progression)
    fetch("/api/company-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: detailsForm.first_name,
        last_name: detailsForm.last_name,
        business_name: detailsForm.business_name,
        phone: detailsForm.phone,
        email: detailsForm.email,
        company_number: detailsForm.company_number,
        lead_id: leadId,
        street_address: detailsForm.street_address,
        city: detailsForm.city,
        country: detailsForm.country,
        post_code: detailsForm.post_code,
      }),
    }).catch(() => {});

    // Update contact state so discuss-proposal email stays current
    setContact({
      first_name: detailsForm.first_name,
      last_name: detailsForm.last_name,
      email: detailsForm.email,
      phone: detailsForm.phone,
      business_name: detailsForm.business_name,
    });

    // Advance step and persist to Supabase
    const newSteps = new Set([...completedSteps, "details"]);
    setCompletedSteps(newSteps);
    setActiveSection("payment");
    saveProgress({
      completed_steps: [...newSteps],
      active_section: "payment",
      first_name: detailsForm.first_name,
      last_name: detailsForm.last_name,
      email: detailsForm.email,
      phone: detailsForm.phone,
      business_name: detailsForm.business_name,
      company_address: detailsForm.company_address,
      street_address: detailsForm.street_address,
      city: detailsForm.city,
      country: detailsForm.country,
      post_code: detailsForm.post_code,
      company_number: detailsForm.company_number,
    });

    setSubmitting(false);
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDetailsForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Proposal is fully paid once the final confirm step is completed
  const isPaid = completedSteps.has("confirm");

  /* ── Loading / Not Found ── */
  if (!loaded) return null;

  if (verifyingPayment) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <IconCheck className="size-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl tracking-tight mb-2">
          Verifying Payment
        </h2>
        <p className="text-foreground/70 text-sm">
          Please wait while we confirm your payment...
        </p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
          Proposal Not Found
        </h2>
        <p className="text-foreground/70 text-sm mb-6">
          This proposal has expired or is not available. Please start a new
          quote.
        </p>
        <Link href="/get-started">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="space-y-4">
          {/* ── Quote Display + Adjust Requirements ── */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl tracking-tight mb-2">
              Your Personalised Proposal
            </h2>
            <p className="text-foreground/70 text-sm mb-6">
              Based on your requirements, here is your pricing.
            </p>

            {(() => {
              const customers = getEffectiveLeads(
                quotedValues.required_leads,
                quotedValues.customLeads
              );
              const rate = Number(quotedValues.conversion_rate);
              const leads = Math.ceil(customers / (rate / 100));
              return (
                <div className="bg-white/5 border border-white/10 rounded-md p-4 mb-6 text-sm">
                  <p className="text-foreground/70">
                    <span className="text-foreground font-semibold">
                      {leads}
                    </span>{" "}
                    <span className="text-primary font-semibold">
                      {quotedValues.service_type}
                    </span>{" "}
                    leads at{" "}
                    <span className="text-foreground font-semibold">
                      {rate}%
                    </span>{" "}
                    conversion rate, generating{" "}
                    <span className="text-primary font-semibold">
                      {customers} customers
                    </span>{" "}
                    per month in{" "}
                    <span className="text-foreground font-semibold">
                      {targetArea || "your area"}
                    </span>
                  </p>
                </div>
              );
            })()}

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
              <div className="bg-white/5 rounded-md p-4 border border-white/10">
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Setup Fee
                </p>
                <p className="text-xl md:text-3xl font-bold text-foreground">
                  {formatFee(proposal.setup_fee)}
                </p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-primary mb-1">
                  Monthly Fee
                </p>
                <p className="text-xl md:text-3xl font-bold text-primary">
                  {formatFee(proposal.monthly_fee)}
                </p>
              </div>
            </div>

            {/* Collapsible: Adjust Requirements */}
            {!isPaid && (
            <div className="border-t border-white/10 pt-4 mb-6">
              <button
                type="button"
                onClick={() => toggleSection("requirements")}
                className="w-full flex items-center justify-center gap-2 text-sm text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
              >
                Adjust Your Requirements
                <IconChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    activeSection === "requirements" && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "requirements" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 text-left grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proposal_service">Service</Label>
                        <select
                          id="proposal_service"
                          value={proposalEdits.service_type}
                          onChange={(e) =>
                            setProposalEdits((prev) => ({
                              ...prev,
                              service_type: e.target.value,
                            }))
                          }
                          className={SELECT_CLASS}
                        >
                          {proposalServices.map((option) => (
                            <option key={option.label} value={option.label}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <SliderField
                        label="Number of Customers"
                        value={proposalEdits.required_leads}
                        onChange={(v) =>
                          setProposalEdits((prev) => ({
                            ...prev,
                            required_leads: v,
                          }))
                        }
                        min={5}
                        max={101}
                        step={1}
                        displayValue={formatLeadsDisplay(
                          proposalEdits.required_leads
                        )}
                      >
                        {Number(proposalEdits.required_leads) > 100 && (
                          <Input
                            type="number"
                            min={101}
                            placeholder="Enter exact number..."
                            value={proposalCustomLeads}
                            onChange={(e) =>
                              setProposalCustomLeads(e.target.value)
                            }
                            className="mt-2"
                          />
                        )}
                      </SliderField>

                      <SliderField
                        label="Conversion Rate"
                        value={proposalEdits.conversion_rate}
                        onChange={(v) =>
                          setProposalEdits((prev) => ({
                            ...prev,
                            conversion_rate: v,
                          }))
                        }
                        min={10}
                        max={100}
                        step={10}
                        displayValue={`${proposalEdits.conversion_rate}%`}
                      />

                      {error && activeSection === "requirements" && (
                        <p className="text-red-400 text-sm">{error}</p>
                      )}

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={recalculateProposal}
                        disabled={submitting}
                      >
                        {submitting ? "Recalculating..." : "Update Quote"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            )}

            {isPaid ? (
              <Link href={`/campaigns/${leadId}`}>
                <Button size="lg" className="w-full">
                  View Campaign
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                {proposalAccepted ? (
                  <div className="flex-1 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                    <IconCheck className="size-4" />
                    Proposal Accepted
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAcceptProposal}
                  >
                    <IconCheck className="size-4" />
                    Accept Proposal
                  </Button>
                )}
                <Button
                  variant="muted"
                  size="lg"
                  className="flex-1"
                  onClick={handleDiscussProposal}
                  disabled={submitting || discussSent}
                >
                  <IconMessageCircle className="size-4" />
                  {discussSent ? "Request Sent" : "Discuss Your Proposal"}
                </Button>
              </div>
            )}
          </div>

          {/* ── Step 1: Company Details ── */}
          {!isPaid && (
          <AccordionSection
            stepNumber={1}
            title="Company Details"
            isOpen={activeSection === "details"}
            isCompleted={completedSteps.has("details")}
            isLocked={!proposalAccepted}
            onToggle={() => toggleSection("details")}
          >
            <p className="text-foreground/60 text-sm mb-4">
              Please confirm your details below.
            </p>
            <form onSubmit={handleSaveCompanyDetails} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="First name"
                    value={detailsForm.first_name}
                    onChange={handleDetailsChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Last name"
                    value={detailsForm.last_name}
                    onChange={handleDetailsChange}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="details_email">Email *</Label>
                  <Input
                    id="details_email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={detailsForm.email}
                    onChange={handleDetailsChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details_phone">Phone *</Label>
                  <Input
                    id="details_phone"
                    name="phone"
                    type="tel"
                    placeholder="07700 900000"
                    value={detailsForm.phone}
                    onChange={handleDetailsChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  placeholder="Your business name"
                  value={detailsForm.business_name}
                  onChange={handleDetailsChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_address">Company Address *</Label>
                <Input
                  id="company_address"
                  name="company_address"
                  placeholder="Start typing your address..."
                  value={detailsForm.company_address}
                  onChange={handleDetailsChange}
                  ref={addressCallbackRef}
                  required
                />
              </div>

              {detailsForm.street_address && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street_address">Street Address</Label>
                    <Input
                      id="street_address"
                      name="street_address"
                      value={detailsForm.street_address}
                      onChange={handleDetailsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={detailsForm.city}
                      onChange={handleDetailsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={detailsForm.country}
                      onChange={handleDetailsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post_code">Post Code</Label>
                    <Input
                      id="post_code"
                      name="post_code"
                      value={detailsForm.post_code}
                      onChange={handleDetailsChange}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="company_number">Company Number</Label>
                <Input
                  id="company_number"
                  name="company_number"
                  placeholder="e.g. 12345678"
                  value={detailsForm.company_number}
                  onChange={handleDetailsChange}
                />
              </div>

              {error && activeSection === "details" && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full mt-2"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save & Continue"}
              </Button>
            </form>
          </AccordionSection>
          )}

          {/* ── Step 2: Pay Setup Fee via Stripe ── */}
          {!isPaid && (
          <AccordionSection
            stepNumber={2}
            title="Pay Setup Fee"
            isOpen={activeSection === "payment"}
            isCompleted={completedSteps.has("payment")}
            isLocked={!completedSteps.has("details")}
            onToggle={() => toggleSection("payment")}
          >
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Setup Fee
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatFee(proposal.setup_fee)}
                </p>
              </div>
              <p className="text-foreground/60 text-xs text-center">
                You&apos;ll be securely redirected to Stripe to pay the one-off
                setup fee. Monthly payments of{" "}
                <span className="text-primary font-semibold">
                  {formatFee(proposal.monthly_fee)}
                </span>{" "}
                will begin via Direct Debit.
              </p>
              <Button
                size="lg"
                className="w-full"
                disabled={redirectingToStripe || verifyingPayment}
                onClick={async () => {
                  setRedirectingToStripe(true);
                  try {
                    const res = await fetch("/api/billing/create-checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        lead_id: leadId,
                        setup_fee: proposal.setup_fee,
                        customer_email: detailsForm.email,
                        business_name: detailsForm.business_name,
                      }),
                    });

                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      console.error("[stripe] no checkout URL:", data.error);
                      setRedirectingToStripe(false);
                    }
                  } catch (err) {
                    console.error("[stripe] checkout error:", err);
                    setRedirectingToStripe(false);
                  }
                }}
              >
                {redirectingToStripe
                  ? "Redirecting to Stripe..."
                  : verifyingPayment
                    ? "Verifying payment..."
                    : `Pay ${formatFee(proposal.setup_fee)} Setup Fee`}
              </Button>
            </div>
          </AccordionSection>
          )}

          {/* ── Payment Confirmation ── */}
          {completedSteps.has("confirm") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-md p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <IconCheck className="size-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Payment Complete</h3>
                  <p className="text-xs text-foreground/40">Your campaign is now active</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-foreground/50">Setup Fee Paid</span>
                  <span className="text-sm font-semibold">{formatFee(proposal.setup_fee)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-foreground/50">Monthly Fee (DD)</span>
                  <span className="text-sm font-semibold">{formatFee(proposal.monthly_fee)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-foreground/50">Payment Date</span>
                  <span className="text-sm font-semibold">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-foreground/50">Payment ID</span>
                  <span className="text-sm font-mono text-foreground/70">
                    {stripePaymentId || "—"}
                  </span>
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </div>

      {/* ── Discuss Proposal Confirmation Dialog ── */}
      <Dialog open={discussOpen} onOpenChange={setDiscussOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <IconCheck className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-lg">
              Request Received
            </DialogTitle>
            <DialogDescription className="text-center">
              A member of our team will be in touch with you as soon as possible
              to discuss your proposal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setDiscussOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setGoogleReady(true)}
      />

      <style>{`
        .pac-container {
          background: #0c0c0c !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 0.375rem !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6) !important;
          z-index: 10000 !important;
          margin-top: 4px !important;
          font-family: inherit !important;
          padding: 4px 0 !important;
        }
        .pac-item {
          border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
          padding: 10px 14px !important;
          color: #e5e5e5 !important;
          background: transparent !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
          line-height: 1.4 !important;
        }
        .pac-item:first-child { border-top: none !important; }
        .pac-item:hover, .pac-item-selected {
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .pac-item-query {
          color: #fff !important;
          font-size: 0.875rem !important;
        }
        .pac-matched { font-weight: 600 !important; }
        .pac-icon { display: none !important; }
        .pac-container::after { display: none !important; }
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .slider::-moz-range-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
      `}</style>
    </>
  );
}
