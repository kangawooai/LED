import { createClient } from "@/lib/supabase/client";
import type { ChangeLog } from "@/lib/types/crm";

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

function mapDbToChangeLog(row: Record<string, unknown>): ChangeLog {
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    userId: row.user_id as string,
    fieldName: row.field_name as string,
    oldValue: (row.old_value as string) ?? null,
    newValue: (row.new_value as string) ?? null,
    changeType: row.change_type as string,
    createdAt: row.created_at as string,
    revertedAt: (row.reverted_at as string) ?? null,
    revertedBy: (row.reverted_by as string) ?? null,
  };
}

/* ── CRUD ── */

export async function getChangeLogs(customerId: string): Promise<ChangeLog[]> {
  const { supabase } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("customer_change_logs")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapDbToChangeLog);
}

export async function revertChange(changeLogId: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  // Fetch the change log entry
  const { data: log, error: logError } = await supabase
    .from("customer_change_logs")
    .select("*")
    .eq("id", changeLogId)
    .single();

  if (logError) throw logError;

  const fieldName = log.field_name as string;
  const oldValue = log.old_value;
  const customerId = log.customer_id as string;

  // Revert the customer field to the old value
  const { error: updateError } = await supabase
    .from("customers")
    .update({ [fieldName]: oldValue })
    .eq("id", customerId)
    .eq("user_id", user.id);

  if (updateError) throw updateError;

  // Mark the change log entry as reverted
  const { error: revertError } = await supabase
    .from("customer_change_logs")
    .update({
      reverted_at: new Date().toISOString(),
      reverted_by: user.id,
    })
    .eq("id", changeLogId);

  if (revertError) throw revertError;
}

/* ── Display Helpers ── */

const FIELD_NAME_MAP: Record<string, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  phone: "Phone",
  company_name: "Company Name",
  value: "Value",
  lead_status: "Lead Status",
  job_status: "Job Status",
  lead_source: "Lead Source",
  address_street: "Street",
  address_city: "City",
  address_postcode: "Postcode",
  visit_date: "Visit Date",
  visit_time: "Visit Time",
  visit_duration: "Visit Duration",
  scheduled_date: "Scheduled Date",
  scheduled_time: "Scheduled Time",
  scheduled_duration: "Scheduled Duration",
  title: "Title",
  description: "Description",
  lost_reason: "Lost Reason",
  cancelled_reason: "Cancelled Reason",
  campaign_id: "Campaign",
  stage: "Stage",
  type: "Type",
};

export function formatFieldName(fieldName: string): string {
  return (
    FIELD_NAME_MAP[fieldName] ??
    fieldName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function formatChangeValue(
  fieldName: string,
  value: string | null
): string {
  if (value === null || value === undefined || value === "") return "--";

  // Currency formatting for the value field
  if (fieldName === "value") {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(num);
    }
    return value;
  }

  // Date fields
  if (
    fieldName === "visit_date" ||
    fieldName === "scheduled_date" ||
    fieldName === "completed_at" ||
    fieldName === "cancelled_at"
  ) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return value;
  }

  // Duration fields (in minutes)
  if (fieldName === "visit_duration" || fieldName === "scheduled_duration") {
    const mins = parseInt(value, 10);
    if (!isNaN(mins)) {
      if (mins >= 60) {
        const hours = Math.floor(mins / 60);
        const remainder = mins % 60;
        return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
      }
      return `${mins}m`;
    }
    return value;
  }

  return value;
}
