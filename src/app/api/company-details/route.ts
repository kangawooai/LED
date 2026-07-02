import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SAVE =
  "https://dwrs.omnitoria.io/webhook/d704dcec-5a71-40ef-b6fe-186fc92b9d9e";

const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Remove empty string values — webhook rejects them
    const cleanPayload = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== "" && v != null)
    );

    // Normalise phone: strip spaces, replace leading 0 with 44
    if (cleanPayload.phone) {
      let phone = String(cleanPayload.phone).replace(/\s/g, "");
      if (phone.startsWith("0")) phone = "44" + phone.slice(1);
      cleanPayload.phone = Number(phone);
    }

    // Keep company_number as a string (preserves leading zeros)
    if (cleanPayload.company_number) {
      cleanPayload.company_number = String(cleanPayload.company_number).trim();
    }

    // Cast lead_id to number if digits only
    if (cleanPayload.lead_id) {
      const lid = String(cleanPayload.lead_id).trim();
      if (/^\d+$/.test(lid)) {
        cleanPayload.lead_id = Number(lid);
      }
    }

    console.log("[company-details] payload:", JSON.stringify(cleanPayload));

    const res = await fetch(WEBHOOK_SAVE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: JSON.stringify(cleanPayload),
    });

    const text = await res.text();
    console.log(`[company-details] response (${res.status}):`, text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Non-JSON response from webhook", raw: text },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (error) {
    console.error("Company details webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
