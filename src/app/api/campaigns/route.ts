import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthEmail } from "@/lib/api/auth";

/**
 * GET /api/campaigns
 *
 * Returns campaigns belonging to the authenticated user.
 */
export async function GET() {
  try {
    const email = await getAuthEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("email", email)
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
