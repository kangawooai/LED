import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Leads Everyday — the UK's trusted lead generation company for tradespeople. No commissions, no shared leads, just real enquiries from real customers.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
