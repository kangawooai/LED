import type { Metadata } from "next";
import GrowthReviewClient from "./_client";

export const metadata: Metadata = {
  title: "Customer Growth Review",
  description:
    "Tell us how far your business has come with Leads Every Day. Your growth story helps other trades decide to grow too — it takes about 3–4 minutes.",
  openGraph: {
    title: "Customer Growth Review — Leads Every Day",
    description:
      "Let's celebrate how far your business has come. Share your growth story in 3–4 minutes.",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "Customer Growth Review — Leads Every Day",
      },
    ],
  },
};

export default function GrowthReviewPage() {
  return <GrowthReviewClient />;
}
