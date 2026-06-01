"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconSend, IconUpload, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";

const CareersForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("phone", formData.phone);
      if (file) body.append("cv", file);

      const res = await fetch("/api/careers", {
        method: "POST",
        body,
      });

      if (!res.ok) throw new Error("Failed");
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
          Thanks for your application!
        </h3>
        <p className="text-foreground/70 mt-2 text-sm">
          We&apos;ll review your CV and be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="career-name">Full Name *</Label>
          <Input
            id="career-name"
            name="name"
            placeholder="John Smith"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="career-email">Email *</Label>
          <Input
            id="career-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="career-phone">Phone Number *</Label>
        <Input
          id="career-phone"
          name="phone"
          type="tel"
          placeholder="07700 900000"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Your CV</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-4 py-3">
            <span className="text-sm text-foreground/80 truncate flex-1">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              <IconX className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full bg-white/5 border border-white/10 border-dashed rounded-md px-4 py-3 text-sm text-foreground/50 hover:text-foreground/70 hover:border-white/20 transition-colors cursor-pointer"
          >
            <IconUpload className="size-4" />
            Choose file (PDF, DOC, DOCX)
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm">
          Something went wrong. Please try again or call us on 0333 0 424 424.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full mt-2" disabled={submitting}>
        <IconSend className="size-4" />
        {submitting ? "Sending..." : "Submit Application"}
      </Button>
    </form>
  );
};

export default CareersForm;
