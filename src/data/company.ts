import type { LeadDivision } from "@/i18n/routes";

// Placeholder company details: replace with the client's registered data before launch.
export const company = {
  legalName: "SRAGROUP S.r.l.",
  vatNumber: "00000000000",
  address: "Via Esempio 1, 20100 Milano (MI)",
  city: "Milano",
  mapQuery: "Milano, Italia",
};

export const departments: Record<LeadDivision, { email: string; phone: string }> = {
  general: { email: "info@sragroup.it", phone: "+39 02 0000 0000" },
  construction: { email: "costruzioni@sragroup.it", phone: "+39 02 0000 0001" },
  solar: { email: "energia@sragroup.it", phone: "+39 02 0000 0002" },
};

export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;
