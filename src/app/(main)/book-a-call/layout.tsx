import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Call",
  description: "Book a free consultation with Leads Everyday. Tell us about your trade and we'll show you exactly how many leads we can deliver, no obligations, no hard sell.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Book a Free Call with Leads Everyday" }],
  },
};

export default function BookACallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
