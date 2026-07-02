/* ── User & Auth ── */

export interface CrmUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

/* ── Campaign (Unified Proposal + Campaign) ── */

export type CampaignStage = "proposal" | "campaign";
export type ProposalStatus = "pending" | "accepted" | "expired";
export type CampaignStatus = "active" | "paused";

export interface Campaign {
  id: string;
  stage: CampaignStage;
  name: string;
  description?: string;
  service: string;
  targetArea: string;
  customersRequired: number;
  monthlyFee: number;
  currency: string;
  billingDay: number;
  createdAt: string;

  // Proposal fields
  proposalStatus?: ProposalStatus;
  setupFee?: number;
  expiresAt?: string;

  // Campaign fields
  campaignStatus?: CampaignStatus;
  currentSpend?: number;
  budgetLimit?: number;
  totalLeads?: number;
  totalJobsWon?: number;
  startDate?: string;
  currentPeriodStart?: string;
  nextBillingDate?: string;
  billingAnchorDate?: string;
  billingDayRule?: "exact" | "last_day_of_month";
  lastPaidPeriod?: string;
  nextDuePeriod?: string;
  nextDueDate?: string;
}

export type Proposal = Campaign;

/* ── Customer (Unified Lead + Job) ── */

export type CustomerStage = "lead" | "job";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface CustomerNote {
  id: string;
  content: string;
  isVoiceNote: boolean;
  audioUrl?: string;
  createdAt: string;
}

export interface CustomerCommunication {
  id: string;
  type: "call" | "email" | "text";
  direction: "inbound" | "outbound";
  summary?: string;
  transcript?: string;
  duration?: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  stage: CustomerStage;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  value?: number;
  currency: string;
  campaignId?: string;
  campaignName?: string;
  notes: CustomerNote[];
  communications?: CustomerCommunication[];
  address?: {
    street?: string;
    city?: string;
    postcode?: string;
  };
  createdAt: string;
  updatedAt: string;

  // Lead fields
  leadStatus?: LeadStatus;
  leadSource?: string;
  type?: "call" | "text";
  aiSummary?: string;
  lostReason?: string;
  visitDate?: string;
  visitTime?: string;
  visitDuration?: number;

  // Job fields
  jobStatus?: JobStatus;
  title?: string;
  description?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  scheduledDuration?: number;
  calendarEventId?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

export type Lead = Customer;
export type Job = Customer;

/* ── Account ── */

export type CurrencyCode = "GBP" | "USD" | "EUR" | "CAD" | "AUD";

export interface AccountSettings {
  notifications: {
    newLeads: boolean;
    newProposals: boolean;
  };
  calendar: {
    syncJobsToCalendar: boolean;
    syncLeadVisitsToCalendar: boolean;
    selectedCalendarId?: string;
    reminderMinutesBefore: number;
    icalFeedToken?: string;
    googleConnected?: boolean;
  };
  currency: CurrencyCode;
  workSchedule: {
    days: Record<string, { startTime: string; endTime: string }>;
  };
}

export interface BillingInfo {
  customerId?: string;
  subscriptionId?: string;
  status: "active" | "past_due" | "cancelled" | "none";
  currentPlan?: string;
  nextBillingDate?: string;
  amount?: number;
  currency: string;
  paymentMethod?: {
    type: "card";
    last4: string;
    brand: string;
  };
}

/* ── Change Log ── */

export interface ChangeLog {
  id: string;
  customerId: string;
  userId: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: string;
  createdAt: string;
  revertedAt: string | null;
  revertedBy: string | null;
}
