import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const regenerate = body.regenerate === true;

    // Check if token exists
    const { data: settings } = await supabase
      .from("account_settings")
      .select("ical_feed_token")
      .eq("user_id", user.id)
      .single();

    let token = settings?.ical_feed_token;

    if (!token || regenerate) {
      token = randomUUID();
      await supabase
        .from("account_settings")
        .upsert({ user_id: user.id, ical_feed_token: token });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const feedUrl = `${baseUrl}/api/calendar/feed/${token}`;

    return NextResponse.json({ feedUrl, token });
  } catch (error) {
    console.error("[calendar/feed/setup] error:", error);
    return NextResponse.json({ error: "Failed to setup feed" }, { status: 500 });
  }
}
