import type { Metadata } from "next";
import BlackFriday from "./_client";

export const metadata: Metadata = {
  title: "Black Friday Offer – 6 Free Extras",
  description:
    "Our Black Friday offer for tradespeople: a free website, free ad setup, free tracking number, free domain, a dedicated account manager and no setup fee. Just one monthly fee.",
  alternates: { canonical: "/black-friday" },
  openGraph: {
    title: "Black Friday Offer – 6 Free Extras | Leads Everyday",
    description:
      "Leads for your business plus 6 free extras. Just one monthly fee.",
    images: [
      {
        url: "/black-friday-offer.webp",
        width: 2000,
        height: 2000,
        alt: "Leads Everyday Black Friday offer: 6 free extras",
      },
    ],
  },
};

export default function BlackFridayPage() {
  return <BlackFriday />;
}
