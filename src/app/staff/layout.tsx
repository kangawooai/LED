import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the dedicated team behind Leads Everyday. Marketing specialists working every day to fill your diary with high-quality leads.",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
