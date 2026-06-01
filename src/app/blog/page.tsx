import type { Metadata } from "next";
import Blog from "./_client";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, insights, and advice for tradespeople looking to grow their business. Read the latest from the Leads Everyday blog.",
};

export default function BlogPage() {
  return <Blog />;
}
