"use client";

import { useCookieConsent } from "@/contexts/cookie-consent";
import Script from "next/script";

const ConditionalScripts = () => {
  const { preferences, hasConsented } = useCookieConsent();

  if (!hasConsented) return null;

  return (
    <>
      {/* Marketing scripts — loaded only with marketing consent */}
      {preferences.marketing && (
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
      )}

      {/* Analytics scripts — loaded only with analytics consent */}
      {/* Add Google Analytics / GTM here when ready:
      {preferences.analytics && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_ID');
            `}
          </Script>
        </>
      )}
      */}
    </>
  );
};

export default ConditionalScripts;
