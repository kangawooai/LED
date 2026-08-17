import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { business, customer, service, targetArea, leadsPerMonth, customersPerMonth, conversionRate, setupFee, monthlyFee, firstPayment, managerEmail } = await request.json();

    if (!business || !customer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recipient = (managerEmail || "").trim() || "robert@leadseveryday.co.uk";

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const date = new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await transporter.sendMail({
      from: `Leads Every Day <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: recipient,
      subject: `Proposal Accepted — ${business}`,
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="padding:24px 32px;background-color:#1e293b;border-radius:12px 12px 0 0;border-bottom:2px solid #22c55e;">
  <img src="https://www.leadseveryday.co.uk/leads-everyday-neg.png" alt="Leads Every Day" width="180" height="21" style="display:block;border:0;" />
</td></tr>

<!-- Badge -->
<tr><td style="padding:24px 32px 0;background-color:#1e293b;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="background-color:#22c55e;color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 12px;border-radius:4px;">Proposal Accepted</td>
    <td style="padding-left:12px;color:#94a3b8;font-size:13px;">${date}</td>
  </tr></table>
</td></tr>

<!-- Title -->
<tr><td style="padding:16px 32px 0;background-color:#1e293b;">
  <h1 style="margin:0;font-size:22px;font-weight:600;color:#f8fafc;">${customer} has accepted their proposal</h1>
  <p style="margin:4px 0 0;font-size:14px;color:#94a3b8;">${business}</p>
</td></tr>

<!-- Proposal Details -->
<tr><td style="padding:20px 32px;background-color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="padding:12px 16px;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;border-bottom:1px solid #1e293b;" colspan="2">Proposal Summary</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;width:140px;border-bottom:1px solid #1e293b;">Service</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;font-weight:500;border-bottom:1px solid #1e293b;">${service}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Target Area</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;border-bottom:1px solid #1e293b;">${targetArea}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Leads / Month</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;border-bottom:1px solid #1e293b;">${leadsPerMonth}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Customers / Month</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;border-bottom:1px solid #1e293b;">${customersPerMonth}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Conversion Rate</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;border-bottom:1px solid #1e293b;">${conversionRate}%</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Setup Fee</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;font-weight:600;border-bottom:1px solid #1e293b;">&pound;${Number(setupFee).toLocaleString()} + VAT</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;border-bottom:1px solid #1e293b;">Monthly Fee</td>
      <td style="padding:10px 16px;color:#f8fafc;font-size:14px;font-weight:600;border-bottom:1px solid #1e293b;">&pound;${Number(monthlyFee).toLocaleString()} + VAT</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;color:#94a3b8;font-size:13px;">First Payment</td>
      <td style="padding:10px 16px;color:#22c55e;font-size:16px;font-weight:700;">&pound;${Number(firstPayment).toLocaleString()} + VAT</td>
    </tr>
  </table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 32px;background-color:#0f172a;border-radius:0 0 12px 12px;text-align:center;">
  <p style="margin:0;font-size:12px;color:#475569;">Leads Every Day &middot; <a href="https://www.leadseveryday.co.uk" style="color:#22c55e;text-decoration:none;">leadseveryday.co.uk</a></p>
  <p style="margin:4px 0 0;font-size:11px;color:#334155;">This is an automated notification from the proposal page.</p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[proposals/accept] error:", error);
    return NextResponse.json({ error: "Failed to send acceptance" }, { status: 500 });
  }
}
