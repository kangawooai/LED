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
  photoEmail: string; // JPEG copy for email clients, e.g. /team/email/rob.jpg
  role: string;
}

const PHONE = "+443330424424";
const PHONE_DISPLAY = "0333 0 424 424";
const ROLE = "Business Development Manager";

const DEFAULT_EMAIL = "robert@leadseveryday.co.uk";

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
  { match: ["jordan", "miles"], name: "Jordan Miles", photo: "/team/jordan-miles.webp" },
  { match: ["maximilian", "filipowicz"], name: "Maximilian Filipowicz", photo: "/team/maximilian-filipowicz.webp" },
];

const DEFAULT_MEMBER = TEAM[0]; // Robert O'Toole

/**
 * Tokens match at the start of a word, not anywhere in the string: "dan" must
 * not claim Jordan, and "ella" must not claim Isabella. A token is still free
 * to be a prefix ("chamber" matches Chambers, "rob" matches Robert).
 */
const matches = (hay: string, token: string) =>
  new RegExp(`\\b${token}`).test(hay);

/**
 * Outlook on Windows renders mail through Word, which has no WebP support, so
 * email gets a JPEG copy instead. It is flattened onto the card colour the photo
 * sits on, which also hides the square edges where border-radius is ignored.
 */
const emailPhoto = (photo: string) =>
  photo.replace("/team/", "/team/email/").replace(/\.webp$/, ".jpg");

/** Resolve the account manager to display / notify from the stored name + email. */
export function resolveManager(managerName?: string | null, managerEmail?: string | null): Manager {
  // Match against the name AND the email's local part (e.g. sean.chambers@… → Sean).
  // Punctuation becomes whitespace so "sean.chambers" gives two matchable words.
  const emailLocal = (managerEmail || "").split("@")[0];
  const hay = `${managerName || ""} ${emailLocal}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const found = TEAM.find((m) => m.match.some((t) => matches(hay, t))) || DEFAULT_MEMBER;
  return {
    name: found.name,
    email: (managerEmail || "").trim() || DEFAULT_EMAIL,
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    photo: found.photo,
    photoEmail: emailPhoto(found.photo),
    role: ROLE,
  };
}
