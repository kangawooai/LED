import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customerId, to, subject, body } = await req.json();

    // Send email via SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: body,
    });

    // Record the communication
    await supabase.from("customer_communications").insert({
      customer_id: customerId,
      type: "email",
      direction: "outbound",
      summary: `Subject: ${subject}\n\n${body}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[crm-email] error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
