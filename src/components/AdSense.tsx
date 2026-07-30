"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Loads the AdSense library once, for the whole app.
 *
 * `afterInteractive` means it loads after the page is usable, so ads never
 * delay the lesson content. Rendering nothing when ads are disabled keeps the
 * script out of development entirely.
 */
export function AdSenseScript() {
  if (!adsEnabled) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}

/**
 * A single ad unit.
 *
 * The reserved min-height matters: without it the page reflows when the ad
 * arrives, which is a poor reading experience and hurts Core Web Vitals.
 */
export function AdUnit({
  slot,
  format = "auto",
  className = "",
  label = "Advertisement",
}: {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  className?: string;
  label?: string;
}) {
  const pathname = usePathname();
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsEnabled || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      // AdSense errors if the same <ins> is filled twice.
      pushed.current = true;
    } catch {
      // A blocked or failed request must never break the page.
    }
  }, [slot, pathname]);

  if (!adsEnabled || !slot) return null;

  return (
    <aside
      className={`my-8 ${className}`}
      // Remounting per route gives each page a fresh, unfilled <ins>.
      key={`${pathname}-${slot}`}
      aria-label={label}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight: 100 }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
