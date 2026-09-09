/**
 * Builds the "your proposal is ready" email — a branded mirror of the proposal
 * page (headline, account manager, how-it-works, value props, pricing, stats).
 */

export interface ProposalEmailData {
  firstName: string;
  business: string;
  leadsNeeded: number;
  setupFee: string | number;
  monthlyFee: string | number;
  proposalUrl: string;
  conversionRate?: number;
  avgJobValue?: number;
  desiredReturn?: number;
  managerName?: string;
  managerPhotoUrl?: string;
  managerPhone?: string;
  managerPhoneDisplay?: string;
}

const gbp2 = (v: string | number) => {
  const n = Number(v);
  return isNaN(n)
    ? String(v)
    : `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const gbp0 = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

// ── Palette (all-black) ──
const BG = "#000000"; // page + section background
const CARD = "#0d0d0d"; // inner cards
const CARD_HL = "#0b2a17"; // highlighted (ongoing) card + step circles
const BORDER = "#262626";
const GREEN = "#22c55e";
const HEAD = "#f8fafc";
const MUTED = "#94a3b8";
const DIM = "#64748b";


const STEPS = [
  { n: 1, title: "Your proposal is ready", desc: "Built around your specific business requirements — ready for you to review." },
  { n: 2, title: "Review & decide", desc: "If it fits, simply approve — there's no long-term tie-in." },
  { n: 3, title: "Approve & launch", desc: "We build and launch your campaign — typically live within 48 hours." },
];

const VALUES = [
  { title: "Targeted lead generation", desc: "We find and target your ideal customers using proven, data-driven methods." },
  { title: "Exclusive, unique leads", desc: "Every enquiry is yours alone, never shared or sold to anyone else in your trade." },
  { title: "Transparent reporting", desc: "You see exactly how many leads we deliver — no guesswork, no smoke and mirrors." },
];

const PILLS = [
  "Leads within days of going live",
  "Low risk, high return",
  "Rolling monthly, cancel any time",
];

const STATS = [
  ["20,000+", "Campaigns"],
  ["1M+", "Leads"],
  ["1,200+", "Reviews"],
  ["48hrs", "Avg go-live"],
];

export function buildProposalEmail(d: ProposalEmailData): string {
  const { firstName, business, leadsNeeded, setupFee, monthlyFee, proposalUrl } = d;
  const grow = business
    ? `your tailored plan to grow <span style="color:${GREEN};">${business}</span>`
    : `your tailored plan to grow your business`;

  // Account manager (defaults to Robert O'Toole)
  const mgrName = d.managerName || "Robert O'Toole";
  const mgrRole = "Business Development Manager";
  const mgrPhoto = d.managerPhotoUrl || "https://www.leadseveryday.co.uk/team/email/rob.jpg";
  const mgrPhone = d.managerPhone || "+443330424424";
  const mgrPhoneDisplay = d.managerPhoneDisplay || "0333 0 424 424";

  // ── ROI / "how we arrived at this" (only when we have the figures) ──
  const rate = Number(d.conversionRate) || 0;
  const ajv = Number(d.avgJobValue) || 0;
  const ret = Number(d.desiredReturn) || 0;
  const hasRoi = ajv > 0 && ret > 0 && rate > 0;
  const roiJobs = hasRoi ? Math.max(1, Math.ceil(ret / ajv)) : 0;
  const roiLeads = hasRoi ? Math.max(1, Math.ceil(roiJobs / (rate / 100))) : 0;

  const roiHtml = hasRoi
    ? `
<tr><td style="padding:16px 32px 4px;background-color:${BG};">
  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${GREEN};text-align:center;">How we arrived at this</p>
  <p style="margin:0 0 14px;font-size:15px;font-weight:600;color:${HEAD};text-align:center;">The leads you need, based on your own figures</p>
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td width="33%" valign="top" class="stack-col" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr><td style="padding:14px 8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;color:${MUTED};line-height:1.4;">Your conversion rate</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${GREEN};">${rate}%</p>
        <p style="margin:0;font-size:10px;color:${DIM};">leads you win as jobs</p>
      </td></tr></table>
    </td>
    <td width="33%" valign="top" class="stack-col" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr><td style="padding:14px 8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;color:${MUTED};line-height:1.4;">Your average job value</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${GREEN};">${gbp0(ajv)}</p>
        <p style="margin:0;font-size:10px;color:${DIM};">from a typical job</p>
      </td></tr></table>
    </td>
    <td width="33%" valign="top" class="stack-col" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr><td style="padding:14px 8px;text-align:center;">
        <p style="margin:0 0 4px;font-size:10px;color:${MUTED};line-height:1.4;">Your target return</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${GREEN};">${gbp0(ret)}</p>
        <p style="margin:0;font-size:10px;color:${DIM};">per month</p>
      </td></tr></table>
    </td>
  </tr></table>
  <p style="margin:14px 0 0;font-size:18px;font-weight:700;color:${HEAD};text-align:center;"><span style="color:${GREEN};">${roiLeads}</span> leads = <span style="color:${GREEN};">${roiJobs}</span> jobs = <span style="color:${GREEN};">${gbp0(ret)}</span> return</p>
  <p style="margin:6px 0 0;font-size:12px;color:${DIM};text-align:center;">That's the package we've built for you.</p>
</td></tr>`
    : "";

  const stepsHtml = STEPS.map(
    (s) => `
    <tr>
      <td width="40" valign="top" style="padding:0 0 16px;">
        <table cellpadding="0" cellspacing="0"><tr><td width="30" height="30" align="center" valign="middle" style="background-color:${CARD_HL};border:1px solid ${GREEN};border-radius:50%;color:${GREEN};font-size:13px;font-weight:700;">${s.n}</td></tr></table>
      </td>
      <td valign="top" style="padding:0 0 16px 4px;">
        <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:${HEAD};">${s.title}</p>
        <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.5;">${s.desc}</p>
      </td>
    </tr>`
  ).join("");

  const valuesHtml = VALUES.map(
    (v) => `
    <tr><td style="padding:0 0 10px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr>
        <td width="30" valign="top" style="padding:14px 0 14px 14px;color:${GREEN};font-size:16px;font-weight:700;">&#10003;</td>
        <td valign="top" style="padding:14px 14px 14px 4px;">
          <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:${HEAD};">${v.title}</p>
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.5;">${v.desc}</p>
        </td>
      </tr></table>
    </td></tr>`
  ).join("");

  const pillsHtml = PILLS.map(
    (p) =>
      `<span style="display:inline-block;background-color:${CARD_HL};border:1px solid ${GREEN};border-radius:16px;padding:6px 14px;margin:0 4px 8px 0;font-size:12px;font-weight:600;color:${GREEN};">&#10003; ${p}</span>`
  ).join("");

  const statsHtml = STATS.map(
    ([v, l]) =>
      `<td class="stat-col" style="padding-top:16px;text-align:center;"><p style="margin:0;font-size:18px;font-weight:700;color:${HEAD};">${v}</p><p style="margin:2px 0 0;font-size:10px;color:${DIM};">${l}</p></td>`
  ).join("");

  // Trustpilot "Excellent" rating (green star boxes + wordmark) — built in HTML, no external asset
  const TP_GREEN = "#00b67a";
  const starCell = `<td width="17" height="17" align="center" valign="middle" style="background-color:${TP_GREEN};border-radius:2px;color:#ffffff;font-size:11px;line-height:17px;">&#9733;</td>`;
  const stars = Array(5).fill(starCell).join(`<td width="3"></td>`);
  // No inline text-align: elements inherit the header cell's alignment
  // (right on desktop via align="right", left on mobile via the .hdr-tp media rule).
  const trustpilotHtml = `
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${HEAD};">Rated Excellent</p>
    <table cellpadding="0" cellspacing="0" style="display:inline-block;"><tr>${stars}</tr></table>
    <p style="margin:5px 0 0;font-size:10px;font-weight:700;color:${HEAD};"><span style="color:${TP_GREEN};padding-right:5px;">&#9733;</span>Trustpilot&nbsp;</p>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  @media only screen and (max-width:480px){
    .stack-col{display:block !important;width:100% !important;box-sizing:border-box !important;padding:4px 0 !important;}
    .hdr-tp{display:block !important;width:100% !important;text-align:left !important;padding-top:12px !important;}
    .stat-col{display:inline-block !important;width:50% !important;box-sizing:border-box !important;padding-top:16px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<!-- Preheader: inbox preview text (hidden in the email body) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;height:0;width:0;font-size:1px;line-height:1px;">
  ${firstName}, your tailored lead generation proposal is ready — tap to view it.
</div>
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BG};border:1px solid ${BORDER};border-radius:12px;">

<!-- Header -->
<tr><td style="padding:24px 32px;background-color:${BG};border-radius:12px 12px 0 0;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td valign="middle" class="stack-col"><img src="https://www.leadseveryday.co.uk/led_logo_white_green.png" alt="Leads Every Day" width="160" height="19" style="display:block;border:0;" /></td>
    <td valign="middle" align="right" class="hdr-tp">${trustpilotHtml}</td>
  </tr></table>
</td></tr>

<!-- Title -->
<tr><td style="padding:12px 32px 4px;background-color:${BG};">
  <h1 style="margin:0 0 10px;font-size:26px;line-height:1.2;font-weight:700;color:${HEAD};">${firstName}, ${grow}.</h1>
  <p style="margin:0;font-size:15px;color:${MUTED};line-height:1.55;">Our aim is simple: more leads, more customers and more profit. This is a snapshot of your tailored package &mdash; tap through any time for the full proposal.</p>
</td></tr>

<!-- Account manager -->
<tr><td style="padding:20px 32px 4px;background-color:${BG};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr>
    <td width="88" valign="top" style="padding:16px 0 16px 16px;">
      <img src="${mgrPhoto}" alt="${mgrName}" width="72" height="72" style="display:block;width:72px;height:72px;border-radius:50%;border:2px solid ${GREEN};object-fit:cover;" />
    </td>
    <td valign="top" style="padding:16px;">
      <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GREEN};">Your point of contact</p>
      <p style="margin:0;font-size:15px;font-weight:700;color:${HEAD};">${mgrName}</p>
      <p style="margin:0 0 8px;font-size:12px;color:${MUTED};">${mgrRole}</p>
      <p style="margin:0 0 8px;font-size:13px;color:${MUTED};line-height:1.5;">&ldquo;I've prepared this proposal personally for you, ${firstName}. Any questions at all, call me directly &mdash; I'm here to help.&rdquo;</p>
      <a href="tel:${mgrPhone}" style="font-size:13px;font-weight:600;color:${GREEN};text-decoration:none;"><img src="https://www.leadseveryday.co.uk/phone.png" width="13" height="13" alt="Call" style="vertical-align:middle;margin-right:6px;border:0;" />${mgrPhoneDisplay}</a>
    </td>
  </tr></table>
</td></tr>

<!-- How it works -->
<tr><td style="padding:20px 32px 4px;background-color:${BG};">
  <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${GREEN};">How it works</p>
  <table width="100%" cellpadding="0" cellspacing="0">${stepsHtml}</table>
</td></tr>

${roiHtml}

<!-- Pricing cards -->
<tr><td style="padding:12px 32px 8px;background-color:${BG};">
  <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${GREEN};">Your tailored package</p>
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td width="33%" valign="top" class="stack-col" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr><td valign="middle" style="padding:16px 10px;text-align:center;height:104px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GREEN};">Leads / month</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${HEAD};">${leadsNeeded}</p>
        <p style="margin:0;font-size:11px;color:${DIM};">exclusive leads</p>
      </td></tr></table>
    </td>
    <td width="33%" valign="top" class="stack-col" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD};border:1px solid ${BORDER};border-radius:10px;"><tr><td valign="middle" style="padding:16px 10px;text-align:center;height:104px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GREEN};">One-off setup</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${HEAD};">${gbp2(setupFee)}</p>
        <p style="margin:0;font-size:11px;color:${DIM};">inc VAT &middot; once</p>
      </td></tr></table>
    </td>
    <td width="33%" valign="top" class="stack-col" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${CARD_HL};border:2px solid ${GREEN};border-radius:10px;"><tr><td valign="middle" style="padding:16px 10px;text-align:center;height:104px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${GREEN};">Ongoing</p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:${HEAD};">${gbp2(monthlyFee)}</p>
        <p style="margin:0;font-size:11px;color:${DIM};">inc VAT &middot; / month</p>
      </td></tr></table>
    </td>
  </tr></table>
</td></tr>

<!-- Why us -->
<tr><td style="padding:16px 32px 4px;background-color:${BG};">
  <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${GREEN};">Why Leads Every Day</p>
  <table width="100%" cellpadding="0" cellspacing="0">${valuesHtml}</table>
</td></tr>

<!-- No contract pills -->
<tr><td style="padding:8px 32px 4px;background-color:${BG};text-align:center;">
  ${pillsHtml}
</td></tr>

<!-- CTA -->
<tr><td style="padding:16px 32px 4px;background-color:${BG};text-align:center;">
  <table cellpadding="0" cellspacing="0" align="center"><tr>
    <td style="background-color:${GREEN};border-radius:8px;"><a href="${proposalUrl}" style="display:inline-block;padding:14px 34px;color:#000000;font-size:16px;font-weight:700;text-decoration:none;">View Your Proposal</a></td>
  </tr></table>
  <p style="margin:16px 0 0;font-size:12px;color:${DIM};word-break:break-all;">Or paste this link into your browser:<br><a href="${proposalUrl}" style="color:${GREEN};">${proposalUrl}</a></p>
</td></tr>

<!-- Social proof -->
<tr><td style="padding:18px 32px 24px;background-color:${BG};">
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BORDER};"><tr>${statsHtml}</tr></table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 32px;background-color:${BG};border-radius:0 0 12px 12px;border-top:1px solid ${BORDER};text-align:center;">
  <p style="margin:0 0 4px;font-size:12px;color:${DIM};">Leads Every Day &middot; <a href="https://www.leadseveryday.co.uk" style="color:${GREEN};text-decoration:none;">leadseveryday.co.uk</a></p>
  <p style="margin:0;font-size:11px;color:#475569;">Prices include VAT. No long-term contract — after your first month you're free to give 30 days' notice at any time.</p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}
