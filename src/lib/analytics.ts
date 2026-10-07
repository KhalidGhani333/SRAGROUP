import { useEffect } from "react";
import { routeMap } from "@/i18n/routes";

/**
 * Google Tag Manager + GA4 with Consent Mode v2. Set VITE_GTM_ID (e.g. GTM-XXXXXXX) in
 * .env.production; without it nothing is loaded. Tags in GTM only fire once the visitor grants
 * the matching consent category in the cookie banner (see src/lib/consent.tsx).
 */
export const GTM_ID = String(import.meta.env["VITE_GTM_ID"] ?? "").trim();

/** Google Search Console HTML-tag verification code (content of google-site-verification). */
export const GSC_VERIFICATION = String(import.meta.env["VITE_GSC_VERIFICATION"] ?? "").trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Head script for the root route. One inline script guarantees the order: consent defaults are
 * set before it injects the GTM loader (Google's standard snippet).
 */
export function gtmHeadScripts() {
  if (!/^GTM-[A-Z0-9]+$/.test(GTM_ID)) return [];
  const bootstrap = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
    "gtag('set','ads_data_redaction',true);",
    "dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});",
    "var s=document.createElement('script');s.async=true;",
    `s.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';`,
    "document.head.appendChild(s);",
  ].join("");
  return [{ children: bootstrap }];
}

/** gtag() as Google defines it: Consent Mode only reads Arguments objects from the dataLayer. */
export function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params -- gtag must push the Arguments object itself.
  window.dataLayer.push(arguments);
}

/** Pushes a custom event for GTM triggers (e.g. generate_lead → GA4 conversion). */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

const contactPaths = new Set<string>([routeMap.contact.it, routeMap.contact.en]);
/** Router path of a URL path, without the sub-folder base (e.g. "/sra-group"). */
const routePath = (pathname: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base && pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
};

/**
 * One document-level listener instead of handlers on every link: phone/email/WhatsApp clicks,
 * quote CTAs (any link to the contact page) and the language switch.
 */
export function useClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const location = link.closest("[data-track-location]")?.getAttribute("data-track-location");
      const where =
        location ??
        (link.closest("header") ? "header" : link.closest("footer") ? "footer" : "page");

      if (href.startsWith("tel:"))
        return track("contact_click", { method: "phone", location: where });
      if (href.startsWith("mailto:"))
        return track("contact_click", { method: "email", location: where });
      if (href.includes("wa.me/"))
        return track("contact_click", { method: "whatsapp", location: where });

      const hreflang = link.getAttribute("hreflang");
      if (hreflang && hreflang !== document.documentElement.lang) {
        return track("language_switch", { language: hreflang });
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (
        url.origin === window.location.origin &&
        contactPaths.has(routePath(url.pathname)) &&
        !contactPaths.has(routePath(window.location.pathname))
      ) {
        track("cta_click", {
          location: where,
          division: url.searchParams.get("division") ?? undefined,
          label: link.textContent?.trim().slice(0, 80),
        });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}
