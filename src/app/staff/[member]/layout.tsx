import { Metadata } from "next";
import { staff } from "@/data/staff";

interface Props {
  params: Promise<{ member: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { member: slug } = await params;
  const member = staff.find((m) => m.slug === slug);
  if (!member) return {};
  return {
    title: `${member.name} — ${member.role}`,
    description: member.bio,
  };
}

export default function StaffMemberLayout({ children }: { children: React.ReactNode }) {
  return children;
}
