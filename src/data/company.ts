import type { LeadDivision } from "@/i18n/routes";

// DEMO company details (realistic but not real): replace with the registered data before launch.
// Privacy/Cookie policy, footer, Contact map and Google structured data all read from here.
const address = "Via Fabio Filzi 27, 20124 Milano (MI)";

export const company = {
  legalName: "SRAGROUP S.r.l.",
  vatNumber: "12345678903",
  /** Registro Imprese / REA number and share capital: mandatory on Italian company websites. */
  rea: "MI-2045871",
  shareCapitalEur: 100000,
  address,
  city: "Milano",
  /** What the Contact page map searches for: the registered address unless set otherwise. */
  mapQuery: address,
  privacyEmail: "info@sragroup.it",
};

/**
 * Public profiles shown in the footer and given to search engines (JSON-LD sameAs).
 * Leave a value empty to hide it.
 */
export const socialLinks = {
  linkedin: "",
  googleBusiness: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

export const departments: Record<LeadDivision, { email: string; phone: string }> = {
  general: { email: "info@sragroup.it", phone: "+39 02 8945 3100" },
  construction: { email: "info@sragroup.it", phone: "+39 02 8945 3110" },
  solar: { email: "info@sragroup.it", phone: "+39 02 8945 3120" },
};

export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;
