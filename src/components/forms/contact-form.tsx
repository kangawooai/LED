"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getCrmServiceName } from "@/constants";
import { IconSend } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface ContactFormProps {
  serviceName: string;
}

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const ContactForm = ({ serviceName }: ContactFormProps) => {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const utmData: Record<string, string> = {};
    for (const param of UTM_PARAMS) {
      const value = searchParams.get(param);
      if (value) utmData[param] = value;
    }

    try {
      await fetch("https://hooks.zapier.com/hooks/catch/24449961/4b3cuby/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          ...utmData,
          service: getCrmServiceName(serviceName),
        }),
      });

      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-medium text-foreground">
          Thanks for your enquiry!
        </h3>
        <p className="text-foreground/70 mt-2 text-sm">
          We&apos;ll be in touch within 24 hours to discuss your{" "}
          {serviceName.toLowerCase()} lead generation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Smith"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
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
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="07700 900000"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">Business Name</Label>
          <Input
            id="business"
            name="business"
            placeholder="Your business name"
            value={formData.business}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">
          Something went wrong. Please try again or call us on 0333 0 424 424.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full mt-2" disabled={submitting}>
        <IconSend className="size-4" />
        {submitting ? "Sending..." : "Get Started"}
      </Button>
    </form>
  );
};

export default ContactForm;
