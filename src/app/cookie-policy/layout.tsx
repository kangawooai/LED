import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Leads Everyday's cookie policy. Learn about the cookies we use and how to manage your preferences.",
  openGraph: {
    images: [{ url: "/hero.webp", width: 1200, height: 630, alt: "Leads Everyday Cookie Policy" }],
  },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
