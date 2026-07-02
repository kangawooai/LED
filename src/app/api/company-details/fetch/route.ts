import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_FETCH =
  "https://dwrs.omnitoria.io/webhook/c7e7deff-8e45-4185-a8d2-185cb8e8d53b";

const BASIC_AUTH = Buffer.from("leadseveryday:8pH3&9}0`iOZ").toString("base64");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead_id } = body;

    if (!lead_id) {
      return NextResponse.json(
        { error: "lead_id is required" },
        { status: 400 }
      );
    }

    console.log("[company-details/fetch] lead_id:", lead_id);

    const res = await fetch(WEBHOOK_FETCH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: JSON.stringify({ lead_id }),
    });

    const text = await res.text();
    console.log(`[company-details/fetch] response (${res.status}):`, text);

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
    console.error("Company details fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch details" },
      { status: 500 }
    );
  }
}
