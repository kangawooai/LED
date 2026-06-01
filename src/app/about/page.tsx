import type { Metadata } from "next";
import About from "./_client";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the team behind Leads Everyday. We're a dedicated group of marketing specialists helping tradespeople across the UK grow their businesses with high-quality leads.",
};

export default function AboutPage() {
  return <About />;
}
