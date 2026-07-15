import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthEmail } from "@/lib/api/auth";

/**
 * GET /api/campaigns/[id]
 *
 * Fetches a single campaign by its ID (UUID) or by proposal_lead_id, scoped to the authenticated user.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getAuthEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let data, error;
    if (isUuid) {
      ({ data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .eq("email", email)
        .maybeSingle());
    }

    if (!data && !error) {
      ({ data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("proposal_lead_id", id)
        .eq("email", email)
        .maybeSingle());
    }

    if (error) {
      console.error("[campaigns/[id]] GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch campaign" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[campaigns/[id]] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/campaigns/[id]
 *
 * Updates campaign fields (e.g. billing_day, campaign_status).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getAuthEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "billing_day",
      "campaign_status",
      "monthly_fee",
      "setup_fee",
      "custom_leads",
      "required_leads",
      "service",
      "target_area",
      "first_name",
      "last_name",
      "email",
      "phone",
      "business_name",
      "company_address",
      "company_number",
      "opportunity_id",
      "linked_id",
      "stripe_customer_id",
      "stripe_payment_id",
    ];

    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        safeUpdates[key] = body[key];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let data, error;
    if (isUuid) {
      ({ data, error } = await supabase
        .from("campaigns")
        .update(safeUpdates)
        .eq("id", id)
        .eq("email", email)
        .select()
        .maybeSingle());
    }

    if (!data && !error) {
      ({ data, error } = await supabase
        .from("campaigns")
        .update(safeUpdates)
        .eq("proposal_lead_id", id)
        .eq("email", email)
        .select()
        .maybeSingle());
    }

    if (error) {
      console.error("[campaigns/[id]] PATCH error:", error);
      return NextResponse.json(
        { error: "Failed to update campaign" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[campaigns/[id]] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
