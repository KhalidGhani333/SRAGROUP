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
  /** Original file name; the file itself is sent as the `attachment` argument. */
  attachmentName?: string;
  consent: { privacy: true; marketing: boolean };
  /** Time between page load and submit; the CRM rejects implausibly fast (bot) submissions. */
  meta: { lang: Lang; page: string; submittedAt: string; elapsedMs: number };
  /** Hidden honeypot field: always empty for people, filled in by spam bots. */
  website: string;
};

export type SubmitLeadResult = { ok: true; reference?: string } | { ok: false; error: string };

/**
 * CRM endpoint (backend/api/lead.php). Same-origin in production; during local development set
 * VITE_LEAD_ENDPOINT in .env.development.local to the XAMPP URL, e.g. http://localhost/backend/api/lead.php.
 */
const endpoint =
  import.meta.env["VITE_LEAD_ENDPOINT"] || `${import.meta.env.BASE_URL}backend/api/lead.php`;

/** Single integration point for quote requests: sends the lead and optional file to the CRM. */
export async function submitLead(
  payload: LeadPayload,
  attachment?: File | null,
): Promise<SubmitLeadResult> {
  const body = new FormData();
  body.append("payload", JSON.stringify(payload));
  if (attachment) body.append("attachment", attachment);

  try {
    const res = await fetch(endpoint, { method: "POST", body });
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      reference?: string;
      error?: string;
    } | null;
    if (res.ok && data?.ok)
      return data.reference ? { ok: true, reference: data.reference } : { ok: true };
    return { ok: false, error: data?.error ?? `http_${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}
