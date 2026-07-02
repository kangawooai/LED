import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Leads Everyday's privacy policy. Learn how we collect, use, and protect your personal data.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Privacy Policy" }],
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
