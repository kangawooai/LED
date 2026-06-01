"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATS, CRM_SERVICE_OPTIONS } from "@/constants";
import {
  IconPhone,
  IconSend,
  IconCheck,
  IconClock,
  IconUserCheck,
  IconChartBar,
} from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

const benefits = [
  {
    icon: IconClock,
    title: "Quick & Easy",
    description:
      "Fill in the form and we'll call you back within 24 hours at a time that suits you.",
  },
  {
    icon: IconChartBar,
    title: "Free Lead Forecast",
    description:
      "We'll tell you exactly how many leads to expect based on your trade, area, and budget.",
  },
  {
    icon: IconUserCheck,
    title: "No Obligation",
    description:
      "No hard sell, no contracts. Just a straightforward conversation about growing your business.",
  },
];

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const BookACallContent = () => {
  const searchParams = useSearchParams();
  const benefitsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    industry: "",
    trade: "",
  });

  const filteredServices =
    CRM_SERVICE_OPTIONS.find((g) => g.group === formData.industry)?.options ??
    [];

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
    setSubmitting(true);
    setError(false);

    const utmData: Record<string, string> = {};
    for (const param of UTM_PARAMS) {
      const value = searchParams.get(param);
      if (value) utmData[param] = value;
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...utmData,
          service: formData.trade,
        }),
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
    <div>
      {/* Hero */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm uppercase tracking-widest text-primary font-semibold"
          >
            Get Started
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            Book a <span className="text-primary">Free Call</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl text-foreground/70 text-sm lg:text-base"
          >
            Tell us about your business and we&apos;ll show you exactly how many
            leads we can deliver. No obligations, no hard sell -- just a
            straightforward conversation about growing your business.
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8"
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
                    One of our team will be in touch within 24 hours to arrange
                    your free consultation.
                  </p>
                </div>
              ) : (
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            industry: e.target.value,
                            trade: "",
                          }));
                        }}
                        required
                        className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                      >
                        <option value="" disabled>
                          Select industry...
                        </option>
                        {CRM_SERVICE_OPTIONS.map((group) => (
                          <option key={group.group} value={group.group}>
                            {group.group}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trade">Service *</Label>
                      <select
                        id="trade"
                        name="trade"
                        value={formData.trade}
                        onChange={handleChange}
                        required
                        disabled={!formData.industry}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                      >
                        <option value="" disabled>
                          {formData.industry
                            ? "Select service..."
                            : "Select industry first"}
                        </option>
                        {filteredServices.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                        {formData.industry && (
                          <option value="Other">Other</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">
                      Something went wrong. Please try again or call us on 0333
                      0 424 424.
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-2"
                    disabled={submitting}
                  >
                    <IconSend className="size-4" />
                    {submitting ? "Sending..." : "Request a Callback"}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl tracking-tight mb-4">
                  Prefer to Call?
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base mb-4">
                  Speak to one of our team directly. We&apos;re available Monday
                  to Friday, 9am to 5pm.
                </p>
                <a href="tel:+443330424424">
                  <Button size="lg">
                    <IconPhone className="size-4" />
                    0333 0 424 424
                  </Button>
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl tracking-tight mb-4">
                  What Happens Next?
                </h3>
                <ol className="space-y-3 text-foreground/70 text-sm lg:text-[15px]">
                  <li className="flex items-start gap-3">
                    <span className="size-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      1
                    </span>
                    <span>
                      We&apos;ll call you back within 24 hours to learn about
                      your business
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="size-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      2
                    </span>
                    <span>
                      We&apos;ll give you a free lead forecast for your trade
                      and area
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="size-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      3
                    </span>
                    <span>
                      If you&apos;re happy, we build your landing page and
                      launch your campaign
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="size-6 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      4
                    </span>
                    <span>
                      You start getting leads -- most clients see results within
                      24 hours
                    </span>
                  </li>
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 },
              },
            }}
            className="grid md:grid-cols-3 gap-4"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-6"
                >
                  <div className="size-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-xl tracking-tight">{benefit.title}</h3>
                  <p className="text-foreground/70 mt-2 text-sm lg:text-[15px]">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 2xl:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-left md:text-center">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const BookACall = () => (
  <Suspense>
    <BookACallContent />
  </Suspense>
);

export default BookACall;
