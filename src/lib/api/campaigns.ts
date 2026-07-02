import { createClient } from "@/lib/supabase/client";
import type { Campaign, CampaignStatus } from "@/lib/types/crm";

/* ── Mapper: DB row (snake_case) -> Campaign (camelCase) ── */

export function mapDbToCampaign(dbRow: Record<string, unknown>): Campaign {
  return {
    id: dbRow.id as string,
    stage: dbRow.stage as Campaign["stage"],
    name: dbRow.name as string,
    description: (dbRow.description as string) ?? undefined,
    service: dbRow.service as string,
    targetArea: dbRow.target_area as string,
    customersRequired: dbRow.customers_required as number,
    monthlyFee: dbRow.monthly_fee as number,
    currency: dbRow.currency as string,
    billingDay: dbRow.billing_day as number,
    createdAt: dbRow.created_at as string,

    // Proposal fields
    proposalStatus: (dbRow.proposal_status as Campaign["proposalStatus"]) ?? undefined,
    setupFee: (dbRow.setup_fee as number) ?? undefined,
    expiresAt: (dbRow.expires_at as string) ?? undefined,

    // Campaign fields
    campaignStatus: (dbRow.campaign_status as Campaign["campaignStatus"]) ?? undefined,
    currentSpend: (dbRow.current_spend as number) ?? undefined,
    budgetLimit: (dbRow.budget_limit as number) ?? undefined,
    totalLeads: (dbRow.total_leads as number) ?? undefined,
    totalJobsWon: (dbRow.total_jobs_won as number) ?? undefined,
    startDate: (dbRow.start_date as string) ?? undefined,
    currentPeriodStart: (dbRow.current_period_start as string) ?? undefined,
    nextBillingDate: (dbRow.next_billing_date as string) ?? undefined,
    billingAnchorDate: (dbRow.billing_anchor_date as string) ?? undefined,
    billingDayRule: (dbRow.billing_day_rule as Campaign["billingDayRule"]) ?? undefined,
    lastPaidPeriod: (dbRow.last_paid_period as string) ?? undefined,
    nextDuePeriod: (dbRow.next_due_period as string) ?? undefined,
    nextDueDate: (dbRow.next_due_date as string) ?? undefined,
  };
}

/* ── Mapper: Campaign (camelCase) -> DB row (snake_case) ── */

export function mapCampaignToDb(
  campaign: Partial<Campaign>
): Record<string, unknown> {
  const db: Record<string, unknown> = {};

  if (campaign.name !== undefined) db.name = campaign.name;
  if (campaign.description !== undefined) db.description = campaign.description;
  if (campaign.service !== undefined) db.service = campaign.service;
  if (campaign.targetArea !== undefined) db.target_area = campaign.targetArea;
  if (campaign.customersRequired !== undefined)
    db.customers_required = campaign.customersRequired;
  if (campaign.monthlyFee !== undefined) db.monthly_fee = campaign.monthlyFee;
  if (campaign.currency !== undefined) db.currency = campaign.currency;
  if (campaign.billingDay !== undefined) db.billing_day = campaign.billingDay;
  if (campaign.stage !== undefined) db.stage = campaign.stage;

  // Proposal fields
  if (campaign.proposalStatus !== undefined)
    db.proposal_status = campaign.proposalStatus;
  if (campaign.setupFee !== undefined) db.setup_fee = campaign.setupFee;
  if (campaign.expiresAt !== undefined) db.expires_at = campaign.expiresAt;

  // Campaign fields
  if (campaign.campaignStatus !== undefined)
    db.campaign_status = campaign.campaignStatus;
  if (campaign.currentSpend !== undefined)
    db.current_spend = campaign.currentSpend;
  if (campaign.budgetLimit !== undefined)
    db.budget_limit = campaign.budgetLimit;
  if (campaign.startDate !== undefined) db.start_date = campaign.startDate;
  if (campaign.currentPeriodStart !== undefined)
    db.current_period_start = campaign.currentPeriodStart;
  if (campaign.nextBillingDate !== undefined)
    db.next_billing_date = campaign.nextBillingDate;
  if (campaign.billingAnchorDate !== undefined)
    db.billing_anchor_date = campaign.billingAnchorDate;
  if (campaign.billingDayRule !== undefined)
    db.billing_day_rule = campaign.billingDayRule;
  if (campaign.lastPaidPeriod !== undefined)
    db.last_paid_period = campaign.lastPaidPeriod;
  if (campaign.nextDuePeriod !== undefined)
    db.next_due_period = campaign.nextDuePeriod;
  if (campaign.nextDueDate !== undefined)
    db.next_due_date = campaign.nextDueDate;

  return db;
}

