import Script from 'next/script'

/**
 * Bonza visitor analytics. Cookieless: it stores nothing on the visitor's
 * device, so it runs whether or not they accept the cookie banner. The script
 * itself is served (and updated) by bonza.build.
 */
const SITE_ID = process.env.BONZA_WEBSITE_ID || 'b9dc8897-f116-4036-9a59-4a727231479e'

export function BonzaAnalytics() {
  return <Script src="https://bonza.build/api/bz/s" data-bz-site={SITE_ID} strategy="afterInteractive" />
}
