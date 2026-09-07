import type { Metadata } from "next";
import Resources from "./_client";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Case studies and insights from Leads Everyday. Real results from UK businesses we've helped grow, plus practical advice on getting more from your leads.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Resources" }],
  },
};

export default function ResourcesPage() {
  return <Resources />;
}
