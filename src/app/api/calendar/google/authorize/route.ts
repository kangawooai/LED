import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement Google OAuth redirect
  return NextResponse.json({ error: "Google Calendar integration not yet configured" }, { status: 503 });
}
