import type { Metadata } from "next";
import { caseStudies } from "@/data/case-studies";
import CaseStudyPage from "./_client";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: `${study.business} Case Study`,
    description: study.summary,
    openGraph: {
      title: `${study.business}: ${study.headline}`,
      description: study.summary,
      images: [{ url: "/hero.webp", width: 1200, height: 630, alt: study.business }],
    },
  };
}

export default function Page() {
  return <CaseStudyPage />;
}
