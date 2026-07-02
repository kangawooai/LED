import type { Metadata } from "next";
import { industries } from "@/data/industries";
import IndustryPage from "./_client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} Lead Generation`,
    description: industry.description,
  };
}

export default function Page() {
  return <IndustryPage />;
}
