import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Leads Everyday's lead generation services and website.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Terms & Conditions" }],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
