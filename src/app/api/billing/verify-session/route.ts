import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/billing/verify-session
 *
 * Verifies a completed Stripe Checkout Session.
 * Stores Stripe customer & payment IDs in proposal_progress.
 * Returns payment details so the client can fire the Omnitoria webhook.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, lead_id } = body;

    if (!session_id || !lead_id) {
      return NextResponse.json(
        { error: "session_id and lead_id are required" },
        { status: 400 }
      );
    }

    const session = await getStripe().checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed", payment_status: session.payment_status },
        { status: 402 }
      );
    }

    // Verify this session belongs to this lead
    if (session.metadata?.lead_id !== lead_id) {
      return NextResponse.json(
        { error: "Session does not match lead" },
        { status: 403 }
      );
    }

    const customerId = typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null;
    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

    // Store Stripe IDs in proposal_progress
    const { error: updateError } = await supabase
      .from("proposal_progress")
      .update({
        stripe_customer_id: customerId,
        stripe_payment_id: paymentIntentId,
      })
      .eq("lead_id", lead_id);

    if (updateError) {
      console.error("[verify-session] failed to store Stripe IDs:", updateError);
    }

    // Notify Salesforce of payment via Omnitoria
    const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");
    try {
      await fetch("https://dwrs.omnitoria.io/webhook/06bc69b2-299a-4ea1-9883-e2bcf638e07d", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${BASIC_AUTH}` },
        body: JSON.stringify({
          lead_id,
          customer_id: customerId || "",
          payment_id: paymentIntentId || "",
          subscription_date: new Date().toISOString(),
          subscription_id: "",
          status: "Converted",
          convert: true,
        }),
      });

      // Fetch opportunity_id and yhc from Salesforce
      const linkRes = await fetch("https://dwrs.omnitoria.io/webhook/8a99dd8d-9031-4ea5-9265-9cdda89615bf", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${BASIC_AUTH}` },
        body: JSON.stringify({ linked_id: lead_id }),
      });
      const linkData = await linkRes.json();
      console.log("[verify-session] link webhook response:", linkData);

      if (linkData.opportunity_id || linkData.yhc) {
        await supabase
          .from("proposal_progress")
          .update({
            opportunity_id: linkData.opportunity_id || null,
            yhc: linkData.yhc || null,
          })
          .eq("lead_id", lead_id);
      }
    } catch (err) {
      console.error("[verify-session] webhook chain failed:", err);
    }

    // Create campaign from the proposal
    const { data: proposal } = await supabase
      .from("proposal_progress")
      .select("*")
      .eq("lead_id", lead_id)
      .single();

    if (proposal) {
      const campaignName = `${proposal.service} - ${proposal.business_name || [proposal.first_name, proposal.last_name].filter(Boolean).join(" ")}`;
      const { error: campaignError } = await supabase
        .from("campaigns")
        .upsert(
          {
            proposal_lead_id: lead_id,
            name: campaignName,
            customers_required: parseInt(proposal.custom_leads || proposal.required_leads || "0", 10),
            service: proposal.service,
            target_area: proposal.target_area,
            monthly_fee: proposal.monthly_fee,
            setup_fee: proposal.setup_fee,
            total_fee: proposal.total_fee,
            industry: proposal.industry,
            required_leads: proposal.required_leads,
            conversion_rate: proposal.conversion_rate,
            custom_leads: proposal.custom_leads,
            first_name: proposal.first_name,
            last_name: proposal.last_name,
            email: proposal.email,
            phone: proposal.phone,
            business_name: proposal.business_name,
            company_address: proposal.company_address,
            company_number: proposal.company_number,
            stripe_customer_id: customerId,
            stripe_payment_id: paymentIntentId,
            linked_id: proposal.linked_id,
            opportunity_id: proposal.opportunity_id,
            stage: "campaign",
            campaign_status: "active",
            billing_day: proposal.billing_day || 1,
          },
          { onConflict: "proposal_lead_id" }
        );

      if (campaignError) {
        console.error("[verify-session] failed to create campaign:", campaignError);
      }
    }

    return NextResponse.json({
      paid: true,
      customer_id: customerId,
      payment_intent_id: paymentIntentId,
      customer_email: session.customer_details?.email || null,
      amount_total: session.amount_total,
    });
  } catch (error) {
    console.error("[verify-session] error:", error);
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}
