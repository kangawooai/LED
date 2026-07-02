import { createClient } from "@/lib/supabase/client";
import type {
  Job,
  JobStatus,
  CustomerNote,
  CustomerCommunication,
} from "@/lib/types/crm";

/* ── Mapper: DB row -> Job ── */

export function mapDbToJob(
  dbRow: Record<string, unknown>,
  notes: CustomerNote[] = [],
  comms: CustomerCommunication[] = []
): Job {
  return {
    id: dbRow.id as string,
    stage: dbRow.stage as Job["stage"],
    firstName: dbRow.first_name as string,
    lastName: dbRow.last_name as string,
    email: dbRow.email as string,
    phone: dbRow.phone as string,
    companyName: (dbRow.company_name as string) ?? undefined,
    value: (dbRow.value as number) ?? undefined,
    currency: dbRow.currency as string,
    campaignId: (dbRow.campaign_id as string) ?? undefined,
    campaignName: (dbRow.campaign_name as string) ?? undefined,
    createdAt: dbRow.created_at as string,
    updatedAt: dbRow.updated_at as string,
    notes,
    communications: comms,
    address: dbRow.address_street || dbRow.address_city || dbRow.address_postcode
      ? {
          street: (dbRow.address_street as string) ?? undefined,
          city: (dbRow.address_city as string) ?? undefined,
          postcode: (dbRow.address_postcode as string) ?? undefined,
        }
      : undefined,

    // Job fields
    jobStatus: (dbRow.job_status as JobStatus) ?? undefined,
    title: (dbRow.title as string) ?? undefined,
    description: (dbRow.description as string) ?? undefined,
    scheduledDate: (dbRow.scheduled_date as string) ?? undefined,
    scheduledTime: (dbRow.scheduled_time as string) ?? undefined,
    scheduledDuration: (dbRow.scheduled_duration as number) ?? undefined,
    calendarEventId: (dbRow.calendar_event_id as string) ?? undefined,
    completedAt: (dbRow.completed_at as string) ?? undefined,
    cancelledAt: (dbRow.cancelled_at as string) ?? undefined,
    cancelledReason: (dbRow.cancelled_reason as string) ?? undefined,
  };
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

function mapNoteRow(row: Record<string, unknown>): CustomerNote {
  return {
    id: row.id as string,
    content: row.content as string,
    isVoiceNote: (row.is_voice_note as boolean) ?? false,
    audioUrl: (row.audio_url as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function mapCommRow(row: Record<string, unknown>): CustomerCommunication {
  return {
    id: row.id as string,
    type: row.type as CustomerCommunication["type"],
    direction: row.direction as CustomerCommunication["direction"],
    summary: (row.summary as string) ?? undefined,
    transcript: (row.transcript as string) ?? undefined,
    duration: (row.duration as number) ?? undefined,
    createdAt: row.created_at as string,
  };
}

async function fetchNotesAndComms(
  supabase: ReturnType<typeof createClient>,
  customerIds: string[]
) {
  if (customerIds.length === 0)
    return { notesMap: new Map(), commsMap: new Map() };

  const [{ data: notesData }, { data: commsData }] = await Promise.all([
    supabase
      .from("customer_notes")
      .select("*")
      .in("customer_id", customerIds)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_communications")
      .select("*")
      .in("customer_id", customerIds)
      .order("created_at", { ascending: false }),
  ]);

  const notesMap = new Map<string, CustomerNote[]>();
  const commsMap = new Map<string, CustomerCommunication[]>();

  (notesData ?? []).forEach((row: Record<string, unknown>) => {
    const customerId = row.customer_id as string;
    if (!notesMap.has(customerId)) notesMap.set(customerId, []);
    notesMap.get(customerId)!.push(mapNoteRow(row));
  });

  (commsData ?? []).forEach((row: Record<string, unknown>) => {
    const customerId = row.customer_id as string;
    if (!commsMap.has(customerId)) commsMap.set(customerId, []);
    commsMap.get(customerId)!.push(mapCommRow(row));
  });

  return { notesMap, commsMap };
}

/* ── CRUD ── */

export async function getJobs(): Promise<Job[]> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .eq("stage", "job")
    .order("scheduled_date", { ascending: true });

  if (error) throw error;

  const rows = data ?? [];
  const customerIds = rows.map((r: Record<string, unknown>) => r.id as string);
  const { notesMap, commsMap } = await fetchNotesAndComms(supabase, customerIds);

  return rows.map((row: Record<string, unknown>) => {
    const id = row.id as string;
    return mapDbToJob(row, notesMap.get(id) ?? [], commsMap.get(id) ?? []);
  });
}

export async function getJob(id: string): Promise<Job> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;

  const { notesMap, commsMap } = await fetchNotesAndComms(supabase, [id]);

  return mapDbToJob(
    data,
    notesMap.get(id) ?? [],
    commsMap.get(id) ?? []
  );
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<Job> {
  const { supabase, user } = await getAuthenticatedUser();

  const updateData: Record<string, unknown> = { job_status: status };

  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  const { notesMap, commsMap } = await fetchNotesAndComms(supabase, [id]);

  return mapDbToJob(
    data,
    notesMap.get(id) ?? [],
    commsMap.get(id) ?? []
  );
}

export async function updateJob(
  id: string,
  updates: Partial<
    Pick<
      Job,
      | "firstName"
      | "lastName"
      | "email"
      | "phone"
      | "companyName"
      | "value"
      | "address"
      | "title"
      | "description"
      | "scheduledDate"
      | "scheduledTime"
      | "scheduledDuration"
    >
  >
): Promise<Job> {
  const { supabase, user } = await getAuthenticatedUser();

  const dbUpdates: Record<string, unknown> = {};

  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.companyName !== undefined)
    dbUpdates.company_name = updates.companyName;
  if (updates.value !== undefined) dbUpdates.value = updates.value;
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.scheduledDate !== undefined)
    dbUpdates.scheduled_date = updates.scheduledDate;
  if (updates.scheduledTime !== undefined)
    dbUpdates.scheduled_time = updates.scheduledTime;
  if (updates.scheduledDuration !== undefined)
    dbUpdates.scheduled_duration = updates.scheduledDuration;

  if (updates.address !== undefined) {
    if (updates.address.street !== undefined)
      dbUpdates.address_street = updates.address.street;
    if (updates.address.city !== undefined)
      dbUpdates.address_city = updates.address.city;
    if (updates.address.postcode !== undefined)
      dbUpdates.address_postcode = updates.address.postcode;
  }

  const { data, error } = await supabase
    .from("customers")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  const { notesMap, commsMap } = await fetchNotesAndComms(supabase, [id]);

  return mapDbToJob(
    data,
    notesMap.get(id) ?? [],
    commsMap.get(id) ?? []
  );
}
