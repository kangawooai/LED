import { NextResponse } from "next/server";

export async function GET() {
  // Static rates from GBP — replace with live API in production
  const rates = {
    GBP: 1,
    USD: 1.27,
    EUR: 1.17,
    CAD: 1.72,
    AUD: 1.93,
  };

  return NextResponse.json(rates);
}
