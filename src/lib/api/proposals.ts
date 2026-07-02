import { createClient } from "@/lib/supabase/client";
import type { Proposal } from "@/lib/types/crm";
import { mapDbToCampaign, mapCampaignToDb } from "./campaigns";

/* ── Mapper: DB row -> Proposal ── */

export function mapDbToProposal(dbRow: Record<string, unknown>): Proposal {
  return mapDbToCampaign(dbRow);
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

export async function getProposals(): Promise<Proposal[]> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .eq("stage", "proposal")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapDbToProposal);
}

export async function createProposal(
  data: Partial<Proposal>
): Promise<Proposal> {
  const { supabase, user } = await getAuthenticatedUser();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  const dbData = {
    ...mapCampaignToDb(data),
    user_id: user.id,
    stage: "proposal",
    proposal_status: "pending",
    expires_at: expiresAt.toISOString(),
  };

  const { data: row, error } = await supabase
    .from("campaigns")
    .insert(dbData)
    .select()
    .single();

  if (error) throw error;
  return mapDbToProposal(row);
}

export async function acceptProposal(id: string): Promise<Proposal> {
  const { supabase, user } = await getAuthenticatedUser();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("campaigns")
    .update({
      stage: "campaign",
      proposal_status: "accepted",
      campaign_status: "active",
      start_date: now,
      current_period_start: now,
      next_billing_date: now,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return mapDbToProposal(data);
}
