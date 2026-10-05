import type { Lang, LeadDivision } from "@/i18n/routes";

export type LeadPayload = {
  division: LeadDivision;
  /** Division-specific answers, keyed by field name (projectType, area, installationType, …). */
  details: Record<string, string>;
  contact: {
    firstName: string;
    lastName: string;
    company: string;
    role: string;
    email: string;
    phone: string;
  };
  message: string;
  /** File name only: uploads are UI-only until a storage/CRM endpoint exists. */
  attachmentName?: string;
  consent: { privacy: true; marketing: boolean };
  meta: { lang: Lang; page: string; submittedAt: string };
};

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

/**
 * Single integration point for quote requests. Replace the body with a call to the CRM
 * (HubSpot, Salesforce, a webhook…) and keep the signature so the form needs no changes.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitLeadResult> {
  console.log("[submitLead]", payload);
  // Simulated latency so the loading state is visible during development.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true };
}
