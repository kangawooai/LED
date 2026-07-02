import type { Metadata } from "next";
import BookACall from "./_client";

export const metadata: Metadata = {
  title: "Book a Call",
  description:
    "Book a free consultation with Leads Everyday. We'll show you exactly how many leads we can deliver for your trade or service business.",
};

export default function BookACallPage() {
  return <BookACall />;
}
