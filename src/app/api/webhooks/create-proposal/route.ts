import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { CRM_SERVICE_OPTIONS } from "@/constants";
import { sendSms } from "@/lib/clicksend";
import { buildProposalEmail, type ProposalEmailData } from "@/lib/proposal-email";
import { resolveManager } from "@/lib/managers";

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
 *   lead_id            (required)  CRM/Salesforce lead id — also the proposal key
 *   service            (required)  CRM service value (e.g. "Plastering")
 *   target_area        (required)  location only, e.g. "Manchester"
 *   radius             (required)  coverage radius, e.g. "20 miles" or 20
 *   customers_required (required)  number of customers wanted per month
 *   conversion_rate    (required)  % of leads converted to jobs (10–100)
 *   avg_job_value      (optional)  drives the "how we arrived at this" section
 *   desired_return     (optional)  drives the "how we arrived at this" section
 *   custom_leads       (optional)  exact figure when customers_required > 100
 *
 * industry is derived automatically from `service`.
 * (camelCase / LeadID / TargetArea / required_leads aliases are also accepted.)
 */

const PRICING_WEBHOOK =
  "https://dwrs.omnitoria.io/webhook/eeb93a2b-bf5b-4185-83dd-9532fe764f54";
const FETCH_WEBHOOK =
  "https://dwrs.omnitoria.io/webhook/c7e7deff-8e45-4185-a8d2-185cb8e8d53b";
const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

interface ProposalSummary extends ProposalEmailData {
  phone?: string;
  email?: string;
}

// Send the customer their proposal link by SMS and email (best-effort, never throws)
async function sendProposalNotifications(s: ProposalSummary) {
  const { firstName, phone, email, proposalUrl } = s;
  const env = (key: string) => (process.env[key] || "").trim();
  const tasks: Promise<unknown>[] = [];

  // SMS via ClickSend
  if (phone) {
    const body = `Hi ${firstName}, your Leads Every Day proposal is ready. View it here: ${proposalUrl}`;
    tasks.push(
      sendSms(phone, body).then((r) => {
        if (!r.success) console.error("[create-proposal] SMS failed:", r.error);
      })
    );
  }

  // Email via SMTP
  if (email && env("SMTP_HOST")) {
    const transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port: Number(env("SMTP_PORT")) || 587,
      secure: Number(env("SMTP_PORT")) === 465,
      auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
    });

    tasks.push(
      transporter
        .sendMail({
          from: `Leads Every Day <${env("SMTP_FROM") || env("SMTP_USER")}>`,
          to: email,
          subject: "Your Leads Every Day proposal is ready",
          html: buildProposalEmail(s),
        })
        .catch((err) => console.error("[create-proposal] email failed:", err))
    );
  }

  await Promise.allSettled(tasks);
}

// Derive the industry (service group) from a CRM service value or label
function industryFromService(service: string): string | null {
  const s = service.trim().toLowerCase();
  for (const group of CRM_SERVICE_OPTIONS) {
    if (
      group.options.some(
        (o) => !o.bespoke && (o.value.toLowerCase() === s || o.label.toLowerCase() === s)
      )
    ) {
      return group.group;
    }
  }
  return null;
}

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
  const radius = pick(body, "radius", "Radius");
  const customersRequired = pick(
    body,
    "customers_required",
    "customersRequired",
    "required_leads",
    "requiredLeads",
    "customers"
  );
  const conversionRate = pick(body, "conversion_rate", "conversionRate");
  const customLeads = pick(body, "custom_leads", "customLeads");
  const avgOverride = pick(body, "avg_job_value", "avgJobValue");
  const returnOverride = pick(body, "desired_return", "desiredReturn");
  // Proposal-specific contact — overrides whatever the CRM fetch returns
  const emailInput = pick(body, "email", "Email");
  const phoneInput = pick(body, "phone", "phone_number", "Phone");
  // Account manager (who owns the lead)
  const managerName = pick(body, "manager_name", "managerName");
  const managerEmail = pick(body, "manager_email", "managerEmail");

  const missing = [
    ["lead_id", leadId],
    ["service", service],
    ["target_area", targetArea],
    ["radius", radius],
    ["customers_required", customersRequired],
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

    // Proposal-specific email/phone from the payload take precedence
    if (emailInput) contact.email = String(emailInput);
    if (phoneInput) contact.phone = String(phoneInput);

    // ── 2. Calculate fees via the pricing webhook ──
    const pricingPayload: Record<string, unknown> = {
      required_leads: Number(customersRequired),
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
      industry: industryFromService(String(service)),
      service,
      target_area: targetArea,
      radius: String(radius),
      required_leads: customersRequired,
      conversion_rate: conversionRate,
      custom_leads: customLeads ?? null,
      avg_job_value: avgOverride ?? Number(pricing.average_job_value) ?? 0,
      desired_return: returnOverride ?? Number(pricing.roi) ?? 0,
      manager_name: managerName ?? null,
      manager_email: managerEmail ?? null,
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

    const proposalUrl = `${APP_URL}/proposal/${encodeURIComponent(leadIdStr)}`;

    // ── 4. Notify the customer (SMS + email) with their proposal link ──
    const customersNum = Number(customersRequired) || 0;
    const rateNum = Number(conversionRate) || 0;
    const leadsNeeded =
      customersNum > 0 && rateNum > 0
        ? Math.ceil(customersNum / (rateNum / 100))
        : customersNum;
    const mgr = resolveManager(
      managerName ? String(managerName) : null,
      managerEmail ? String(managerEmail) : null
    );
    await sendProposalNotifications({
      firstName: (contact.first_name as string) || "there",
      business: (contact.business_name as string) || "",
      leadsNeeded,
      setupFee: data.setup_fee,
      monthlyFee: data.monthly_fee,
      conversionRate: rateNum,
      avgJobValue: Number(data.avg_job_value) || 0,
      desiredReturn: Number(data.desired_return) || 0,
      managerName: mgr.name,
      managerPhotoUrl: `${APP_URL}${mgr.photoEmail}`,
      managerPhone: mgr.phone,
      managerPhoneDisplay: mgr.phoneDisplay,
      phone: contact.phone as string | undefined,
      email: contact.email as string | undefined,
      proposalUrl,
    });

    return NextResponse.json({
      success: true,
      lead_id: leadIdStr,
      proposal_url: proposalUrl,
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
