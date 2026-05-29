import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Call",
  description: "Book a free consultation with Leads Everyday. Tell us about your trade and we'll show you exactly how many leads we can deliver — no obligations, no hard sell.",
};

export default function BookACallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
