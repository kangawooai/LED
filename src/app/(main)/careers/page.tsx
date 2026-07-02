import type { Metadata } from "next";
import WhyWorkHere from "./_client";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Leads Everyday team. We're always looking for talented people who are passionate about digital marketing and helping businesses grow.",
};

export default function CareersPage() {
  return <WhyWorkHere />;
}
