import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";
import { CRM_SERVICE_OPTIONS } from "@/constants";
import { sendSms } from "@/lib/clicksend";

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

interface ProposalSummary {
  firstName: string;
  business: string;
  leadsNeeded: number;
  setupFee: string | number;
  monthlyFee: string | number;
  phone?: string;
  email?: string;
  proposalUrl: string;
}

const gbp2 = (v: string | number) => {
  const n = Number(v);
  return isNaN(n)
    ? String(v)
    : `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Send the customer their proposal link by SMS and email (best-effort, never throws)
async function sendProposalNotifications(s: ProposalSummary) {
  const { firstName, business, leadsNeeded, setupFee, monthlyFee, phone, email, proposalUrl } = s;
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
    const grow = business
      ? `your tailored plan to grow <span style="color:#22c55e;">${business}</span>`
      : `your tailored plan to grow your business`;

    tasks.push(
      transporter
        .sendMail({
          from: `Leads Every Day <${env("SMTP_FROM") || env("SMTP_USER")}>`,
          to: email,
          subject: "Your Leads Every Day proposal is ready",
          html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="padding:24px 32px;background-color:#1e293b;border-radius:12px 12px 0 0;border-bottom:2px solid #22c55e;">
  <img src="https://www.leadseveryday.co.uk/leads-everyday-neg.png" alt="Leads Every Day" width="180" height="21" style="display:block;border:0;" />
</td></tr>

<!-- Title -->
<tr><td style="padding:28px 32px 4px;background-color:#1e293b;">
  <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#22c55e;">Lead Generation Proposal &middot; Prepared for ${firstName}</p>
  <h1 style="margin:0 0 10px;font-size:26px;line-height:1.2;font-weight:700;color:#f8fafc;">${firstName}, ${grow}.</h1>
  <p style="margin:0;font-size:15px;color:#94a3b8;line-height:1.55;">More leads, more customers and more profit. Here's a snapshot of your tailored package &mdash; tap through for the full proposal.</p>
</td></tr>

<!-- Pricing cards -->
<tr><td style="padding:20px 32px 8px;background-color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td width="33%" valign="top" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border:1px solid #243247;border-radius:10px;"><tr><td style="padding:16px 10px;text-align:center;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#22c55e;">Leads / month</p>
        <p style="margin:0 0 4px;font-size:26px;font-weight:700;color:#f8fafc;">${leadsNeeded}</p>
        <p style="margin:0;font-size:11px;color:#64748b;">exclusive leads</p>
      </td></tr></table>
    </td>
    <td width="33%" valign="top" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border:1px solid #243247;border-radius:10px;"><tr><td style="padding:16px 10px;text-align:center;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#22c55e;">One-off setup</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#f8fafc;">${gbp2(setupFee)}</p>
        <p style="margin:0;font-size:11px;color:#64748b;">+ VAT &middot; once</p>
      </td></tr></table>
    </td>
    <td width="33%" valign="top" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b2a17;border:2px solid #22c55e;border-radius:10px;"><tr><td style="padding:16px 10px;text-align:center;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#22c55e;">Ongoing</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#f8fafc;">${gbp2(monthlyFee)}</p>
        <p style="margin:0;font-size:11px;color:#64748b;">+ VAT &middot; / month</p>
      </td></tr></table>
    </td>
  </tr></table>
  <p style="margin:12px 4px 0;font-size:11px;color:#64748b;text-align:center;">Every lead is exclusive to you. No long-term contract &mdash; after month one, 30 days' notice any time.</p>
</td></tr>

<!-- CTA -->
<tr><td style="padding:20px 32px 4px;background-color:#1e293b;text-align:center;">
  <table cellpadding="0" cellspacing="0" align="center"><tr>
    <td style="background-color:#22c55e;border-radius:8px;"><a href="${proposalUrl}" style="display:inline-block;padding:14px 34px;color:#fff;font-size:16px;font-weight:700;text-decoration:none;">View Your Proposal</a></td>
  </tr></table>
  <p style="margin:16px 0 0;font-size:12px;color:#64748b;word-break:break-all;">Or paste this link into your browser:<br><a href="${proposalUrl}" style="color:#22c55e;">${proposalUrl}</a></p>
</td></tr>

<!-- Social proof -->
<tr><td style="padding:18px 32px 24px;background-color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #243247;"><tr>
    <td style="padding-top:16px;text-align:center;"><p style="margin:0;font-size:18px;font-weight:700;color:#f8fafc;">20,000+</p><p style="margin:2px 0 0;font-size:10px;color:#64748b;">Campaigns</p></td>
    <td style="padding-top:16px;text-align:center;"><p style="margin:0;font-size:18px;font-weight:700;color:#f8fafc;">1M+</p><p style="margin:2px 0 0;font-size:10px;color:#64748b;">Leads</p></td>
    <td style="padding-top:16px;text-align:center;"><p style="margin:0;font-size:18px;font-weight:700;color:#f8fafc;">1,200+</p><p style="margin:2px 0 0;font-size:10px;color:#64748b;">Reviews</p></td>
    <td style="padding-top:16px;text-align:center;"><p style="margin:0;font-size:18px;font-weight:700;color:#f8fafc;">48hrs</p><p style="margin:2px 0 0;font-size:10px;color:#64748b;">Avg go-live</p></td>
  </tr></table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 32px;background-color:#0f172a;border-radius:0 0 12px 12px;text-align:center;">
  <p style="margin:0;font-size:12px;color:#475569;">Leads Every Day &middot; <a href="https://www.leadseveryday.co.uk" style="color:#22c55e;text-decoration:none;">leadseveryday.co.uk</a></p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`,
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
        (o) => o.value.toLowerCase() === s || o.label.toLowerCase() === s
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
    await sendProposalNotifications({
      firstName: (contact.first_name as string) || "there",
      business: (contact.business_name as string) || "",
      leadsNeeded,
      setupFee: data.setup_fee,
      monthlyFee: data.monthly_fee,
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
