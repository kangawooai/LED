import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/campaigns/[id]/billing/confirm
 *
 * Verifies a completed Stripe Checkout Session for a billing day change.
 * If payment is confirmed, applies the billing day change to the campaign.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Payment not completed",
          payment_status: session.payment_status,
        },
        { status: 402 }
      );
    }

    // Verify this is a billing day change session
    if (session.metadata?.type !== "billing_day_change") {
      return NextResponse.json(
        { error: "Invalid session type" },
        { status: 400 }
      );
    }

    const campaignId = session.metadata.campaign_id;
    const newBillingDay = parseInt(session.metadata.new_billing_day, 10);

    if (!campaignId || isNaN(newBillingDay)) {
      return NextResponse.json(
        { error: "Invalid session metadata" },
        { status: 400 }
      );
    }

    // Verify this session belongs to the right campaign
    // Look up the campaign by URL id to get the actual UUID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    let campaign;
    if (isUuid) {
      const { data } = await supabase
        .from("campaigns")
        .select("id")
        .eq("id", id)
        .maybeSingle();
      campaign = data;
    }
    if (!campaign) {
      const { data } = await supabase
        .from("campaigns")
        .select("id")
        .eq("proposal_lead_id", id)
        .maybeSingle();
      campaign = data;
    }

    if (!campaign || campaign.id !== campaignId) {
      return NextResponse.json(
        { error: "Session does not match campaign" },
        { status: 403 }
      );
    }

    // Apply the billing day change
    const { data: updated, error: updateError } = await supabase
      .from("campaigns")
      .update({ billing_day: newBillingDay })
      .eq("id", campaignId)
      .select()
      .single();

    if (updateError) {
      console.error(
        "[campaigns/billing/confirm] update error:",
        updateError
      );
      return NextResponse.json(
        { error: "Failed to update billing day" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      billing_day: newBillingDay,
      campaign: updated,
      payment_amount: session.amount_total,
    });
  } catch (error) {
    console.error("[campaigns/billing/confirm] error:", error);
    return NextResponse.json(
      { error: "Failed to confirm billing change" },
      { status: 500 }
    );
  }
}
