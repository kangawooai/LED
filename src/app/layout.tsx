import BottomBar from "@/components/bottom-bar";
import { BubbleBackground } from "@/components/ui/bubble";
import LenisWrapper from "@/components/common/lenis-wrapper";
import ConditionalScripts from "@/components/common/conditional-scripts";
import CookieBanner from "@/components/cookie-banner";
import { CookieConsentProvider } from "@/contexts/cookie-consent";
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
        alt: "Leads Everyday, Lead Generation for UK Trades & Services",
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
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/_next/image?url=%2Fhero-video.webp&w=640&q=35"
          fetchPriority="high"
        />
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
        {/* Google Consent Mode v2 — must run before any Google tags */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} antialiased select-none font-sans`}
      >
        <CookieConsentProvider>
          <BubbleBackground className="fixed inset-0 z-[1] opacity-20 md:opacity-25 pointer-events-none" />
          <LenisWrapper>
            <Navigation />
            <main className="relative min-h-screen overflow-x-clip">
              {children}
            </main>
            <Footer />
          </LenisWrapper>
          <ConditionalScripts />
          <BottomBar />
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
