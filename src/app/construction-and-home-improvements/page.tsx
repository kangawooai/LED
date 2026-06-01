import type { Metadata } from "next";
import ConstructionHome from "./_client";

export const metadata: Metadata = {
  title: "Construction & Home Improvement Lead Generation",
  description:
    "Get more customers for your construction or home improvement business. We generate leads for plastering, roofing, extensions, kitchens, driveways, and more.",
};

export default function ConstructionAndHomeImprovementsPage() {
  return <ConstructionHome />;
}
