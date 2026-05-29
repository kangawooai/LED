import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Leads Everyday's privacy policy. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
