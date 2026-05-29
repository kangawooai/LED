import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, insights and advice for UK tradespeople on growing your business, getting more leads, and making the most of digital marketing.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
