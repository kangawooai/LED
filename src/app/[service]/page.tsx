import type { Metadata } from "next";
import { services } from "@/data/services";
import { staff } from "@/data/staff";
import ServicePage from "./_client";
import StaffMemberPage from "./_staff-member";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service: slug } = await params;

  const service = services.find((s) => s.slug === slug);
  if (service) {
    return {
      title: `${service.name} Lead Generation`,
      description: service.metaDescription || service.description,
      openGraph: {
        title: `${service.name} Lead Generation | Leads Everyday`,
        description: service.metaDescription || service.description,
        images: [`/${slug}.webp`],
      },
    };
  }

  const member = staff.find((s) => s.slug === slug);
  if (member) {
    return {
      title: member.name,
      description: member.bio.split("\n\n")[0],
      openGraph: {
        images: [{ url: "/hero.webp", width: 1200, height: 630, alt: `${member.name} — Leads Everyday` }],
      },
    };
  }

  return {};
}

export default async function Page({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;

  if (services.find((s) => s.slug === slug)) {
    return <ServicePage />;
  }

  if (staff.find((s) => s.slug === slug)) {
    return <StaffMemberPage />;
  }

  notFound();
}
