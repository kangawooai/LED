"use client";

import { Input } from "@/components/ui/input";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, updateJobStatus } from "@/lib/api/jobs";
import { useRealtimeSubscription } from "@/lib/hooks/useRealtimeSubscription";
import type { JobStatus } from "@/lib/types/crm";
import Link from "next/link";
import { useState } from "react";

const jobColumns: { id: JobStatus; label: string }[] = [
  { id: "scheduled", label: "Scheduled" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function JobsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  useRealtimeSubscription({ table: "customers", queryKey: ["jobs"] });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const filtered = (jobs || []).filter((job) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      job.firstName.toLowerCase().includes(q) ||
      job.lastName.toLowerCase().includes(q) ||
      (job.title || "").toLowerCase().includes(q) ||
      (job.companyName || "").toLowerCase().includes(q)
    );
  });

  const kanbanItems = filtered.map((job) => ({
    ...job,
    status: job.jobStatus || "scheduled",
  }));

  if (isLoading) return <div className="text-foreground/40">Loading jobs...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <KanbanBoard
        columns={jobColumns}
        items={kanbanItems}
        onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
        renderItem={(job) => (
          <Link href={`/jobs/${job.id}`}>
            <div className="bg-white/5 border border-white/10 rounded-md p-3 hover:border-white/20 transition-colors">
              <p className="text-sm font-medium truncate">
                {job.title || `${job.firstName} ${job.lastName}`}
              </p>
              <p className="text-xs text-foreground/40 truncate">
                {job.firstName} {job.lastName}
              </p>
              {job.scheduledDate && (
                <p className="text-[10px] text-primary mt-1">
                  {new Date(job.scheduledDate).toLocaleDateString()}
                  {job.scheduledTime && ` at ${job.scheduledTime}`}
                </p>
              )}
              {job.value != null && (
                <p className="text-xs font-semibold text-foreground/60 mt-1">£{job.value}</p>
              )}
            </div>
          </Link>
        )}
      />
    </div>
  );
}
