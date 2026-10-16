import type { LeadDivision } from "@/i18n/routes";

// DEMO company details (realistic but not real): replace with the registered data before launch.
// Privacy/Cookie policy, footer, Contact map and Google structured data all read from here.
const address = "Via Fabio Filzi 27, 20124 Milano (MI)";
const officeAddress = "Via Enrico Toti, 6/B, 46029 Suzzara (MN)";

export const company = {
  legalName: "SRAGROUP S.r.l.",
  vatNumber: "12345678903",
  /** Registro Imprese / REA number. */
  rea: "MI-2045871",
  address,
  city: "Milano",
  /** Office shown on the Contact page and used for the map search. */
  officeAddress,
  mapQuery: officeAddress,
  privacyEmail: "info@sragroup.it",
};

export const departments: Record<LeadDivision, { email: string; phone: string }> = {
  general: { email: "info@sragroup.it", phone: "+39 351 831 0570" },
  construction: { email: "costruzioni@sragroup.it", phone: "+39 351 831 0570" },
  solar: { email: "fotovoltaico@sragroup.it", phone: "+39 351 831 0570" },
};

export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;

/**
 * Public profiles shown as icons in the footer and given to search engines (JSON-LD sameAs).
 */
export const socialLinks = {
  whatsapp: `https://wa.me/${departments.general.phone.replace(/\D/g, "")}`,
  facebook: "https://www.facebook.com/p/SRA-GROUP-SRL-61580999160347/",
  instagram: "https://www.instagram.com/sra_group_srl/",
  tiktok: "https://www.tiktok.com/@sragroupsrl",
};

/** Credit shown in the footer bottom bar. */
export const siteCredit = "Abbad Ahmed Khan";
