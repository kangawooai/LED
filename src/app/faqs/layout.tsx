import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about Leads Everyday's lead generation service for UK tradespeople. Learn about pricing, lead quality, contracts, and how it all works.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday FAQs" }],
  },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
