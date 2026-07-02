import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Google Calendar integration not yet configured" }, { status: 503 });
}
