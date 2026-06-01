import type { Metadata } from "next";
import CaseStudies from "./_client";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "See real results from Leads Everyday clients. Browse case studies showing how we've helped tradespeople across the UK generate more leads and grow their businesses.",
};

export default function CaseStudiesPage() {
  return <CaseStudies />;
}
