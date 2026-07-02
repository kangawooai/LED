import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal — Tomorrow Energy Ltd",
  description: "Private lead generation proposal for Tomorrow Energy Ltd.",
  robots: { index: false, follow: false },
};

export default function TomorrowEnergyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
