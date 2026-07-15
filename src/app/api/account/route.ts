import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthEmail } from "@/lib/api/auth";

/* GET /api/account
 *   Returns contact details from the earliest proposal_progress row for the authenticated user.
 */
export async function GET() {
  try {
    const email = await getAuthEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("proposal_progress")
      .select(
        "first_name, last_name, email, phone, business_name, company_address, street_address, city, country, post_code, company_number, created_at"
      )
      .eq("email", email)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "No account data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[account] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

/* PUT /api/account
 *   Updates contact details on ALL proposal_progress rows so they stay in sync.
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const allowedFields = [
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
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const email = await getAuthEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("proposal_progress")
      .update(updates)
      .eq("email", email);

    if (error) {
      console.error("[account] PUT error:", error);
      return NextResponse.json(
        { error: "Failed to update account" },
        { status: 500 }
      );
    }

    const { data: updated } = await supabase
      .from("proposal_progress")
      .select(
        "first_name, last_name, email, phone, business_name, company_address, street_address, city, country, post_code, company_number, created_at"
      )
      .eq("email", email)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[account] PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}
