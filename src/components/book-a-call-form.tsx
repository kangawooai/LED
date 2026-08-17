"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CRM_SERVICE_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import { IconCheck, IconSend } from "@tabler/icons-react";
import { useState } from "react";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

/** Self-contained "Book a Call" enquiry form. Posts to /api/enquiry and captures UTM params. */
export function BookACallForm({ className }: { className?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    industry: "",
    trade: "",
  });

  const filteredServices =
    CRM_SERVICE_OPTIONS.find((g) => g.group === formData.industry)?.options ?? [];

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(false);

    const utmData: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      for (const param of UTM_PARAMS) {
        const value = sp.get(param);
        if (value) utmData[param] = value;
      }
    }

    try {
      const selectedOption = CRM_SERVICE_OPTIONS.find(
        (g) => g.group === formData.industry
      )?.options.find((o) => o.label === formData.trade);
      const crmValue = selectedOption?.value ?? formData.trade;

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...utmData, service: crmValue }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8",
        className
      )}
    >
      {submitted ? (
        <div className="text-center py-12">
          <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <IconCheck className="size-8 text-primary" />
          </div>
          <h3 className="text-2xl font-medium text-foreground">
            Thanks for your enquiry!
          </h3>
          <p className="text-foreground/70 mt-2 text-sm">
            One of our team will be in touch within 24 hours to arrange your free
            consultation.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bacf-name">Full Name *</Label>
              <Input
                id="bacf-name"
                name="name"
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bacf-email">Email *</Label>
              <Input
                id="bacf-email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bacf-phone">Phone Number *</Label>
              <Input
                id="bacf-phone"
                name="phone"
                type="tel"
                placeholder="07700 900000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bacf-business">Business Name</Label>
              <Input
                id="bacf-business"
                name="business"
                placeholder="Your business name"
                value={formData.business}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bacf-industry">Industry *</Label>
              <select
                id="bacf-industry"
                name="industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industry: e.target.value,
                    trade: "",
                  }))
                }
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
              <Label htmlFor="bacf-trade">Service *</Label>
              <select
                id="bacf-trade"
                name="trade"
                value={formData.trade}
                onChange={handleChange}
                required
                disabled={!formData.industry}
                className={`${SELECT_CLASS} disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="" disabled>
                  {formData.industry ? "Select service..." : "Select industry first"}
                </option>
                {filteredServices.map((option) => (
                  <option
                    key={option.label}
                    value={option.label}
                    style={
                      option.bespoke
                        ? { color: "#16a34a", fontWeight: 600 }
                        : undefined
                    }
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">
              Something went wrong. Please try again or call us on 0333 0 424 424.
            </p>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" disabled={submitting}>
            <IconSend className="size-4" />
            {submitting ? "Sending..." : "Request a Callback"}
          </Button>
        </form>
      )}
    </div>
  );
}
