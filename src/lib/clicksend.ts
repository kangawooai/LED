/**
 * ClickSend SMS — sends a single SMS via the ClickSend REST API.
 * Uses the shared Leads Everyday ClickSend account (CLICKSEND_USERNAME / CLICKSEND_API_KEY).
 */

const CLICKSEND_API = "https://rest.clicksend.com/v3/sms/send";

// Alphanumeric sender ID (max 11 chars, no spaces). Replies can't route back to
// an alphanumeric sender — fine for one-way proposal links.
const DEFAULT_FROM = "LED";

/** Normalise a UK-ish phone number to E.164 (+44…). */
export function toE164(raw: string): string {
  const p = String(raw).replace(/[^\d+]/g, "");
  if (!p) return "";
  if (p.startsWith("+")) return p;
  if (p.startsWith("00")) return "+" + p.slice(2);
  if (p.startsWith("0")) return "+44" + p.slice(1);
  if (p.startsWith("44")) return "+" + p;
  return "+" + p;
}

export interface SmsResult {
  success: boolean;
  error?: string;
}

/** Send one SMS. Returns { success } — never throws. */
export async function sendSms(
  to: string,
  body: string,
  from: string = DEFAULT_FROM
): Promise<SmsResult> {
  const username = process.env.CLICKSEND_USERNAME;
  const apiKey = process.env.CLICKSEND_API_KEY;
  if (!username || !apiKey) {
    return { success: false, error: "ClickSend credentials not set" };
  }
  const number = toE164(to);
  if (!number) return { success: false, error: "No phone number" };

  const auth = "Basic " + Buffer.from(`${username}:${apiKey}`).toString("base64");

  try {
    const res = await fetch(CLICKSEND_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({ messages: [{ to: number, body, from }] }),
    });
    const text = await res.text();
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    const json = JSON.parse(text);
    const msg = json?.data?.messages?.[0];
    if (msg && msg.status === "SUCCESS") return { success: true };
    return { success: false, error: msg?.status ?? "Unknown ClickSend error" };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
