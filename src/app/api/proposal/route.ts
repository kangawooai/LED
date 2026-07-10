import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/* ── GET /api/proposal?lead_id=xxx ── */
export async function GET(req: NextRequest) {
  try {
    const leadId = req.nextUrl.searchParams.get("lead_id");
    if (!leadId) {
      return NextResponse.json(
        { error: "lead_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("proposal_progress")
      .select("*")
      .eq("lead_id", leadId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[proposal] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}

/* ── POST /api/proposal ── Create initial proposal row */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("proposal_progress")
      .upsert(
        {
          lead_id: body.lead_id,
          monthly_fee: body.monthly_fee,
          setup_fee: body.setup_fee,
          total_fee: body.total_fee,
          industry: body.industry,
          service: body.service,
          target_area: body.target_area,
          required_leads: body.required_leads,
          conversion_rate: body.conversion_rate,
          custom_leads: body.custom_leads || null,
          avg_job_value: body.avg_job_value ?? 0,
          desired_return: body.desired_return ?? 0,
        },
        { onConflict: "lead_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("[proposal] POST error:", error);
      return NextResponse.json(
        { error: "Failed to create proposal" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[proposal] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}

// Fields worth tracking in edit history (excludes transient UI state)
const TRACKED_FIELDS = [
  "monthly_fee",
  "setup_fee",
  "total_fee",
  "required_leads",
  "conversion_rate",
  "service",
  "custom_leads",
  "first_name",
  "last_name",
  "email",
  "phone",
  "business_name",
  "company_address",
  "street_address",
  "city",
  "country",
  "post_code",
  "company_number",
  "proposal_accepted",
  "billing_day",
  "avg_job_value",
  "desired_return",
];

const FIELD_LABELS: Record<string, string> = {
  monthly_fee: "Monthly Fee",
  setup_fee: "Setup Fee",
  total_fee: "Total Fee",
  required_leads: "Customers Required",
  conversion_rate: "Conversion Rate",
  service: "Service",
  custom_leads: "Custom Customers",
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  phone: "Phone",
  business_name: "Business Name",
  company_address: "Address",
  street_address: "Street Address",
  city: "City",
  country: "Country",
  post_code: "Post Code",
  company_number: "Company Number",
  proposal_accepted: "Proposal Accepted",
  billing_day: "Billing Day",
  avg_job_value: "Avg Job Value",
  desired_return: "Desired Return",
};

/* ── PATCH /api/proposal ── Update step progress */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead_id, ...updates } = body;

    if (!lead_id) {
      return NextResponse.json(
        { error: "lead_id is required" },
        { status: 400 }
      );
    }

    const allowedFields = [
      "proposal_accepted",
      "completed_steps",
      "active_section",
      "monthly_fee",
      "setup_fee",
      "total_fee",
      "required_leads",
      "conversion_rate",
      "service",
      "custom_leads",
      "first_name",
      "last_name",
      "email",
      "phone",
      "business_name",
      "company_address",
      "street_address",
      "city",
      "country",
      "post_code",
      "company_number",
      "billing_day",
      "avg_job_value",
      "desired_return",
      "linked_id",
      "stripe_customer_id",
      "stripe_payment_id",
      "opportunity_id",
      "veriff_session_id",
      "veriff_status",
    ];

    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        safeUpdates[key] = updates[key];
      }
    }

    // Fetch current row before updating (for change diffing)
    const { data: existing } = await supabase
      .from("proposal_progress")
      .select("*")
      .eq("lead_id", lead_id)
      .single();

    const { data, error } = await supabase
      .from("proposal_progress")
      .update(safeUpdates)
      .eq("lead_id", lead_id)
      .select();

    if (error) {
      console.error("[proposal] PATCH error:", error);
      return NextResponse.json(
        { error: "Failed to update proposal" },
        { status: 500 }
      );
    }

    // No row matched — nothing to update (row hasn't been created yet)
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No proposal found to update" }, { status: 404 });
    }

    // Log meaningful changes to edit history (fire-and-forget)
    if (existing) {
      const changes: { field: string; field_label: string; old_value: string; new_value: string }[] = [];

      for (const field of TRACKED_FIELDS) {
        if (!(field in safeUpdates)) continue;
        const oldVal = String(existing[field] ?? "");
        const newVal = String(safeUpdates[field] ?? "");
        if (oldVal !== newVal) {
          changes.push({
            field,
            field_label: FIELD_LABELS[field] || field,
            old_value: oldVal,
            new_value: newVal,
          });
        }
      }

      if (changes.length > 0) {
        supabase
          .from("proposal_edit_history")
          .insert(changes.map((c) => ({ lead_id, ...c })))
          .then(({ error: histError }) => {
            if (histError) console.error("[proposal] edit history insert error:", histError);
          });
      }
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("[proposal] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}
