import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find user by token
    const { data: settings } = await supabase
      .from("account_settings")
      .select("user_id")
      .eq("ical_feed_token", token)
      .single();

    if (!settings) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Fetch jobs for this user
    const { data: jobs } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", settings.user_id)
      .eq("stage", "job")
      .not("scheduled_date", "is", null);

    // Build iCal
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//LeadsEveryday//CRM//EN",
      "CALSCALE:GREGORIAN",
    ];

    for (const job of jobs || []) {
      const date = job.scheduled_date?.replace(/-/g, "");
      const time = job.scheduled_time?.replace(/:/g, "") || "090000";
      lines.push(
        "BEGIN:VEVENT",
        `UID:${job.id}@leadseveryday`,
        `DTSTART:${date}T${time}`,
        `SUMMARY:${job.title || `${job.first_name} ${job.last_name}`}`,
        `DESCRIPTION:${job.description || ""}`,
        "END:VEVENT"
      );
    }

    lines.push("END:VCALENDAR");

    return new NextResponse(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="jobs.ics"',
      },
    });
  } catch (error) {
    console.error("[calendar/feed] error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
