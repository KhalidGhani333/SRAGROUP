import { useRouterState } from "@tanstack/react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./index";
import { langFromPath, type Lang } from "./routes";

export function useLang(): Lang {
  return useRouterState({ select: (s) => langFromPath(s.location.pathname) });
}

/**
 * Translation helper bound to the language in the current URL.
 * `list` reads arrays of structured content (cards, steps, milestones) from the JSON files.
 */
export function useT() {
  const lang = useLang();
  const { t } = useTranslation(undefined, { lng: lang });
  const list = useCallback(
    <T>(key: string): T[] => {
      const value = t(key, { returnObjects: true }) as unknown;
      return Array.isArray(value) ? (value as T[]) : [];
    },
    [t],
  );
  return { t, lang, list };
}
