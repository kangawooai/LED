import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customerId, type } = await req.json();

    // TODO: Implement Google Calendar sync
    // For now, just acknowledge the request
    console.log(`[calendar/sync] Sync requested for ${type} ${customerId}`);

    return NextResponse.json({ synced: false, message: "Calendar sync not yet configured" });
  } catch (error) {
    console.error("[calendar/sync] error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
