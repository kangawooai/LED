"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { NotesSection } from "@/components/dashboard/NotesSection";
import { CommunicationsSection } from "@/components/dashboard/CommunicationsSection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJob, updateJob, updateJobStatus } from "@/lib/api/jobs";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { JobStatus } from "@/lib/types/crm";

const jobStatuses: JobStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    companyName: "", title: "", description: "", value: "",
    scheduledDate: "", scheduledTime: "",
  });

  useEffect(() => {
    if (job) {
      setForm({
        firstName: job.firstName,
        lastName: job.lastName,
        email: job.email,
        phone: job.phone,
        companyName: job.companyName || "",
        title: job.title || "",
        description: job.description || "",
        value: job.value != null ? String(job.value) : "",
        scheduledDate: job.scheduledDate || "",
        scheduledTime: job.scheduledTime || "",
      });
    }
  }, [job]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateJob(id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName,
        title: form.title,
        description: form.description,
        value: form.value ? Number(form.value) : undefined,
        scheduledDate: form.scheduledDate || undefined,
        scheduledTime: form.scheduledTime || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: JobStatus) => updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  if (isLoading) return <div className="text-foreground/40">Loading...</div>;
  if (!job) return <div className="text-foreground/40">Job not found.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push("/jobs")} className="mb-2">
            Back to Jobs
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {job.title || `${job.firstName} ${job.lastName}`}
          </h1>
        </div>
        <StatusBadge status={job.jobStatus || "scheduled"} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-md p-5">
        <h3 className="text-sm font-semibold mb-3">Status</h3>
        <div className="flex gap-2 flex-wrap">
          {jobStatuses.map((s) => (
            <Button
              key={s}
              variant={job.jobStatus === s ? "default" : "outline"}
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
            <Label>Job Title</Label>
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Value (£)</Label>
            <Input type="number" step="0.01" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} />
          </div>
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
            <Label>Scheduled Date</Label>
            <Input type="date" value={form.scheduledDate} onChange={(e) => setForm((p) => ({ ...p, scheduledDate: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Scheduled Time</Label>
            <Input type="time" value={form.scheduledTime} onChange={(e) => setForm((p) => ({ ...p, scheduledTime: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Label>Description</Label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <Button className="mt-4" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <NotesSection customerId={id} notes={job.notes} stage="job" />

      <CommunicationsSection
        customerId={id}
        customerEmail={job.email}
        customerName={`${job.firstName} ${job.lastName}`}
        communications={job.communications || []}
      />
    </div>
  );
}
