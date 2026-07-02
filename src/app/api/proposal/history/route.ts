import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/* GET /api/proposal/history?lead_id=xxx
 *   Returns edit history for a proposal, newest first.
 */
export async function GET(req: NextRequest) {
  try {
    const leadId = req.nextUrl.searchParams.get("lead_id");
    if (!leadId) {
      return NextResponse.json(
        { error: "lead_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("proposal_edit_history")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[proposal/history] GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch edit history" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("[proposal/history] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch edit history" },
      { status: 500 }
    );
  }
}
