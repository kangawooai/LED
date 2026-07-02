import type { CurrencyCode } from "@/lib/types/crm";

const currencySymbols: Record<CurrencyCode, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  CAD: "CA$",
  AUD: "A$",
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "GBP"
): string {
  const symbol = currencySymbols[currency];
  return `${symbol}${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return currencySymbols[currency];
}

export function convertCurrency(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}
