import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY!;
const PANDADOC_BASE = "https://api.pandadoc.com/public/v1";

export async function POST(req: NextRequest) {
  try {
    const { lead_id } = await req.json();

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
    }

    const { data: proposal } = await supabase
      .from("proposal_progress")
      .select("*")
      .eq("lead_id", lead_id)
      .single();

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const recipientEmail = proposal.email || "";
    const recipientFirst = proposal.first_name || "";
    const recipientLast = proposal.last_name || "";
    const fullName = `${recipientFirst} ${recipientLast}`.trim();
    const address = [proposal.street_address, proposal.city, proposal.post_code, proposal.country].filter(Boolean).join(", ");

    const createRes = await fetch(`${PANDADOC_BASE}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `API-Key ${PANDADOC_API_KEY}`,
      },
      body: JSON.stringify({
        name: `Leads Every Day – Terms and Conditions – ${recipientFirst} ${recipientLast}`.trim(),
        template_uuid: "GbQcs2oimexrj3CnbdSkk2",
        recipients: [
          {
            email: recipientEmail,
            first_name: recipientFirst,
            last_name: recipientLast,
            role: "Client",
            signing_order: 1,
            verification_settings: {
              auth_type: "id_verification",
              verification_place: "before_open",
            },
          },
        ],
        tokens: [
          { name: "RecipientName", value: fullName },
          { name: "RecipientEmail", value: recipientEmail },
          { name: "BusinessName", value: proposal.business_name || "" },
          { name: "Address", value: address },
          { name: "CustomerName(SF)", value: fullName },
          { name: "SetupFee(SF)", value: proposal.setup_fee ? `£${proposal.setup_fee}` : "" },
          { name: "1stMonthMoney", value: proposal.monthly_fee ? `£${proposal.monthly_fee}` : "" },
          { name: "AverageLeadsRequired", value: String(proposal.required_leads || "") },
          { name: "PaymentDayofMonth", value: String(proposal.billing_day || "") },
          { name: "GoLiveDate(SF)", value: "" },
          { name: "YHC", value: "" },
        ],
        metadata: { lead_id },
        parse_form_fields: false,
      }),
    });

    const doc = await createRes.json();

    if (!createRes.ok) {
      console.error("[pandadoc] create failed:", doc);
      return NextResponse.json({ error: "Failed to create document", detail: doc }, { status: 502 });
    }

    const documentId = doc.id;

    await supabase
      .from("proposal_progress")
      .update({ pandadoc_document_id: documentId, pandadoc_status: "document.draft" })
      .eq("lead_id", lead_id);

    // Wait for document to finish processing before sending
    let ready = false;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(`${PANDADOC_BASE}/documents/${documentId}`, {
        headers: { Authorization: `API-Key ${PANDADOC_API_KEY}` },
      });
      const statusData = await statusRes.json();
      if (statusData.status === "document.draft") {
        ready = true;
        break;
      }
    }

    if (!ready) {
      console.error("[pandadoc] document not ready after polling");
      return NextResponse.json({ error: "Document not ready" }, { status: 504 });
    }

    // Send document for signing
    const sendRes = await fetch(`${PANDADOC_BASE}/documents/${documentId}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `API-Key ${PANDADOC_API_KEY}`,
      },
      body: JSON.stringify({
        message: "Please review and sign your Leads Every Day service agreement.",
        silent: true,
      }),
    });

    if (!sendRes.ok) {
      const sendErr = await sendRes.json();
      console.error("[pandadoc] send failed:", sendErr);
      return NextResponse.json({ error: "Failed to send document" }, { status: 502 });
    }

    await supabase
      .from("proposal_progress")
      .update({ pandadoc_status: "document.sent" })
      .eq("lead_id", lead_id);

    // Create a session link for the recipient
    const sessionRes = await fetch(`${PANDADOC_BASE}/documents/${documentId}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `API-Key ${PANDADOC_API_KEY}`,
      },
      body: JSON.stringify({
        recipient: recipientEmail,
        lifetime: 3600,
        redirect_url: `https://www.leadseveryday.co.uk/proposal/${lead_id}`,
      }),
    });

    const session = await sessionRes.json();

    if (!sessionRes.ok) {
      console.error("[pandadoc] session failed:", session);
      return NextResponse.json({ error: "Failed to create signing session" }, { status: 502 });
    }

    return NextResponse.json({ documentId, sessionUrl: session.id ? `https://app.pandadoc.com/s/${session.id}` : session.url });
  } catch (error) {
    console.error("[pandadoc] create-document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
