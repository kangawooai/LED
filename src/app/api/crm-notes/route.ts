import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customerId, content } = await req.json();

    const { data, error } = await supabase
      .from("customer_notes")
      .insert({
        customer_id: customerId,
        content,
        is_voice_note: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[crm-notes] error:", error);
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      content: data.content,
      isVoiceNote: data.is_voice_note,
      audioUrl: data.audio_url,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error("[crm-notes] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
