import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/campaigns
 *
 * Returns all campaigns from the campaigns table.
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[campaigns] GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch campaigns" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("[campaigns] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
