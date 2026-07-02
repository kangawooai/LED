import { createClient } from "@/lib/supabase/client";
import type { CrmUser, AccountSettings, BillingInfo } from "@/lib/types/crm";

/* ── Default values ── */

const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  notifications: {
    newLeads: true,
    newProposals: true,
  },
  calendar: {
    syncJobsToCalendar: false,
    syncLeadVisitsToCalendar: false,
    reminderMinutesBefore: 30,
  },
  currency: "GBP",
  workSchedule: {
    days: {
      "1": { startTime: "09:00", endTime: "17:00" },
      "2": { startTime: "09:00", endTime: "17:00" },
      "3": { startTime: "09:00", endTime: "17:00" },
      "4": { startTime: "09:00", endTime: "17:00" },
      "5": { startTime: "09:00", endTime: "17:00" },
    },
  },
};

const DEFAULT_BILLING_INFO: BillingInfo = {
  status: "none",
  currency: "GBP",
};

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

/* ── Account / Profile ── */

export async function getAccount(): Promise<CrmUser> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return {
    id: data.id as string,
    email: data.email as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    companyName: data.company_name as string,
    phone: data.phone as string,
    avatarUrl: (data.avatar_url as string) ?? undefined,
    createdAt: data.created_at as string,
  };
}

export async function updateAccount(
  updates: Partial<Pick<CrmUser, "firstName" | "lastName" | "companyName" | "phone">>
): Promise<CrmUser> {
  const { supabase, user } = await getAuthenticatedUser();

  const dbUpdates: Record<string, unknown> = {};
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
  if (updates.companyName !== undefined)
    dbUpdates.company_name = updates.companyName;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;

  const { data, error } = await supabase
    .from("profiles")
    .update(dbUpdates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id as string,
    email: data.email as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    companyName: data.company_name as string,
    phone: data.phone as string,
    avatarUrl: (data.avatar_url as string) ?? undefined,
    createdAt: data.created_at as string,
  };
}

/* ── Account Settings ── */

export async function getAccountSettings(): Promise<AccountSettings> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("account_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // PGRST116 = no rows found -> return defaults
    if (error.code === "PGRST116") return { ...DEFAULT_ACCOUNT_SETTINGS };
    throw error;
  }

  return {
    notifications: {
      newLeads: data.notify_new_leads ?? DEFAULT_ACCOUNT_SETTINGS.notifications.newLeads,
      newProposals: data.notify_new_proposals ?? DEFAULT_ACCOUNT_SETTINGS.notifications.newProposals,
    },
    calendar: {
      syncJobsToCalendar: data.sync_jobs_to_calendar ?? DEFAULT_ACCOUNT_SETTINGS.calendar.syncJobsToCalendar,
      syncLeadVisitsToCalendar: data.sync_lead_visits_to_calendar ?? DEFAULT_ACCOUNT_SETTINGS.calendar.syncLeadVisitsToCalendar,
      selectedCalendarId: (data.selected_calendar_id as string) ?? undefined,
      reminderMinutesBefore: data.reminder_minutes_before ?? DEFAULT_ACCOUNT_SETTINGS.calendar.reminderMinutesBefore,
      icalFeedToken: (data.ical_feed_token as string) ?? undefined,
      googleConnected: (data.google_connected as boolean) ?? undefined,
    },
    currency: data.currency ?? DEFAULT_ACCOUNT_SETTINGS.currency,
    workSchedule: data.work_schedule ?? DEFAULT_ACCOUNT_SETTINGS.workSchedule,
  };
}

export async function updateAccountSettings(
  settings: DeepPartial<AccountSettings>
): Promise<AccountSettings> {
  const { supabase, user } = await getAuthenticatedUser();

  const dbData: Record<string, unknown> = { user_id: user.id };

  if (settings.notifications !== undefined) {
    if (settings.notifications.newLeads !== undefined)
      dbData.notify_new_leads = settings.notifications.newLeads;
    if (settings.notifications.newProposals !== undefined)
      dbData.notify_new_proposals = settings.notifications.newProposals;
  }

  if (settings.calendar !== undefined) {
    if (settings.calendar.syncJobsToCalendar !== undefined)
      dbData.sync_jobs_to_calendar = settings.calendar.syncJobsToCalendar;
    if (settings.calendar.syncLeadVisitsToCalendar !== undefined)
      dbData.sync_lead_visits_to_calendar = settings.calendar.syncLeadVisitsToCalendar;
    if (settings.calendar.selectedCalendarId !== undefined)
      dbData.selected_calendar_id = settings.calendar.selectedCalendarId;
    if (settings.calendar.reminderMinutesBefore !== undefined)
      dbData.reminder_minutes_before = settings.calendar.reminderMinutesBefore;
  }

  if (settings.currency !== undefined) dbData.currency = settings.currency;
  if (settings.workSchedule !== undefined)
    dbData.work_schedule = settings.workSchedule;

  const { error } = await supabase.from("account_settings").upsert(dbData, {
    onConflict: "user_id",
  });

  if (error) throw error;

  return getAccountSettings();
}

/* ── Billing ── */

export async function getBillingInfo(): Promise<BillingInfo> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("billing_info")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return { ...DEFAULT_BILLING_INFO };
    throw error;
  }

  return {
    customerId: (data.customer_id as string) ?? undefined,
    subscriptionId: (data.subscription_id as string) ?? undefined,
    status: (data.status as BillingInfo["status"]) ?? "none",
    currentPlan: (data.current_plan as string) ?? undefined,
    nextBillingDate: (data.next_billing_date as string) ?? undefined,
    amount: (data.amount as number) ?? undefined,
    currency: (data.currency as string) ?? "GBP",
    paymentMethod: data.payment_method_last4
      ? {
          type: "card",
          last4: data.payment_method_last4 as string,
          brand: data.payment_method_brand as string,
        }
      : undefined,
  };
}

export async function getBillingPortalUrl(): Promise<string> {
  const response = await fetch("/api/billing/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to get billing portal URL"
    );
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

/* ── Utility type ── */

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
