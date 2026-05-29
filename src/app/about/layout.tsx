import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Leads Everyday — the UK's trusted lead generation company for tradespeople. No commissions, no shared leads, just real enquiries from real customers.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "About Leads Everyday" }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
