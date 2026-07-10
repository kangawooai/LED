import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SALESFORCE_WEBHOOK = process.env.VERIFF_SALESFORCE_WEBHOOK;
const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verification } = body;

    if (!verification?.vendorData || !verification?.status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const leadId = verification.vendorData;
    const status = verification.status.toLowerCase();
    const sessionId = verification.id;

    console.log(`[veriff/webhook] lead_id=${leadId} status=${status} session=${sessionId}`);

    await supabase
      .from("proposal_progress")
      .update({ veriff_status: status })
      .eq("lead_id", leadId);

    if (status === "approved" && SALESFORCE_WEBHOOK) {
      fetch(SALESFORCE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${BASIC_AUTH}` },
        body: JSON.stringify({ lead_id: leadId, verif_id: sessionId }),
      }).catch((err) => console.error("[veriff/webhook] Salesforce notify failed:", err));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[veriff/webhook] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
