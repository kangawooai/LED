import type { Metadata } from "next";
import Services from "./_client";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore lead generation services for 60+ trade and service industries. From construction to cleaning, motor trade to beauty — we deliver leads that grow your business.",
};

export default function ServicesPage() {
  return <Services />;
}
