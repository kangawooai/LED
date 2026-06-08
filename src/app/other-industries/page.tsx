import type { Metadata } from "next";
import OtherIndustriesHome from "./_client";

export const metadata: Metadata = {
  title: "Other Industries Lead Generation",
  description:
    "Lead generation for every industry. From beauty and legal to logistics and pest control, we build bespoke campaigns to deliver customers to your business.",
};

export default function OtherIndustriesPage() {
  return <OtherIndustriesHome />;
}
