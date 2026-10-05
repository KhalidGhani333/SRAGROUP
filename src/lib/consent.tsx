import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ConsentCategories = { analytics: boolean; marketing: boolean };
export type ConsentRecord = ConsentCategories & {
  necessary: true;
  version: number;
  updatedAt: string;
};

const STORAGE_KEY = "sragroup-consent";
// Bump when categories or vendors change materially, to ask visitors again.
const CONSENT_VERSION = 1;

type ConsentContextValue = {
  /** null until the visitor has made a choice (or before hydration). */
  consent: ConsentRecord | null;
  /** false during SSR and the first client render, so the banner never flashes. */
  ready: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choice: ConsentCategories) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function read(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Integration point for Google Tag Manager Consent Mode v2. When GTM is added, it reads this
 * event from the dataLayer; nothing is sent anywhere until then.
 */
function publish(record: ConsentRecord) {
  window.dataLayer?.push({
    event: "consent_update",
    analytics_storage: record.analytics ? "granted" : "denied",
    ad_storage: record.marketing ? "granted" : "denied",
    ad_user_data: record.marketing ? "granted" : "denied",
    ad_personalization: record.marketing ? "granted" : "denied",
  });
  window.dispatchEvent(new CustomEvent("sragroup:consent", { detail: record }));
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = read();
    setConsent(stored);
    setReady(true);
    if (stored) publish(stored);
  }, []);

  const save = useCallback((choice: ConsentCategories) => {
    const record: ConsentRecord = {
      necessary: true,
      analytics: choice.analytics,
      marketing: choice.marketing,
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Storage unavailable (private mode): the choice still applies for this visit.
    }
    setConsent(record);
    setPreferencesOpen(false);
    publish(record);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      ready,
      preferencesOpen,
      save,
      acceptAll: () => save({ analytics: true, marketing: true }),
      rejectAll: () => save({ analytics: false, marketing: false }),
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [consent, ready, preferencesOpen, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return {
    ...ctx,
    hasDecided: ctx.consent !== null,
    analytics: ctx.consent?.analytics ?? false,
    marketing: ctx.consent?.marketing ?? false,
  };
}
