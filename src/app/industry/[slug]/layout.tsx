import { Metadata } from "next";
import { getIndustryBySlug } from "@/data/industries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};
  return {
    title: `${industry.name} Lead Generation`,
    description: `Get exclusive leads for ${industry.name.toLowerCase()} businesses. Leads Everyday generates high-quality enquiries for UK tradespeople — no commissions, no shared leads.`,
    openGraph: {
      images: [{ url: "/hero.webp", width: 1200, height: 630, alt: `${industry.name} Lead Generation — Leads Everyday` }],
    },
  };
}

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
