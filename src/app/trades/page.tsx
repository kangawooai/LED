import type { Metadata } from "next";
import TradesHome from "./_client";

export const metadata: Metadata = {
  title: "Trades Lead Generation",
  description:
    "Get more customers for your trade business. We generate leads for electricians, plumbers, locksmiths, CCTV installers, solar panel fitters, and more.",
};

export default function TradesPage() {
  return <TradesHome />;
}
