"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface ProposalProgress {
  id: string;
  lead_id: string;
  monthly_fee: number;
  setup_fee: string;
  total_fee: string;
  industry: string;
  service: string;
  target_area: string;
  required_leads: string;
  conversion_rate: string;
  custom_leads: string | null;
  proposal_accepted: boolean;
  completed_steps: string[];
  active_section: string | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  company_address: string | null;
  company_number: string | null;
}

async function fetchProposals(): Promise<ProposalProgress[]> {
  const res = await fetch("/api/proposals?status=pending");
  if (!res.ok) throw new Error("Failed to fetch proposals");
  return res.json();
}

function getStatus(p: ProposalProgress) {
  if (p.proposal_accepted && p.completed_steps?.includes("confirm")) {
    return { label: "Complete", color: "bg-emerald-500/20 text-emerald-400" };
  }
  if (p.proposal_accepted) {
    return { label: "Accepted", color: "bg-blue-500/20 text-blue-400" };
  }
  if (p.completed_steps?.length > 0) {
    return { label: "In Progress", color: "bg-amber-500/20 text-amber-400" };
  }
  return { label: "Pending", color: "bg-foreground/10 text-foreground/50" };
}

export default function ProposalsPage() {
  const { data: proposals, isLoading } = useQuery({
    queryKey: ["proposal-progress"],
    queryFn: fetchProposals,
    staleTime: 0,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return <div className="text-foreground/40">Loading proposals...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Proposals</h1>
      </div>

      {!proposals || proposals.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-md p-8 text-center">
          <p className="text-foreground/40">No proposals yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p) => {
            const status = getStatus(p);
            return (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 rounded-md p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm">{p.service}</h3>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-2 text-center">
                    <p className="text-lg font-bold text-primary">
                      {p.custom_leads || p.required_leads}
                    </p>
                    <p className="text-[11px] text-foreground/40">customers/mo</p>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-2 text-center">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {p.target_area}
                    </p>
                    <p className="text-[11px] text-foreground/40">location</p>
                  </div>
                </div>

                <Link href={`/proposals/${p.lead_id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    View Proposal
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
