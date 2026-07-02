import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/billing/create-checkout
 *
 * Creates a Stripe Checkout Session for the one-off setup fee.
 * Returns the checkout URL to redirect the customer to.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead_id, setup_fee, customer_email, business_name } = body;

    if (!lead_id || !setup_fee) {
      return NextResponse.json(
        { error: "lead_id and setup_fee are required" },
        { status: 400 }
      );
    }

    // Convert fee string (e.g. "250.00") to pence for Stripe
    // TODO: Remove override — hardcoded to £1 (100p) for testing
    const amountInPence = 100; // Math.round(parseFloat(setup_fee) * 100);

    if (isNaN(amountInPence) || amountInPence <= 0) {
      return NextResponse.json(
        { error: "Invalid setup_fee amount" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: amountInPence,
            product_data: {
              name: "Campaign Setup Fee",
              description: `One-off setup fee for ${business_name || "your"} lead generation campaign`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: customer_email || undefined,
      customer_creation: "always",
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
      metadata: {
        lead_id,
      },
      success_url: `${appUrl}/proposal/${lead_id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/proposal/${lead_id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[create-checkout] error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
