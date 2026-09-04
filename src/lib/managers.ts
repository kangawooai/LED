/**
 * Account manager registry. The proposal webhook passes manager_name + manager_email
 * (from Salesforce); we resolve the matching team member for the photo + canonical
 * name, and fall back to Robert O'Toole when we can't match.
 */

export interface Manager {
  name: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  photo: string; // site-relative path, e.g. /team/rob.webp
  role: string;
}

const PHONE = "+443330424424";
const PHONE_DISPLAY = "0333 0 424 424";
const ROLE = "Business Development Manager";

const DEFAULT_EMAIL = "robert@leadseveryday.co.uk";

// Match tokens are substring-matched against the name + email local part, so keep
// them distinctive: "max" would also hit "Maximilian", "dan" would hit "Jordan".
const TEAM: { match: string[]; name: string; photo: string }[] = [
  { match: ["robert", "rob", "toole"], name: "Robert O'Toole", photo: "/team/rob.webp" },
  { match: ["dan", "feltham"], name: "Dan Feltham", photo: "/team/dan.webp" },
  { match: ["sean", "chamber"], name: "Sean Chambers", photo: "/team/sean.webp" },
  { match: ["kam", "kameron", "bowen"], name: "Kameron James Bowen", photo: "/team/kam.webp" },
  { match: ["ella", "croft"], name: "Ella Croft", photo: "/team/ella-croft.webp" },
  { match: ["tallulah", "stanley"], name: "Tallulah Stanley", photo: "/team/tallulah-stanley.webp" },
  { match: ["sabrina", "akram"], name: "Sabrina Akram", photo: "/team/sabrina-akram.webp" },
  { match: ["luke", "usher"], name: "Luke Usher", photo: "/team/luke-usher.webp" },
  { match: ["nathan", "hydes"], name: "Nathan Hydes", photo: "/team/nathan-hydes.webp" },
  { match: ["maximilian", "filipowicz"], name: "Maximilian Filipowicz", photo: "/team/maximilian-filipowicz.webp" },
];

const DEFAULT_MEMBER = TEAM[0]; // Robert O'Toole

/** Resolve the account manager to display / notify from the stored name + email. */
export function resolveManager(managerName?: string | null, managerEmail?: string | null): Manager {
  // Match against the name AND the email's local part (e.g. sean.chambers@… → Sean)
  const emailLocal = (managerEmail || "").split("@")[0];
  const hay = `${managerName || ""} ${emailLocal}`.toLowerCase();
  const found = TEAM.find((m) => m.match.some((t) => hay.includes(t))) || DEFAULT_MEMBER;
  return {
    name: found.name,
    email: (managerEmail || "").trim() || DEFAULT_EMAIL,
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    photo: found.photo,
    role: ROLE,
  };
}
