import type { Metadata } from "next";
import CleaningHome from "./_client";

export const metadata: Metadata = {
  title: "Cleaning Lead Generation",
  description:
    "Get more customers for your cleaning business. We generate leads for carpet cleaning, window cleaning, oven cleaning, exterior cleaning, and more across the UK.",
};

export default function CleaningPage() {
  return <CleaningHome />;
}
