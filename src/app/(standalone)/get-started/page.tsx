import type { Metadata } from "next";
import GetStartedClient from "./_client";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Get a personalised lead generation proposal for your business. Tell us about your trade and see your pricing instantly.",
  openGraph: {
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "Get Started with Leads Everyday",
      },
    ],
  },
};

export default function GetStartedPage() {
  return <GetStartedClient />;
}
