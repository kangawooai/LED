import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_1 =
  "https://dwrs.omnitoria.io/webhook/9a131bcd-94bc-4a30-8a46-6d49dbd1a1f9";
const WEBHOOK_2 =
  "https://dwrs.omnitoria.io/webhook/eeb93a2b-bf5b-4185-83dd-9532fe764f54";

const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step, ...payload } = body;

    const webhookUrl = step === 1 ? WEBHOOK_1 : WEBHOOK_2;

    // Remove empty string values — webhook rejects them
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== "" && v != null)
    );

    // Normalise phone: strip spaces, replace leading 0 with 44
    if (cleanPayload.phone) {
      let phone = String(cleanPayload.phone).replace(/\s/g, "");
      if (phone.startsWith("0")) phone = "44" + phone.slice(1);
      cleanPayload.phone = Number(phone);
    }

    if (step === 1) cleanPayload.status = "Pre Demo NI";

    console.log(`[onboarding] Step ${step} payload:`, JSON.stringify(cleanPayload));

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: JSON.stringify(cleanPayload),
    });

    const text = await res.text();
    console.log(`[onboarding] Step ${step} response (${res.status}):`, text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Non-JSON response from webhook", raw: text },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Onboarding webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
