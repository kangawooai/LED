import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RECIPIENTS = [
  "leads@leadseveryday.co.uk",
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
      headers: { "Content-Type": "application/json" },
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

    const utmRows = Object.entries(rest)
      .filter(([key]) => key.startsWith("utm_"))
      .map(
        ([key, value]) =>
          `<tr><td style="padding:8px 12px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">${key}</td><td style="padding:8px 12px;color:#e2e8f0;font-size:13px;border-bottom:1px solid #1e293b;">${value}</td></tr>`
      )
      .join("");

    const emailPromise = transporter.sendMail({
      from: `Leads Every Day <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: EMAIL_RECIPIENTS.join(", "),
      replyTo: email,
      subject: `New Lead: ${serviceName} — ${name}`,
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="padding:24px 32px;background-color:#1e293b;border-radius:12px 12px 0 0;border-bottom:2px solid #22c55e;">
  <img src="https://www.leadseveryday.co.uk/led_logo_white_green.png" alt="Leads Every Day" width="180" height="21" style="display:block;border:0;" />
</td></tr>

<!-- Badge -->
<tr><td style="padding:24px 32px 0;background-color:#1e293b;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="background-color:#22c55e;color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 12px;border-radius:4px;">New Lead</td>
    <td style="padding-left:12px;color:#94a3b8;font-size:13px;">${new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
  </tr></table>
</td></tr>

<!-- Title -->
<tr><td style="padding:16px 32px 0;background-color:#1e293b;">
  <h1 style="margin:0;font-size:22px;font-weight:600;color:#f8fafc;">${name}</h1>
  <p style="margin:4px 0 0;font-size:14px;color:#94a3b8;">${serviceName} &middot; ${industryName}</p>
</td></tr>

<!-- Lead Details -->
<tr><td style="padding:20px 32px;background-color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="padding:12px 16px;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;border-bottom:1px solid #1e293b;" colspan="2">Contact Details</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;width:100px;border-bottom:1px solid #1e293b;">Name</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;font-weight:500;border-bottom:1px solid #1e293b;">${name}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Email</td>
      <td style="padding:10px 16px;border-bottom:1px solid #1e293b;"><a href="mailto:${email}" style="color:#22c55e;font-size:14px;text-decoration:none;">${email}</a></td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Phone</td>
      <td style="padding:10px 16px;border-bottom:1px solid #1e293b;"><a href="tel:${phone}" style="color:#22c55e;font-size:14px;text-decoration:none;">${phone}</a></td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Business</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;border-bottom:1px solid #1e293b;">${business || "Not provided"}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Industry</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;border-bottom:1px solid #1e293b;">${industryName}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;">Service</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;">${serviceName}</td>
    </tr>
  </table>
</td></tr>

${utmRows ? `<!-- UTM Data -->
<tr><td style="padding:0 32px 20px;background-color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="padding:12px 16px;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;border-bottom:1px solid #1e293b;" colspan="2">Campaign Data</td>
    </tr>
    ${utmRows}
  </table>
</td></tr>` : ""}

<!-- CTA -->
<tr><td style="padding:0 32px 24px;background-color:#1e293b;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="background-color:#22c55e;border-radius:6px;"><a href="mailto:${email}" style="display:inline-block;padding:10px 24px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Reply to ${name.split(" ")[0]}</a></td>
    <td style="padding-left:8px;"><a href="tel:${phone}" style="display:inline-block;padding:10px 24px;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:14px;font-weight:500;text-decoration:none;">Call ${phone}</a></td>
  </tr></table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 32px;background-color:#0f172a;border-radius:0 0 12px 12px;text-align:center;">
  <p style="margin:0;font-size:12px;color:#475569;">Leads Every Day &middot; <a href="https://www.leadseveryday.co.uk" style="color:#22c55e;text-decoration:none;">leadseveryday.co.uk</a></p>
  <p style="margin:4px 0 0;font-size:11px;color:#334155;">This is an automated lead notification from your website.</p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`,
    }).catch((err) => {
      console.error("Email send error:", err);
    });

    // Run both in parallel — both are non-fatal so the form always succeeds
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
