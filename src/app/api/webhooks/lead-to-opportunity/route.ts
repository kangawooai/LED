import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const OMNITORIA_WEBHOOK_URL =
  "https://dwrs.omnitoria.io/webhook/06bc69b2-299a-4ea1-9883-e2bcf638e07d";

const OMNITORIA_POST_CONVERSION_URL =
  "https://dwrs.omnitoria.io/webhook/9d98d1d5-17dd-4bb5-a158-c9c96a4cae74";

const OMNITORIA_GET_OPPORTUNITY_URL =
  "https://dwrs.omnitoria.io/webhook/8a99dd8d-9031-4ea5-9265-9cdda89615bf";

const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

/**
 * POST /api/webhooks/lead-to-opportunity
 *
 * Fires the Omnitoria webhook to convert a Salesforce Lead → Opportunity.
 * Stores the returned linked_id in proposal_progress for later Opportunity queries.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead_id, customer_id, payment_id, subscription_date, subscription_id } = body;

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
    }

    const webhookRes = await fetch(OMNITORIA_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: JSON.stringify({
        lead_id,
        customer_id: customer_id || "",
        payment_id: payment_id || "",
        subscription_date: subscription_date || "",
        subscription_id: subscription_id || "",
      }),
    });

    if (!webhookRes.ok) {
      const text = await webhookRes.text();
      console.error("[lead-to-opportunity] webhook failed:", webhookRes.status, text);
      return NextResponse.json(
        { error: "Webhook call failed", status: webhookRes.status },
        { status: 502 }
      );
    }

    const result = await webhookRes.json();
    // Expected: { "Success": "200", "linked_id": "..." }
    const linkedId = result.linked_id || null;

    // Store linked_id in proposal_progress for Salesforce Opportunity lookup
    if (linkedId) {
      const { error: updateError } = await supabase
        .from("proposal_progress")
        .update({ linked_id: linkedId })
        .eq("lead_id", lead_id);

      if (updateError) {
        console.error("[lead-to-opportunity] failed to store linked_id:", updateError);
      }
    }

    // Fire post-conversion webhook with lead_id
    try {
      const postConvRes = await fetch(OMNITORIA_POST_CONVERSION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${BASIC_AUTH}`,
        },
        body: JSON.stringify({ lead_id }),
      });

      if (!postConvRes.ok) {
        const text = await postConvRes.text();
        console.error("[lead-to-opportunity] post-conversion webhook failed:", postConvRes.status, text);
      } else {
        const postConvResult = await postConvRes.json();
        console.log("[lead-to-opportunity] post-conversion response:", JSON.stringify(postConvResult));
      }
    } catch (postConvError) {
      console.error("[lead-to-opportunity] post-conversion webhook error:", postConvError);
    }

    // Fetch opportunity_id using linked_id
    let opportunityId: string | null = null;
    if (linkedId) {
      try {
        const oppRes = await fetch(OMNITORIA_GET_OPPORTUNITY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${BASIC_AUTH}`,
          },
          body: JSON.stringify({ linked_id: linkedId }),
        });

        if (!oppRes.ok) {
          const text = await oppRes.text();
          console.error("[lead-to-opportunity] get-opportunity webhook failed:", oppRes.status, text);
        } else {
          const oppResult = await oppRes.json();
          console.log("[lead-to-opportunity] get-opportunity response:", JSON.stringify(oppResult));
          opportunityId = oppResult.opportunity_id || null;

          if (opportunityId) {
            const { error: oppUpdateError } = await supabase
              .from("proposal_progress")
              .update({ opportunity_id: opportunityId })
              .eq("lead_id", lead_id);

            if (oppUpdateError) {
              console.error("[lead-to-opportunity] failed to store opportunity_id:", oppUpdateError);
            }
          }
        }
      } catch (oppError) {
        console.error("[lead-to-opportunity] get-opportunity webhook error:", oppError);
      }
    }

    // Create campaign row from proposal data
    let campaignId: string | null = null;
    try {
      const { data: proposal } = await supabase
        .from("proposal_progress")
        .select("*")
        .eq("lead_id", lead_id)
        .single();

      if (proposal) {
        const { data: campaign, error: campaignError } = await supabase
          .from("campaigns")
          .upsert(
            {
              // Proposal linking fields
              proposal_lead_id: lead_id,
              opportunity_id: opportunityId,
              linked_id: linkedId,
              // CRM-required fields
              name: proposal.business_name || proposal.service || "Campaign",
              stage: "campaign",
              currency: "GBP",
              customers_required: parseInt(proposal.custom_leads || proposal.required_leads) || 0,
              // Shared fields
              service: proposal.service,
              target_area: proposal.target_area,
              monthly_fee: proposal.monthly_fee,
              setup_fee: proposal.setup_fee,
              billing_day: proposal.billing_day || new Date().getDate(),
              campaign_status: "active",
              start_date: new Date().toISOString(),
              // Proposal-specific fields
              industry: proposal.industry,
              required_leads: proposal.required_leads,
              conversion_rate: proposal.conversion_rate,
              custom_leads: proposal.custom_leads,
              total_fee: proposal.total_fee,
              first_name: proposal.first_name,
              last_name: proposal.last_name,
              email: proposal.email,
              phone: proposal.phone,
              business_name: proposal.business_name,
              company_address: proposal.company_address,
              company_number: proposal.company_number,
              stripe_customer_id: proposal.stripe_customer_id || customer_id || null,
              stripe_payment_id: proposal.stripe_payment_id || payment_id || null,
            },
            { onConflict: "proposal_lead_id" }
          )
          .select()
          .single();

        if (campaignError) {
          console.error("[lead-to-opportunity] failed to create campaign:", campaignError);
        } else {
          campaignId = campaign?.id || null;
          console.log("[lead-to-opportunity] campaign created:", campaignId);
        }
      }
    } catch (campaignErr) {
      console.error("[lead-to-opportunity] campaign creation error:", campaignErr);
    }

    return NextResponse.json({
      success: true,
      linked_id: linkedId,
      opportunity_id: opportunityId,
      campaign_id: campaignId,
    });
  } catch (error) {
    console.error("[lead-to-opportunity] error:", error);
    return NextResponse.json(
      { error: "Failed to call lead-to-opportunity webhook" },
      { status: 500 }
    );
  }
}
