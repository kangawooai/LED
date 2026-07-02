import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Google Calendar not connected" }, { status: 404 });
}

export async function PUT() {
  return NextResponse.json({ error: "Google Calendar integration not yet configured" }, { status: 503 });
}
