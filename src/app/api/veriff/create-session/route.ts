import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const VERIFF_API_KEY = process.env.VERIFF_API_KEY!;
const VERIFF_BASE_URL = "https://stationapi.veriff.com/v1";

export async function POST(req: NextRequest) {
  try {
    const { lead_id, first_name, last_name } = await req.json();

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
    }

    const res = await fetch(`${VERIFF_BASE_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-CLIENT": VERIFF_API_KEY,
      },
      body: JSON.stringify({
        verification: {
          callback: `https://www.leadseveryday.co.uk/proposal/${lead_id}`,
          person: {
            firstName: first_name || undefined,
            lastName: last_name || undefined,
          },
          vendorData: lead_id,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      console.error("[veriff] session create failed:", data);
      return NextResponse.json({ error: "Failed to create Veriff session" }, { status: 502 });
    }

    const { id: sessionId, url: sessionUrl } = data.verification;

    await supabase
      .from("proposal_progress")
      .update({ veriff_session_id: sessionId, veriff_status: "created" })
      .eq("lead_id", lead_id);

    return NextResponse.json({ sessionId, sessionUrl });
  } catch (error) {
    console.error("[veriff] create-session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
