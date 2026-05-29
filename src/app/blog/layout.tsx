import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, insights and advice for UK tradespeople on growing your business, getting more leads, and making the most of digital marketing.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Blog" }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
