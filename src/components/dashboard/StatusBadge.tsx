"use client";

import { cn } from "@/lib/utils";

type Status =
  | "active" | "paused"
  | "pending" | "accepted" | "expired"
  | "new" | "contacted" | "qualified" | "converted" | "lost"
  | "scheduled" | "in_progress" | "completed" | "cancelled";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  paused: { label: "Paused", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  pending: { label: "Pending", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  accepted: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  expired: { label: "Expired", className: "bg-white/5 text-foreground/40 border-white/10" },
  new: { label: "New", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  contacted: { label: "Contacted", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  qualified: { label: "Qualified", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  converted: { label: "Converted", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  lost: { label: "Lost", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  scheduled: { label: "Scheduled", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  in_progress: { label: "In Progress", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelled", className: "bg-white/5 text-foreground/40 border-white/10" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const config = statusConfig[status as Status];
  if (!config) {
    return (
      <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border bg-white/5 text-foreground/40 border-white/10", className)}>
        {status}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border", config.className, className)}>
      {config.label}
    </span>
  );
}
