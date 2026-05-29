import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Leads Everyday's lead generation services and website.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
