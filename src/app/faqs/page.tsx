import type { Metadata } from "next";
import Faqs from "./_client";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about Leads Everyday. Learn how our lead generation service works, pricing, and what to expect.",
};

export default function FaqsPage() {
  return <Faqs />;
}
