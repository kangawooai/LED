import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthEmail } from "@/lib/api/auth";

/* GET /api/proposals?status=pending|paid
 *   pending (default) = payment not yet completed (shown in Proposals)
 *   paid              = payment completed (shown in Campaigns)
 */
export async function GET(req: NextRequest) {
  try {
    const email = await getAuthEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get("status") || "pending";

    const { data, error } = await supabase
      .from("proposal_progress")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[proposals] GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch proposals" },
        { status: 500 }
      );
    }

    const filtered = (data ?? []).filter((row) => {
      const steps: string[] = row.completed_steps ?? [];
      const isPaid = steps.includes("confirm");
      return status === "paid" ? isPaid : !isPaid;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("[proposals] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}
