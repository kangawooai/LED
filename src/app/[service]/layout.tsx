import { Metadata } from "next";
import { services } from "@/data/services";

interface Props {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.metaTitle || `${service.name} Lead Generation`,
    description: service.metaDescription || service.description,
  };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
