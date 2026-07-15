"use client";

import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, updateLeadStatus } from "@/lib/api/leads";
import { useRealtimeSubscription } from "@/lib/hooks/useRealtimeSubscription";
import type { Lead, LeadStatus } from "@/lib/types/crm";
import Link from "next/link";
import { useState } from "react";

const leadColumns: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "converted", label: "Converted" },
  { id: "lost", label: "Lost" },
];

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  useRealtimeSubscription({ table: "customers", queryKey: ["leads"] });

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const filtered = (leads || []).filter((lead) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      lead.firstName.toLowerCase().includes(q) ||
      lead.lastName.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.companyName || "").toLowerCase().includes(q)
    );
  });

  const kanbanItems = filtered.map((lead) => ({
    ...lead,
    status: lead.leadStatus || "new",
  }));

  if (isLoading) return <div className="text-foreground/40">Loading leads...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
      </div>
      <KanbanBoard
        columns={leadColumns}
        items={kanbanItems}
        onStatusChange={(id, status) =>
          statusMutation.mutate({ id, status })
        }
        renderItem={(lead) => (
          <Link href={`/leads/${lead.id}`}>
            <div className="bg-white/5 border border-white/10 rounded-md p-3 hover:border-white/20 transition-colors">
              <p className="text-sm font-medium truncate">
                {lead.firstName} {lead.lastName}
              </p>
              {lead.companyName && (
                <p className="text-xs text-foreground/40 truncate">{lead.companyName}</p>
              )}
              {lead.campaignName && (
                <p className="text-[10px] text-primary truncate mt-1">{lead.campaignName}</p>
              )}
              {lead.value != null && (
                <p className="text-xs font-semibold text-foreground/60 mt-1">£{lead.value}</p>
              )}
            </div>
          </Link>
        )}
      />
    </div>
  );
}
