import { BubbleBackground } from "@/components/ui/bubble";
import LenisWrapper from "@/components/common/lenis-wrapper";
import Footer from "@/sections/footer";
import Navigation from "@/sections/navigation";
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.leadseveryday.co.uk"),
  title: {
    default: "Leads Everyday | Lead Generation for UK Trades & Services",
    template: "%s | Leads Everyday",
  },
  description:
    "Get more leads for your business, every single day. We build landing pages and run targeted ads for tradespeople across 60+ industries. No commission, just results.",
  keywords: [
    "lead generation",
    "UK trades",
    "Google Ads",
    "tradespeople",
    "leads",
    "marketing",
  ],
  openGraph: {
    title: "Leads Everyday | Lead Generation for UK Trades & Services",
    description:
      "Get more leads for your business, every single day. 15,000+ successful campaigns across 60+ industries.",
    url: "https://www.leadseveryday.co.uk",
    siteName: "Leads Everyday",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "Leads Everyday — Lead Generation for UK Trades & Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leads Everyday | Lead Generation for UK Trades & Services",
    description:
      "Get more leads for your business, every single day. 15,000+ successful campaigns across 60+ industries.",
    images: ["/hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.isNativeApp = typeof window !== 'undefined' && window.Capacitor !== undefined;
              if (window.isNativeApp) {
                document.documentElement.classList.add('native-app');
              }
            `,
          }}
        />
        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        />
      </head>
      <body
        className={`${montserrat.variable} antialiased select-none font-sans`}
      >
        <BubbleBackground className="fixed inset-0 opacity-30 pointer-events-none" />
        <LenisWrapper>
          <Navigation />
          <main className="relative min-h-screen overflow-x-clip">
            {children}
          </main>
          <Footer />
        </LenisWrapper>
      </body>
    </html>
  );
}
