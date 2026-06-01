import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RECIPIENTS = [
  "motsales.co.uk@gmail.com",
  "jamie.stroulger@digitalincubator.co",
];

const ZAPIER_WEBHOOK =
  "https://hooks.zapier.com/hooks/catch/24449961/4b3cuby/";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, business, service, industry, trade, ...rest } =
      body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Forward to Zapier (keep existing integration)
    const zapierPayload = { name, email, phone, business, service, industry, trade, ...rest };
    const zapierPromise = fetch(ZAPIER_WEBHOOK, {
      method: "POST",
      body: JSON.stringify(zapierPayload),
    }).catch((err) => {
      console.error("Zapier webhook error:", err);
    });

    // Send email to new recipients
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const serviceName = service || trade || "Not specified";
    const industryName = industry || "Not specified";

    const utmLines = Object.entries(rest)
      .filter(([key]) => key.startsWith("utm_"))
      .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
      .join("\n");

    const emailPromise = transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: EMAIL_RECIPIENTS.join(", "),
      replyTo: email,
      subject: `New Lead Enquiry: ${serviceName} - ${name}`,
      html: `
        <h2>New Lead Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business:</strong> ${business || "Not provided"}</p>
        <p><strong>Industry:</strong> ${industryName}</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        ${utmLines ? `<hr><h3>UTM Data</h3>${utmLines}` : ""}
      `,
    });

    // Run both in parallel
    await Promise.all([zapierPromise, emailPromise]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry form error:", error);
    return NextResponse.json(
      { error: "Failed to send enquiry." },
      { status: 500 }
    );
  }
}
