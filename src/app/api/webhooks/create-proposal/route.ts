import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/webhooks/create-proposal
 *
 * Creates (or updates) a proposal from a CRM lead. The caller sends the lead_id
 * plus the quote requirements; this endpoint pulls the contact details from the
 * CRM, calculates the fees via the pricing webhook, stores the proposal_progress
 * row, and returns the shareable /proposal/{lead_id} link.
 *
 * Auth: shared secret in the `x-webhook-secret` header OR `?token=` query param,
 * matched against env PROPOSAL_WEBHOOK_SECRET.
 *
 * Body (JSON):
 *   lead_id          (required)  CRM/Salesforce lead id — also the proposal key
 *   service          (required)  CRM service value used for pricing
 *   target_area      (required)  e.g. "Manchester, 20 miles"
 *   required_leads   (required)  number of customers wanted per month
 *   conversion_rate  (required)  % of leads converted to jobs (10–100)
 *   avg_job_value    (optional)  overrides the value returned by pricing
 *   desired_return   (optional)  overrides the ROI returned by pricing
 *   custom_leads     (optional)  exact figure when required_leads > 100
 *   industry         (optional)  service group, used by the requirements editor
 *
 * (camelCase / LeadID / TargetArea aliases are also accepted.)
 */

const PRICING_WEBHOOK =
  "https://dwrs.omnitoria.io/webhook/eeb93a2b-bf5b-4185-83dd-9532fe764f54";
const FETCH_WEBHOOK =
  "https://dwrs.omnitoria.io/webhook/c7e7deff-8e45-4185-a8d2-185cb8e8d53b";
const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

// .trim() guards against stray whitespace/newlines in the dashboard env value
const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  "https://www.leadseveryday.co.uk"
)
  .trim()
  .replace(/\/$/, "");

// Accept snake_case, camelCase and CRM-style keys
function pick(body: Record<string, unknown>, ...keys: string[]) {
  for (const k of keys) {
    const v = body[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  // ── Auth ──
  const secret = process.env.PROPOSAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[create-proposal] PROPOSAL_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  const provided =
    req.headers.get("x-webhook-secret") ||
    req.nextUrl.searchParams.get("token") ||
    "";
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse ──
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const leadId = pick(body, "lead_id", "leadId", "LeadID");
  const service = pick(body, "service", "service_type", "serviceType");
  const targetArea = pick(body, "target_area", "targetArea", "TargetArea");
  const requiredLeads = pick(body, "required_leads", "requiredLeads", "customers");
  const conversionRate = pick(body, "conversion_rate", "conversionRate");
  const customLeads = pick(body, "custom_leads", "customLeads");
  const industry = pick(body, "industry");
  const avgOverride = pick(body, "avg_job_value", "avgJobValue");
  const returnOverride = pick(body, "desired_return", "desiredReturn");

  const missing = [
    ["lead_id", leadId],
    ["service", service],
    ["target_area", targetArea],
    ["required_leads", requiredLeads],
    ["conversion_rate", conversionRate],
  ]
    .filter(([, v]) => v === undefined)
    .map(([k]) => k);

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const leadIdStr = String(leadId);

  try {
    // ── 1. Pull contact from the CRM (best-effort) ──
    let contact: Record<string, unknown> = {};
    try {
      const fRes = await fetch(FETCH_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${BASIC_AUTH}`,
        },
        body: JSON.stringify({ lead_id: leadIdStr }),
      });
      const fText = await fRes.text();
      const fData = JSON.parse(fText);
      if (fData && !fData.error) {
        contact = {
          first_name: fData.first_name || null,
          last_name: fData.last_name || null,
          email: fData.email || null,
          phone: fData.phone != null ? String(fData.phone) : null,
          business_name: fData.business_name || null,
          company_number:
            fData.company_number != null ? String(fData.company_number) : null,
          company_address: fData.address || fData.company_address || null,
          street_address: fData.street_address || null,
          city: fData.city || null,
          country: fData.country || null,
          post_code: fData.post_code || null,
        };
      }
    } catch (err) {
      console.error("[create-proposal] contact fetch failed:", err);
    }

    // ── 2. Calculate fees via the pricing webhook ──
    const pricingPayload: Record<string, unknown> = {
      required_leads: Number(requiredLeads),
      conversion_rate: Number(conversionRate),
      service_type: service,
      LeadID: leadIdStr,
      TargetArea: targetArea,
    };

    const pRes = await fetch(PRICING_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: JSON.stringify(pricingPayload),
    });
    const pText = await pRes.text();
    let pricing: Record<string, unknown>;
    try {
      pricing = JSON.parse(pText);
    } catch {
      console.error("[create-proposal] non-JSON pricing response:", pText);
      return NextResponse.json(
        { error: "Pricing service returned an unexpected response" },
        { status: 502 }
      );
    }

    if (pricing.setup_fee == null || pricing.monthly_fee == null) {
      return NextResponse.json(
        {
          error:
            "Could not calculate pricing for this lead. Check the service value and requirements are valid.",
          pricing,
        },
        { status: 422 }
      );
    }

    // ── 3. Upsert the proposal ──
    const row = {
      lead_id: leadIdStr,
      monthly_fee: pricing.monthly_fee,
      setup_fee: pricing.setup_fee,
      total_fee: pricing.total_fee,
      industry: industry ?? null,
      service,
      target_area: targetArea,
      required_leads: requiredLeads,
      conversion_rate: conversionRate,
      custom_leads: customLeads ?? null,
      avg_job_value: avgOverride ?? Number(pricing.average_job_value) ?? 0,
      desired_return: returnOverride ?? Number(pricing.roi) ?? 0,
      ...contact,
    };

    const { data, error } = await supabase
      .from("proposal_progress")
      .upsert(row, { onConflict: "lead_id" })
      .select()
      .single();

    if (error) {
      console.error("[create-proposal] upsert error:", error);
      return NextResponse.json(
        { error: "Failed to save proposal" },
        { status: 500 }
      );
    }

    const url = `${APP_URL}/proposal/${encodeURIComponent(leadIdStr)}`;
    return NextResponse.json({
      success: true,
      lead_id: leadIdStr,
      url,
      proposal: {
        monthly_fee: data.monthly_fee,
        setup_fee: data.setup_fee,
        total_fee: data.total_fee,
      },
    });
  } catch (err) {
    console.error("[create-proposal] error:", err);
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
  }
}
