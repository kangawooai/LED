import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const session = await stripe.checkout.sessions.retrieve(session_id);

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
