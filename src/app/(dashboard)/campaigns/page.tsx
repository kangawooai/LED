"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface Campaign {
  id: string;
  // CRM fields
  name: string | null;
  stage: string | null;
  customers_required: number | null;
  // Proposal linking fields
  proposal_lead_id: string | null;
  opportunity_id: string | null;
  linked_id: string | null;
  // Shared fields
  service: string;
  target_area: string;
  monthly_fee: number;
  setup_fee: number | string | null;
  billing_day: number;
  campaign_status: string | null;
  created_at: string;
  updated_at: string;
  // Proposal-specific fields
  industry: string | null;
  required_leads: string | null;
  conversion_rate: string | null;
  custom_leads: string | null;
  total_fee: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  company_address: string | null;
  company_number: string | null;
  stripe_customer_id: string | null;
  stripe_payment_id: string | null;
}

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const [search, setSearch] = useState("");

  // Only show campaigns (not proposals from CRM seed data)
  const activeCampaigns = (campaigns || []).filter(
    (c) => c.stage === "campaign" || c.proposal_lead_id
  );

  const filtered = activeCampaigns.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.service || "").toLowerCase().includes(q) ||
      (c.target_area || "").toLowerCase().includes(q) ||
      (c.business_name || c.name || "").toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return <div className="text-foreground/40">Loading campaigns...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Campaigns</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-md p-4">
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
            Total Campaigns
          </p>
          <p className="text-xl font-bold">{activeCampaigns.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-md p-4">
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
            Monthly Revenue
          </p>
          <p className="text-xl font-bold text-primary">
            £
            {activeCampaigns
              .reduce((sum, c) => sum + Number(c.monthly_fee), 0)
              .toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-md p-4">
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
            Total Customers/mo
          </p>
          <p className="text-xl font-bold">
            {activeCampaigns.reduce(
              (sum, c) => sum + Number(c.custom_leads || c.required_leads || c.customers_required || 0),
              0
            )}
          </p>
        </div>
      </div>

      {activeCampaigns.length > 1 && (
        <div className="mb-4">
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-md p-8 text-center">
          <p className="text-foreground/40">
            {activeCampaigns.length === 0
              ? "No campaigns yet. Proposals move here once payment is complete."
              : "No campaigns match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const contactName = [c.first_name, c.last_name]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={c.id}
                className="bg-white/5 border border-white/10 rounded-md p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm">{c.service}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    c.campaign_status === "paused"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {c.campaign_status === "paused" ? "Paused" : "Active"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-2 text-center">
                    <p className="text-lg font-bold text-primary">
                      {c.custom_leads || c.required_leads || c.customers_required || 0}
                    </p>
                    <p className="text-[11px] text-foreground/40">customers/mo</p>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-2 text-center">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {c.target_area}
                    </p>
                    <p className="text-[11px] text-foreground/40">location</p>
                  </div>
                </div>

                {contactName && (
                  <p className="text-xs text-foreground/60">
                    {contactName}
                    {c.business_name ? ` — ${c.business_name}` : ""}
                  </p>
                )}

                <p className="text-lg font-bold text-primary">
                  £
                  {Number(c.monthly_fee).toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}
                  /mo
                </p>

                <Link href={`/campaigns/${c.proposal_lead_id || c.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    View Campaign
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
