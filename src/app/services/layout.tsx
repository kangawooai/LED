import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore lead generation services for over 60 UK trades and industries. From construction to motor trade, cleaning to security — find your trade and start getting leads.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Services" }],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
