import type { Division } from "@/i18n/routes";

export type Tone = Division | "neutral";

/**
 * Accent classes per division. Bright accents are used for fills and on dark surfaces;
 * the darker "ink" variants keep small accent text readable on light surfaces (WCAG AA).
 */
export const accent = {
  construction: {
    text: "text-construction-ink",
    textOnDark: "text-construction",
    bg: "bg-construction",
    border: "border-construction",
    button: "bg-construction text-charcoal hover:bg-construction/85",
    ring: "ring-construction",
  },
  solar: {
    text: "text-solar-ink",
    textOnDark: "text-solar",
    bg: "bg-solar",
    border: "border-solar",
    button: "bg-solar text-charcoal hover:bg-solar/85",
    ring: "ring-solar",
  },
  neutral: {
    text: "text-muted-foreground",
    textOnDark: "text-offwhite/65",
    bg: "bg-foreground",
    border: "border-foreground",
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
    ring: "ring-foreground",
  },
} as const satisfies Record<Tone, Record<string, string>>;
