import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Leads Everyday's cookie policy. Learn about the cookies we use and how to manage your preferences.",
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
