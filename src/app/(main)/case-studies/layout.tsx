import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "See real results from UK tradespeople using Leads Everyday. Discover how businesses across 60+ industries have grown with our lead generation service.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Case Studies" }],
  },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
