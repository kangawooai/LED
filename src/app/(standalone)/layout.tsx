import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
      />
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="relative h-7.5 w-[150px]">
            <Image
              src="/led_logo_white_green.webp"
              alt="Leads Everyday"
              width={150}
              height={38}
              className="absolute inset-0 h-full w-auto object-contain opacity-0 dark:opacity-100 transition-opacity duration-600"
              priority
            />
            <Image
              src="/led_logo_black_green.webp"
              alt="Leads Everyday"
              width={150}
              height={38}
              className="absolute inset-0 h-full w-auto object-contain opacity-100 dark:opacity-0 transition-opacity duration-600"
              priority
            />
          </Link>
          <div className="hidden sm:block w-[200px]">
            <div
              className="trustpilot-widget"
              data-locale="en-US"
              data-template-id="5419b6ffb0d04a076446a9af"
              data-businessunit-id="606ea5a74e740b0001398b05"
              data-style-height="20px"
              data-style-width="100%"
              data-theme="dark"
              data-token="819bcc44-f0e9-4ab1-bd4d-5c4fa58bce15"
            >
              <a href="https://www.trustpilot.com/review/leadseveryday.co.uk" target="_blank" rel="noopener">Trustpilot</a>
            </div>
          </div>
        </div>
      </header>
      <main className="relative min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
