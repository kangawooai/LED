"use client";

import { useCookieConsent } from "@/contexts/cookie-consent";
import Script from "next/script";

const ConditionalScripts = () => {
  const { preferences, hasConsented } = useCookieConsent();

  return (
    <>
      {/* Trustpilot widget — always loads (functional, not tracking) */}
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
      />

      {/* Consent-gated scripts only load after user has made a choice */}
      {hasConsented && (
        <>
          {/* Analytics scripts — loaded only with analytics consent */}
          {preferences.analytics && (
            <>
              {/* Google Tag Manager */}
              <Script
                id="gtm"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5B9H34W6');
                  `,
                }}
              />

              {/* Google Analytics (gtag.js) */}
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-0VM2SWJTW7"
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-0VM2SWJTW7');
                `}
              </Script>

              {/* ClickCease click fraud protection */}
              <Script
                src="//d32hwlnfiv2gyn.cloudfront.net/sp-2.0.0-dm-0.1.min.js"
                strategy="afterInteractive"
              />
            </>
          )}

          {/* Marketing scripts — loaded only with marketing consent */}
          {preferences.marketing && (
            <>
              {/* Facebook Pixel */}
              <Script id="fb-pixel" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '822874926383359');
                  fbq('track', 'PageView');
                `}
              </Script>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ConditionalScripts;
