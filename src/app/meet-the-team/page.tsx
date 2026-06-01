import type { Metadata } from "next";
import Staff from "./_client";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Get to know the people behind your leads. Our dedicated team of marketing specialists works to fill your diary every single day.",
};

export default function StaffPage() {
  return <Staff />;
}
