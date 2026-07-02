"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProposal } from "@/lib/api/proposals";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProposalPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    service: "",
    targetArea: "",
    customersRequired: "20",
    monthlyFee: "",
    setupFee: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createProposal({
        name: form.name,
        description: form.description,
        service: form.service,
        targetArea: form.targetArea,
        customersRequired: Number(form.customersRequired),
        monthlyFee: Number(form.monthlyFee),
        setupFee: Number(form.setupFee),
      });
      router.push("/proposals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New Proposal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Proposal Name *</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Input id="service" name="service" value={form.service} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetArea">Target Area *</Label>
            <Input id="targetArea" name="targetArea" value={form.targetArea} onChange={handleChange} required />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customersRequired">Customers/mo</Label>
            <Input id="customersRequired" name="customersRequired" type="number" value={form.customersRequired} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyFee">Monthly Fee *</Label>
            <Input id="monthlyFee" name="monthlyFee" type="number" step="0.01" value={form.monthlyFee} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setupFee">Setup Fee</Label>
            <Input id="setupFee" name="setupFee" type="number" step="0.01" value={form.setupFee} onChange={handleChange} />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating..." : "Create Proposal"}
        </Button>
      </form>
    </div>
  );
}
