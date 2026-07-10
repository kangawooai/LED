"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CRM_SERVICE_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useCallback, useRef, useState } from "react";

type Step = 1 | 2;

const API_ENDPOINT = "/api/onboarding";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const SELECT_DISABLED_CLASS = `${SELECT_CLASS} disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`;

const slideVariants = {
  initial: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  animate: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
};

const STEPS = [
  { number: 1, label: "Your Details" },
  { number: 2, label: "Your Requirements" },
  { number: 3, label: "Your Proposal" },
] as const;

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => (
          <Fragment key={step.number}>
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                currentStep > step.number
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-transparent border-white/20 text-white/40"
              )}
            >
              {currentStep > step.number ? (
                <IconCheck className="size-4" />
              ) : (
                step.number
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 md:w-20 mx-2 transition-colors",
                  currentStep > step.number ? "bg-primary" : "bg-white/10"
                )}
              />
            )}
          </Fragment>
        ))}
      </div>
      <p className="text-center text-sm text-foreground/50 mt-3">
        {STEPS.find((s) => s.number === currentStep)?.label}
      </p>
    </div>
  );
}

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

function GetStartedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);

  // Step 1 form
  const [contactForm, setContactForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    business_name: "",
    industry: "",
    service: "",
  });

  // Step 1 result
  const [leadId, setLeadId] = useState<string | null>(null);

  // Step 2 form
  const [preferencesForm, setPreferencesForm] = useState({
    target_area: "",
    required_leads: "20",
    conversion_rate: "80",
  });
  const [customLeads, setCustomLeads] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Places
  const [googleReady, setGoogleReady] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const targetAreaCallbackRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (!node) {
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        }
        return;
      }

      if (autocompleteRef.current) return;
      if (!window.google?.maps?.places) return;

      const ac = new google.maps.places.Autocomplete(node, {
        types: ["(cities)"],
        componentRestrictions: { country: "gb" },
        fields: ["name"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place.name) {
          setPreferencesForm((prev) => ({
            ...prev,
            target_area: place.name!,
          }));
        }
      });

      autocompleteRef.current = ac;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [googleReady]
  );

  const filteredServices =
    CRM_SERVICE_OPTIONS.find((g) => g.group === contactForm.industry)
      ?.options ?? [];

  const getUtmData = () => {
    const data: Record<string, string> = {};
    const mapping: Record<string, string> = {
      utm_source: "source",
      utm_medium: "medium",
      utm_campaign: "campaign",
      utm_term: "term",
      utm_content: "content",
    };
    for (const [param, key] of Object.entries(mapping)) {
      const value = searchParams.get(param);
      if (value) data[key] = value;
    }
    const q = searchParams.get("q");
    if (q) data.query = q;
    const gl = searchParams.get("gl");
    if (gl) data.gl = gl;
    return data;
  };

  const resolveCrmValue = (label: string) => {
    const option = CRM_SERVICE_OPTIONS.find(
      (g) => g.group === contactForm.industry
    )?.options.find((o) => o.label === label);
    return option?.value ?? label;
  };

  const goToStep = (step: Step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    setError(null);
  };

  const getEffectiveLeads = (sliderValue: string, custom: string) =>
    Number(sliderValue) > 100 ? Number(custom) : Number(sliderValue);

  const formatLeadsDisplay = (value: string) =>
    Number(value) > 100 ? "100+" : value;

  // ── Step 1 submit ──
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const utmData = getUtmData();

    const payload = {
      first_name: contactForm.first_name,
      last_name: contactForm.last_name,
      business_name: contactForm.business_name,
      service: resolveCrmValue(contactForm.service),
      phone: contactForm.phone,
      email: contactForm.email,
      ...utmData,
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, ...payload }),
      });
      const data = await res.json();
      if (data.Successful === "200" && data.lead_id) {
        setLeadId(data.lead_id);
        goToStep(2);
      } else {
        throw new Error("Unexpected response");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 2 submit ──
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      required_leads: getEffectiveLeads(
        preferencesForm.required_leads,
        customLeads
      ),
      conversion_rate: Number(preferencesForm.conversion_rate),
      service_type: resolveCrmValue(contactForm.service),
      LeadID: leadId,
      TargetArea: preferencesForm.target_area,
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, ...payload }),
      });
      const data = await res.json();
      if (data.Successful === "200") {
        // Store proposal data for the proposal page
        sessionStorage.setItem(
          "proposal_data",
          JSON.stringify({
            proposal: {
              monthly_fee: data.monthly_fee,
              setup_fee: data.setup_fee,
              total_fee: data.total_fee,
            },
            industry: contactForm.industry,
            service: contactForm.service,
            target_area: preferencesForm.target_area,
            required_leads: preferencesForm.required_leads,
            conversion_rate: preferencesForm.conversion_rate,
            customLeads,
            avg_job_value: Number(data.average_job_value) || 0,
            desired_return: Number(data.roi) || 0,
            contact: {
              first_name: contactForm.first_name,
              last_name: contactForm.last_name,
              email: contactForm.email,
              phone: contactForm.phone,
              business_name: contactForm.business_name,
            },
          })
        );

        // Persist to Supabase (fire-and-forget, sessionStorage is fallback)
        fetch("/api/proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_id: leadId,
            monthly_fee: data.monthly_fee,
            setup_fee: data.setup_fee,
            total_fee: data.total_fee,
            industry: contactForm.industry,
            service: contactForm.service,
            target_area: preferencesForm.target_area,
            required_leads: preferencesForm.required_leads,
            conversion_rate: preferencesForm.conversion_rate,
            custom_leads: customLeads || null,
            avg_job_value: Number(data.average_job_value) || 0,
            desired_return: Number(data.roi) || 0,
          }),
        }).catch(() => {});

        router.push(`/proposal/${leadId}`);
      } else {
        throw new Error("Unexpected response");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait" custom={direction}>
          {/* ── STEP 1: Contact Form ── */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl tracking-tight mb-2">
                  Tell Us About Your Business
                </h2>
                <p className="text-foreground/70 text-sm mb-6">
                  We&apos;ll use this to create your personalised lead forecast.
                </p>
                <form onSubmit={handleStep1Submit} className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="John"
                        value={contactForm.first_name}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Smith"
                        value={contactForm.last_name}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="07700 900000"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      name="business_name"
                      placeholder="Your business name"
                      value={contactForm.business_name}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <select
                        id="industry"
                        name="industry"
                        value={contactForm.industry}
                        onChange={(e) => {
                          setContactForm((prev) => ({
                            ...prev,
                            industry: e.target.value,
                            service: "",
                          }));
                        }}
                        required
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>
                          Select industry...
                        </option>
                        {CRM_SERVICE_OPTIONS.map((group) => (
                          <option key={group.group} value={group.group}>
                            {group.group}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service *</Label>
                      <select
                        id="service"
                        name="service"
                        value={contactForm.service}
                        onChange={handleContactChange}
                        required
                        disabled={!contactForm.industry}
                        className={SELECT_DISABLED_CLASS}
                      >
                        <option value="" disabled>
                          {contactForm.industry
                            ? "Select service..."
                            : "Select industry first"}
                        </option>
                        {filteredServices.map((option) => (
                          <option key={option.label} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-2"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Continue"}
                    <IconArrowRight className="size-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Your Requirements ── */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl tracking-tight mb-2">
                  Your Requirements
                </h2>
                <p className="text-foreground/70 text-sm mb-6">
                  Tell us about your target area and how many customers you need
                  so we can build your quote.
                </p>
                <form onSubmit={handleStep2Submit} className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_area">Target Area *</Label>
                    <Input
                      ref={targetAreaCallbackRef}
                      id="target_area"
                      name="target_area"
                      placeholder="Start typing a town or city..."
                      value={preferencesForm.target_area}
                      onChange={(e) =>
                        setPreferencesForm((prev) => ({
                          ...prev,
                          target_area: e.target.value,
                        }))
                      }
                      required
                      autoComplete="off"
                    />
                  </div>

                  <SliderField
                    label="Required Customers per Month *"
                    value={preferencesForm.required_leads}
                    onChange={(v) =>
                      setPreferencesForm((prev) => ({
                        ...prev,
                        required_leads: v,
                      }))
                    }
                    min={5}
                    max={101}
                    step={1}
                    displayValue={formatLeadsDisplay(
                      preferencesForm.required_leads
                    )}
                  >
                    {Number(preferencesForm.required_leads) > 100 && (
                      <Input
                        type="number"
                        min={101}
                        placeholder="Enter exact number of customers..."
                        value={customLeads}
                        onChange={(e) => setCustomLeads(e.target.value)}
                        required
                        className="mt-2"
                      />
                    )}
                  </SliderField>

                  <SliderField
                    label="Expected Conversion Rate *"
                    value={preferencesForm.conversion_rate}
                    onChange={(v) =>
                      setPreferencesForm((prev) => ({
                        ...prev,
                        conversion_rate: v,
                      }))
                    }
                    min={10}
                    max={100}
                    step={10}
                    displayValue={`${preferencesForm.conversion_rate}%`}
                  />

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => goToStep(1)}
                      className="flex-1"
                    >
                      <IconArrowLeft className="size-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
                      disabled={submitting}
                    >
                      {submitting ? "Calculating..." : "Get My Quote"}
                      <IconArrowRight className="size-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

export default function GetStartedClient() {
  return (
    <Suspense>
      <GetStartedContent />
    </Suspense>
  );
}
