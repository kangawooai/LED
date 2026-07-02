import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { leadData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful CRM assistant. Summarize the following lead data concisely. Focus on key details like status, value, next steps, and any important notes.",
        },
        {
          role: "user",
          content: JSON.stringify(leadData),
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ summary, success: true });
  } catch (error) {
    console.error("[ai/generate-summary] error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
