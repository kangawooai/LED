"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { NotesSection } from "@/components/dashboard/NotesSection";
import { CommunicationsSection } from "@/components/dashboard/CommunicationsSection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLead, updateLead, updateLeadStatus } from "@/lib/api/leads";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { LeadStatus } from "@/lib/types/crm";

const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: lead, isLoading } = useQuery({
    queryKey: ["leads", id],
    queryFn: () => getLead(id),
    enabled: !!id,
  });

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    companyName: "", value: "",
  });

  useEffect(() => {
    if (lead) {
      setForm({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        companyName: lead.companyName || "",
        value: lead.value != null ? String(lead.value) : "",
      });
    }
  }, [lead]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateLead(id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName,
        value: form.value ? Number(form.value) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: LeadStatus) => updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  if (isLoading) return <div className="text-foreground/40">Loading...</div>;
  if (!lead) return <div className="text-foreground/40">Lead not found.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push("/leads")} className="mb-2">
            Back to Leads
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {lead.firstName} {lead.lastName}
          </h1>
        </div>
        <StatusBadge status={lead.leadStatus || "new"} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-md p-5">
        <h3 className="text-sm font-semibold mb-3">Status</h3>
        <div className="flex gap-2 flex-wrap">
          {leadStatuses.map((s) => (
            <Button
              key={s}
              variant={lead.leadStatus === s ? "default" : "outline"}
              size="sm"
              onClick={() => statusMutation.mutate(s)}
              disabled={statusMutation.isPending}
            >
              {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-md p-5">
        <h3 className="text-sm font-semibold mb-3">Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Value (£)</Label>
            <Input type="number" step="0.01" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} />
          </div>
        </div>
        <Button className="mt-4" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {lead.aiSummary && (
        <div className="bg-primary/5 border border-primary/20 rounded-md p-5">
          <h3 className="text-sm font-semibold mb-2 text-primary">AI Summary</h3>
          <p className="text-sm text-foreground/70">{lead.aiSummary}</p>
        </div>
      )}

      <NotesSection customerId={id} notes={lead.notes} stage="lead" />

      <CommunicationsSection
        customerId={id}
        customerEmail={lead.email}
        customerName={`${lead.firstName} ${lead.lastName}`}
        communications={lead.communications || []}
      />
    </div>
  );
}
