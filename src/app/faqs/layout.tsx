import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about Leads Everyday's lead generation service for UK tradespeople. Learn about pricing, lead quality, contracts, and how it all works.",
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
