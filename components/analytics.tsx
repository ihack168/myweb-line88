"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";

export function Analytics() {
  const pathname = usePathname();

  if (pathname === "/clip") return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-2X29DPN458"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2X29DPN458', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="febf1b62-e4ea-449e-af9b-dd91619e1116"
        strategy="afterInteractive"
      />

      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token":"9fec8e6d90b447db9c6726ce57ddbbad"}'
        strategy="afterInteractive"
      />
    </>
  );
}