/* ── Helpers ── */

async function getAuthenticatedUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, user };
}

/* ── CRUD ── */

export async function getCampaigns(): Promise<Campaign[]> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .eq("stage", "campaign")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Fetch real-time lead/job counts per campaign
  const campaigns = (data ?? []).map(mapDbToCampaign);

  const campaignIds = campaigns.map((c) => c.id);
  if (campaignIds.length === 0) return campaigns;

  const { data: leadCounts } = await supabase
    .from("customers")
    .select("campaign_id")
    .in("campaign_id", campaignIds)
    .eq("stage", "lead");

  const { data: jobCounts } = await supabase
    .from("customers")
    .select("campaign_id")
    .in("campaign_id", campaignIds)
    .eq("stage", "job");

  const leadMap = new Map<string, number>();
  const jobMap = new Map<string, number>();

  (leadCounts ?? []).forEach((row: { campaign_id: string }) => {
    leadMap.set(row.campaign_id, (leadMap.get(row.campaign_id) ?? 0) + 1);
  });

  (jobCounts ?? []).forEach((row: { campaign_id: string }) => {
    jobMap.set(row.campaign_id, (jobMap.get(row.campaign_id) ?? 0) + 1);
  });

  return campaigns.map((c) => ({
    ...c,
    totalLeads: leadMap.get(c.id) ?? 0,
    totalJobsWon: jobMap.get(c.id) ?? 0,
  }));
}

export async function getCampaign(id: string): Promise<Campaign> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return mapDbToCampaign(data);
}

export async function createCampaign(
  campaign: Partial<Campaign>
): Promise<Campaign> {
  const { supabase, user } = await getAuthenticatedUser();

  const dbData = {
    ...mapCampaignToDb(campaign),
    user_id: user.id,
    stage: "campaign",
    campaign_status: "active",
  };

  const { data, error } = await supabase
    .from("campaigns")
    .insert(dbData)
    .select()
    .single();

  if (error) throw error;
  return mapDbToCampaign(data);
}

export async function updateCampaign(
  id: string,
  updates: Partial<Campaign>
): Promise<Campaign> {
  const { supabase, user } = await getAuthenticatedUser();

  const dbUpdates = mapCampaignToDb(updates);

  const { data, error } = await supabase
    .from("campaigns")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return mapDbToCampaign(data);
}

export async function updateCampaignStatus(
  id: string,
  status: CampaignStatus
): Promise<Campaign> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("campaigns")
    .update({ campaign_status: status })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return mapDbToCampaign(data);
}

export async function deleteCampaign(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function getCampaignStats(
  id: string
): Promise<{
  totalLeads: number;
  totalJobs: number;
  activeLeads: number;
  completedJobs: number;
}> {
  const { supabase, user } = await getAuthenticatedUser();

  // Verify campaign ownership
  const { error: campaignError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (campaignError) throw campaignError;

  const { data: leads } = await supabase
    .from("customers")
    .select("lead_status")
    .eq("campaign_id", id)
    .eq("stage", "lead");

  const { data: jobs } = await supabase
    .from("customers")
    .select("job_status")
    .eq("campaign_id", id)
    .eq("stage", "job");

  const totalLeads = (leads ?? []).length;
  const totalJobs = (jobs ?? []).length;
  const activeLeads = (leads ?? []).filter(
    (l: { lead_status: string }) =>
      l.lead_status !== "converted" && l.lead_status !== "lost"
  ).length;
  const completedJobs = (jobs ?? []).filter(
    (j: { job_status: string }) => j.job_status === "completed"
  ).length;

  return { totalLeads, totalJobs, activeLeads, completedJobs };
}
