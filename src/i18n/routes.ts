export const languages = ["it", "en"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "it";

/**
 * Single source of truth for localized URLs. Italian lives at the root, English under /en.
 * The language switcher, internal links, hreflang tags and the sitemap all read from here.
 */
export const routeMap = {
  home: { it: "/", en: "/en" },
  about: { it: "/chi-siamo", en: "/en/about" },
  construction: { it: "/costruzioni", en: "/en/construction" },
  solar: { it: "/fotovoltaico", en: "/en/solar" },
  projects: { it: "/progetti", en: "/en/projects" },
  contact: { it: "/contatti", en: "/en/contact" },
  privacy: { it: "/privacy-policy", en: "/en/privacy-policy" },
  cookies: { it: "/cookie-policy", en: "/en/cookie-policy" },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof routeMap;

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "it";
}

export function localizedPath(page: PageKey, lang: Lang): string {
  return routeMap[page][lang];
}

export function projectPath(slug: string, lang: Lang): string {
  return `${routeMap.projects[lang]}/${slug}`;
}

/** Division values as they appear in ?division= query strings, per language. */
export type Division = "construction" | "solar";
export type LeadDivision = Division | "general";

const divisionParams: Record<LeadDivision, Record<Lang, string>> = {
  construction: { it: "costruzioni", en: "construction" },
  solar: { it: "fotovoltaico", en: "solar" },
  general: { it: "generale", en: "general" },
};

export function divisionParam(division: LeadDivision, lang: Lang): string {
  return divisionParams[division][lang];
}

/** Accepts either language's spelling so shared links keep working after a language switch. */
export function parseDivisionParam(value: unknown): LeadDivision | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.toLowerCase();
  return (Object.keys(divisionParams) as LeadDivision[]).find(
    (d) => divisionParams[d].it === v || divisionParams[d].en === v,
  );
}

function normalize(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/** The equivalent path in the other language, or that language's home for unknown pages. */
export function alternatePath(pathname: string, target: Lang): string {
  const path = normalize(pathname);
  const current = langFromPath(path);
  for (const page of Object.keys(routeMap) as PageKey[]) {
    if (routeMap[page][current] === path) return routeMap[page][target];
  }
  const projectsBase = `${routeMap.projects[current]}/`;
  if (path.startsWith(projectsBase)) {
    return projectPath(path.slice(projectsBase.length), target);
  }
  return routeMap.home[target];
}

/** Search params for the alternate URL, translating a ?division= value when present. */
export function alternateSearch(
  search: Record<string, unknown>,
  target: Lang,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue;
    if (key === "division") {
      const division = parseDivisionParam(value);
      if (division) out[key] = divisionParam(division, target);
      continue;
    }
    out[key] = String(value);
  }
  return out;
}
