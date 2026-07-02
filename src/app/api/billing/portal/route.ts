import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const { data: billing } = await supabase
      .from("billing_info")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!billing?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.billingPortal.sessions.create({
      customer: billing.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account`,
    });

    return NextResponse.json({ url: session.url, success: true });
  } catch (error) {
    console.error("[billing/portal] error:", error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
