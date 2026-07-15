"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getNextBillingDate,
  getOrdinalSuffix,
  calculateBillingChange,
} from "@/lib/utils/billing-schedule";

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
  last_billed_date: string | null;
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

async function fetchCampaign(leadId: string): Promise<Campaign> {
  const res = await fetch(`/api/campaigns/${leadId}`);
  if (!res.ok) throw new Error("Failed to fetch campaign");
  return res.json();
}

export default function CampaignDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const leadId = params.id as string;
  const queryClient = useQueryClient();

  const [editingBilling, setEditingBilling] = useState(false);
  const [newBillingDay, setNewBillingDay] = useState<number>(1);
  const [redirectingToStripe, setRedirectingToStripe] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [billingSuccess, setBillingSuccess] = useState(false);
  const confirmedRef = useRef(false);

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", leadId],
    queryFn: () => fetchCampaign(leadId),
    enabled: !!leadId,
  });

  // Direct billing day change (no pro-rata required)
  const billingMutation = useMutation({
    mutationFn: async (billingDay: number) => {
      const res = await fetch(`/api/campaigns/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing_day: billingDay }),
      });
      if (!res.ok) throw new Error("Failed to update billing day");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign", leadId] });
      setEditingBilling(false);
    },
  });

  // Handle return from Stripe checkout — confirm and apply billing day change
  useEffect(() => {
    const billingSession = searchParams.get("billing_session");
    if (!billingSession || confirmedRef.current) return;
    confirmedRef.current = true;
    setConfirmingPayment(true);

    fetch(`/api/campaigns/${leadId}/billing/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: billingSession }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBillingSuccess(true);
          queryClient.invalidateQueries({ queryKey: ["campaign", leadId] });
          // Clean up URL params
          const url = new URL(window.location.href);
          url.searchParams.delete("billing_session");
          window.history.replaceState({}, "", url.toString());
        }
      })
      .catch((err) => {
        console.error("Failed to confirm billing change:", err);
      })
      .finally(() => {
        setConfirmingPayment(false);
      });
  }, [searchParams, leadId, queryClient]);

  if (isLoading || confirmingPayment) {
    return (
      <div className="text-foreground/40">
        {confirmingPayment ? "Confirming billing change payment..." : "Loading campaign..."}
      </div>
    );
  }

  if (!campaign) {
    return (
      <div>
        <Link href="/campaigns" className="text-foreground/40 hover:text-foreground text-sm">
          &larr; Back to Campaigns
        </Link>
        <p className="text-foreground/40 mt-6">Campaign not found.</p>
      </div>
    );
  }

  const customers = campaign.custom_leads || campaign.required_leads || campaign.customers_required || 0;

  // Billing day: use stored value, or fall back to creation date's day
  const billingDay = campaign.billing_day || new Date(campaign.created_at).getDate();
  const lastBilledDate = campaign.last_billed_date
    ? new Date(campaign.last_billed_date)
    : (() => {
        // No billing history — assume the most recent occurrence of the billing day
        // so the gap calculation doesn't produce a huge span from created_at
        const now = new Date();
        if (now.getDate() >= billingDay) {
          return new Date(now.getFullYear(), now.getMonth(), billingDay);
        }
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return new Date(prevYear, prevMonth, billingDay);
      })();
  const nextBilling = getNextBillingDate(new Date(), billingDay, lastBilledDate);

  // Calculate billing change preview when editing
  const billingChange =
    editingBilling && newBillingDay !== billingDay
      ? calculateBillingChange(
          new Date(),
          billingDay,
          newBillingDay,
          lastBilledDate,
          Number(campaign.monthly_fee)
        )
      : null;

  const hasProRata = billingChange?.proRataAmount && billingChange.proRataAmount > 0 && !!campaign.stripe_customer_id;

  async function handleBillingSave() {
    if (newBillingDay === billingDay) {
      setEditingBilling(false);
      return;
    }

    if (hasProRata) {
      // Redirect to Stripe checkout for the pro-rata charge
      setRedirectingToStripe(true);
      try {
        const res = await fetch(`/api/campaigns/${leadId}/billing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_billing_day: newBillingDay }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No checkout URL returned:", data);
          setRedirectingToStripe(false);
        }
      } catch (err) {
        console.error("Failed to create billing checkout:", err);
        setRedirectingToStripe(false);
      }
    } else {
      // No pro-rata — apply directly
      billingMutation.mutate(newBillingDay);
    }
  }

  const isSaving = billingMutation.isPending || redirectingToStripe;

  return (
    <div>
      <Link
        href="/campaigns"
        className="text-foreground/40 hover:text-foreground text-sm transition-colors"
      >
        &larr; Back to Campaigns
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight mt-6">{campaign.service}</h1>

      {/* Billing change success banner */}
      {billingSuccess && (
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm text-emerald-400 font-medium">
            Billing day updated successfully. Pro-rata payment received.
          </p>
          <button
            onClick={() => setBillingSuccess(false)}
            className="text-emerald-400/60 hover:text-emerald-400 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
          <p className="text-2xl font-bold text-primary">{customers}</p>
          <p className="text-[11px] text-foreground/40 mt-1">customers/mo</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            £{Number(campaign.monthly_fee).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-foreground/40 mt-1">monthly fee</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
          <p className="text-lg font-bold text-foreground">{campaign.target_area}</p>
          <p className="text-[11px] text-foreground/40 mt-1">area</p>
        </div>
      </div>

      {/* Generated Leads */}
      {(() => {
        const conversionRate = Number(campaign.conversion_rate || 100) / 100;
        const quota = Math.ceil(Number(campaign.custom_leads || campaign.required_leads || campaign.customers_required || 0) / conversionRate);
        const generated = 0; // TODO: wire up to real lead count
        const pct = quota > 0 ? Math.min((generated / quota) * 100, 100) : 0;

        return (
          <div className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Generated Leads</h2>
            <div className="bg-white/5 border border-white/10 rounded-md p-5 space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-medium">
                    {generated} <span className="text-foreground/40 font-normal">of {quota} leads this month</span>
                  </span>
                  <span className="text-sm font-bold text-primary">{Math.round(pct)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 100
                        ? "var(--color-emerald-400)"
                        : pct >= 50
                          ? "hsl(var(--primary))"
                          : "var(--color-amber-400)",
                    }}
                  />
                </div>
              </div>

              {generated === 0 ? (
                <p className="text-foreground/40 text-sm text-center py-4">
                  No leads generated yet.
                </p>
              ) : null}
            </div>
          </div>
        );
      })()}

      {/* Billing */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Billing</h2>
        <div className="bg-white/5 border border-white/10 rounded-md p-5 space-y-4">

          {/* Next billing date */}
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Next billing date</p>
            <p className="text-sm font-semibold">
              {nextBilling.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Last billed */}
          {campaign.last_billed_date && (
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Last billed</p>
              <p className="text-sm font-semibold">
                {new Date(campaign.last_billed_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Billing day with edit */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-sm font-medium">Billing day</p>
            {!editingBilling ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">
                  {billingDay}{getOrdinalSuffix(billingDay)} of each month
                </p>
                <button
                  onClick={() => {
                    setNewBillingDay(billingDay);
                    setEditingBilling(true);
                  }}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={newBillingDay}
                  onChange={(e) => setNewBillingDay(Number(e.target.value))}
                  disabled={isSaving}
                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}{getOrdinalSuffix(day)}
                    </option>
                  ))}
                </select>
                {!hasProRata && (
                  <button
                    onClick={handleBillingSave}
                    disabled={isSaving}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
                  >
                    {billingMutation.isPending ? "Saving..." : "Save"}
                  </button>
                )}
                <button
                  onClick={() => {
                    setNewBillingDay(billingDay);
                    setEditingBilling(false);
                    billingMutation.reset();
                  }}
                  disabled={isSaving}
                  className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Billing change preview */}
          {billingChange && (
            <div className="bg-white/5 border border-white/10 rounded-md p-4 space-y-3">
              <p className="text-xs font-medium text-foreground/60">What will happen:</p>
              <p className="text-sm text-foreground/80">{billingChange.reason}</p>

              {billingChange.shouldPauseCampaign && billingChange.pauseDate && billingChange.resumeDate && (
                <div className="flex flex-col sm:flex-row gap-3 text-xs">
                  <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded px-3 py-2">
                    <p className="text-amber-400 font-medium">Pauses</p>
                    <p className="text-foreground/60 mt-0.5">
                      {new Date(billingChange.pauseDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded px-3 py-2">
                    <p className="text-emerald-400 font-medium">Resumes & bills</p>
                    <p className="text-foreground/60 mt-0.5">
                      {new Date(billingChange.resumeDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {hasProRata ? (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded px-3 py-2 text-xs space-y-2">
                  <p className="text-blue-400 font-medium">Pro-rata charge (payment required)</p>
                  <p className="text-foreground/60">
                    £{billingChange.proRataAmount!.toLocaleString("en-GB", { minimumFractionDigits: 2 })} for {billingChange.proRataDays} extra days
                  </p>
                  <button
                    onClick={handleBillingSave}
                    disabled={isSaving}
                    className="w-full mt-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    {redirectingToStripe
                      ? "Redirecting to payment..."
                      : `Pay £${billingChange.proRataAmount!.toLocaleString("en-GB", { minimumFractionDigits: 2 })} & Apply Change`}
                  </button>
                </div>
              ) : null}

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-foreground/50">New next billing date</span>
                <span className="font-semibold">
                  {new Date(billingChange.nextBillingDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-white/5 pt-4">
            <p className="text-sm font-medium mb-3">Past Invoices</p>
            {(() => {
              const created = new Date(campaign.created_at);
              const now = new Date();
              const invoices: { date: Date; amount: number; isSetup: boolean }[] = [];

              // Setup fee invoice on creation date
              if (Number(campaign.setup_fee) > 0) {
                invoices.push({ date: created, amount: Number(campaign.setup_fee), isSetup: true });
              }

              // Monthly invoices from creation date
              const d = new Date(created);
              while (d <= now) {
                invoices.push({ date: new Date(d), amount: Number(campaign.monthly_fee), isSetup: false });
                d.setMonth(d.getMonth() + 1);
              }

              if (invoices.length === 0) {
                return <p className="text-xs text-foreground/40">No invoices yet.</p>;
              }

              return (
                <div className="space-y-2">
                  {invoices.reverse().map((inv, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-sm">
                          {inv.date.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[11px] text-foreground/40">
                          {inv.isSetup ? "Setup fee" : "Monthly fee"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          £{inv.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          Paid
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

    </div>
  );
}
