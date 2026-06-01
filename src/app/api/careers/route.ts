import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENTS = [
  "max.young@yayhey.com",
  "robert@leadseveryday.co.uk",
  "connor@leadseveryday.co.uk",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const cv = formData.get("cv") as File | null;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const attachments: nodemailer.SendMailOptions["attachments"] = [];

    if (cv && cv.size > 0) {
      const buffer = Buffer.from(await cv.arrayBuffer());
      attachments.push({
        filename: cv.name,
        content: buffer,
        contentType: cv.type,
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: RECIPIENTS.join(", "),
      replyTo: email,
      subject: `New CV Application: ${name}`,
      html: `
        <h2>New Career Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${cv && cv.size > 0 ? `<p><strong>CV:</strong> ${cv.name} (attached)</p>` : "<p><em>No CV attached</em></p>"}
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Careers form error:", error);
    return NextResponse.json(
      { error: "Failed to send application." },
      { status: 500 }
    );
  }
}
