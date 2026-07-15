import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SALESFORCE_WEBHOOK = process.env.PANDADOC_SALESFORCE_WEBHOOK;
const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const events = Array.isArray(body) ? body : [body];

    for (const event of events) {
      const eventName = event.event || event.status;
      const documentId = event.data?.id || event.document_id;
      const status = event.data?.status || eventName;

      if (!documentId || !status) continue;

      console.log(`[pandadoc/webhook] document=${documentId} event=${eventName} status=${status}`);

      const { data: row } = await supabase
        .from("proposal_progress")
        .select("lead_id")
        .eq("pandadoc_document_id", documentId)
        .single();

      if (!row) {
        console.warn(`[pandadoc/webhook] no proposal found for document ${documentId}`);
        continue;
      }

      await supabase
        .from("proposal_progress")
        .update({ pandadoc_status: status })
        .eq("lead_id", row.lead_id);

      if ((status === "document.completed" || eventName === "recipient_completed") && SALESFORCE_WEBHOOK) {
        fetch(SALESFORCE_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Basic ${BASIC_AUTH}` },
          body: JSON.stringify({ lead_id: row.lead_id, document_id: documentId }),
        }).catch((err) => console.error("[pandadoc/webhook] Salesforce notify failed:", err));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[pandadoc/webhook] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
