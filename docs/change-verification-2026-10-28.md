# Verification — 27 October client document

Implemented and verified locally on 28 October 2026 against
`SRA GROUP - CHANGES 27_10_2026.docx` and the complete transcription in
`docs/client-requests-2026-10-27.md`.

| Request | Result |
| --- | --- |
| H01 — Home capacity year | Smaller `nel 2026` / `in 2026` text added to 100+ MWp. The corrected Home staff figure remains 92. |
| A01 — About hero | Supplied heading and paragraph implemented. |
| A02 — History | 2009, 2021 and 2026 with supplied titles and descriptions. Approved history heading retained. |
| A03 — Mission | New heading and paragraph implemented. |
| A04 — Vision | New heading and paragraph implemented. |
| A05 — Values | Four titles, descriptions and relevant icons; fourth value is Affidabilità / Reliability. |
| A06 — Operational organisation | Replaces the old HSE/quality section, including eyebrow, heading and two cards with introductions and five points each. |
| A07 — About closing heading | Supplied replacement implemented. |
| A08 — About closing paragraph | Supplied replacement implemented through the shared CTA's text override. |
| F01 — Ground option | A terra / Ground removed from the public Solar form. Roof and Solar park remain. |
| F02 — Annual bill | Option, input, form state and submission path removed. |
| F03 — MWp units | Both labels use MWp; new requests submit `powerMwp`, which the PHP backend recognises and the CRM labels/summarises in MWp. Historical kWp/bill enquiries retain their original labels. |
| P01 — Comal photo | Replaced with image9 from the document. |
| P02 — PVH spelling and photo | Corrected PHV to PVH and replaced the cover with image16. |
| P03 — Arctech photo | Replaced with image12. |
| P04 — Valmont project | Added Agrivoltaico Valmont, Benevento, 2026, 10 MWp, using image14. |
| P05 — Solar banner | Uses that same Valmont image14. Home split-hero photograph retained. |

All 17 requests are complete in local source. English equivalents are included.
Shared project data now provides seven Solar projects and eleven projects overall;
both the carousel and portfolio reflect the additions and corrected photographs.

## Checks

- 38 Italian About text fields match the reviewed document transcription.
- Browser content checks pass for Italian and English Home, About, Solar, Projects and Contact.
- 40 viewport checks pass at 320, 390, 768 and 1440 pixels, without horizontal page overflow.
- Both language variants of the Solar form have exactly roof/park choices, no annual-bill field, two MWp labels and only the three mandatory contact fields.
- Local mocked submissions confirm `powerMwp: "10.5"`, without `powerKwp` or `annualBillEur`. No live enquiry or email was sent.
- 14 Vitest tests pass, including decimal MWp values and rejection of removed choices.
- PHP validation checks, MWp field storage, CRM labels and historical kWp summaries pass without database/email access. PHP syntax, TypeScript, lint and formatting checks pass.
- About mission/value cards visually reviewed after hydration.

## Deployment

The `/sra-group/` cPanel build was generated on 28 October 2026. The update package
is `deploy/sragroup-update-28-10-2026.zip` (generated locally and excluded from Git).
It contains the frontend and the three required PHP files below. Credentials,
configuration, uploads, database files and other admin/backend files are excluded.
No live deployment was performed; upload this ZIP into `public_html/sra-group/`
and extract with overwrite, preserving the existing directories and configuration.

The update package includes `backend/includes/crm.php`, `backend/includes/lang.php`
and `backend/api/lead.php`, preserving the earlier optional-field validation update.
No database migration is needed; details remain in the existing JSON field.
Preserve the live configuration, credentials and uploads.

All 17 prerendered HTML pages and their referenced assets were checked in the
deployment output. The three packaged PHP files match the current source files.

## Language switcher and hero hover follow-up

- The existing language switch translated correctly in local development with the
  `/sra-group/` base path. The reported stale-language behaviour was not reproduced there.
- Navbar language links now load the target language as a fresh document rather than
  relying on client navigation. Equivalent routes, translated division selections,
  other query parameters and fragment anchors are preserved.
- Twenty actual language-link clicks passed: both directions across eight public
  routes, plus Contact query/anchor checks at mobile and desktop widths. Each switch
  reset the document, selected the correct navbar language and rendered the matching
  page language.
- Both Home hero panels now share the same desktop hover expansion. Browser mouse
  tests measured approximately 819px width for either hovered panel at a 1440px viewport.
- These language and hover checks also pass against the production static cPanel
  build, using its actual `/sra-group/` URLs rather than the development server.
- TypeScript, 14 tests, formatting, PHP checks and lint pass; lint retains three
  existing fast-refresh warnings and no errors. The fixes are packaged but not
  deployed to the live site yet.
