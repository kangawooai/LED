import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the dedicated team behind Leads Everyday. Marketing specialists working every day to fill your diary with high-quality leads.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "The Leads Everyday Team" }],
  },
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
