import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { calculateBillingChange } from "@/lib/utils/billing-schedule";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/campaigns/[id]/billing
 *
 * Creates a Stripe Checkout Session for a pro-rata charge when changing billing day.
 * Returns the checkout URL to redirect the customer to.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { new_billing_day } = body;

    if (!new_billing_day || new_billing_day < 1 || new_billing_day > 28) {
      return NextResponse.json(
        { error: "new_billing_day must be between 1 and 28" },
        { status: 400 }
      );
    }

    // Fetch campaign
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    let campaign;
    if (isUuid) {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      campaign = data;
    }
    if (!campaign) {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("proposal_lead_id", id)
        .maybeSingle();
      campaign = data;
    }

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Calculate pro-rata server-side
    const billingDay =
      campaign.billing_day || new Date(campaign.created_at).getDate();
    const now = new Date();
    const lastBilledDate = campaign.last_billed_date
      ? new Date(campaign.last_billed_date)
      : (() => {
          if (now.getDate() >= billingDay) {
            return new Date(now.getFullYear(), now.getMonth(), billingDay);
          }
          const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const prevYear =
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          return new Date(prevYear, prevMonth, billingDay);
        })();

    const billingChange = calculateBillingChange(
      now,
      billingDay,
      new_billing_day,
      lastBilledDate,
      Number(campaign.monthly_fee)
    );

    if (!billingChange.proRataAmount || billingChange.proRataAmount <= 0) {
      return NextResponse.json(
        { error: "No pro-rata charge required for this change" },
        { status: 400 }
      );
    }

    const amountInPence = Math.round(billingChange.proRataAmount * 100);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const campaignUrlId = campaign.proposal_lead_id || campaign.id;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: amountInPence,
            product_data: {
              name: "Billing Day Change — Pro-Rata",
              description: `Pro-rata charge for ${billingChange.proRataDays} extra days (${campaign.business_name || campaign.service})`,
            },
          },
          quantity: 1,
        },
      ],
      customer: campaign.stripe_customer_id || undefined,
      customer_email: !campaign.stripe_customer_id
        ? campaign.email || undefined
        : undefined,
      metadata: {
        campaign_id: campaign.id,
        new_billing_day: String(new_billing_day),
        pro_rata_days: String(billingChange.proRataDays),
        type: "billing_day_change",
      },
      success_url: `${appUrl}/campaigns/${campaignUrlId}?billing_session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/campaigns/${campaignUrlId}`,
    });

    return NextResponse.json({
      url: session.url,
      pro_rata_amount: billingChange.proRataAmount,
      pro_rata_days: billingChange.proRataDays,
    });
  } catch (error) {
    console.error("[campaigns/billing] error:", error);
    return NextResponse.json(
      { error: "Failed to create billing checkout" },
      { status: 500 }
    );
  }
}
