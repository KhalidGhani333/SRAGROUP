# SRAGROUP.IT - Project Completion Plan

Source: `Project Brief - SRA GROUP.docx` (B2B corporate site, two divisions: Construction + Solar/Renewable Energy).
Goal: generate B2B leads, show industrial expertise, act as a digital credential.

Legend: `[x]` done · `[~]` partially done / placeholder · `[ ]` pending

---

## Phase 0 - Setup & Foundation ✅ COMPLETED

- [x] Project scaffold (TanStack Start + React 19 + Vite + Tailwind 4 + shadcn/ui)
- [x] Git repo connected to Lovable
- [x] Vercel config (`vercel.json`)
- [x] Brand tokens: charcoal / off-white base, amber accent (Construction), green accent (Solar)
- [x] Fonts: Space Grotesk (headings) + Inter (body)
- [x] Logo added (`src/assets/sra-logo.png`)

## Phase 1 - Frontend (Design & Pages) ✅ COMPLETED

### Shared chrome (`src/components/site`)
- [x] Sticky header with nav + "Richiedi un preventivo" CTA
- [x] Footer with logo, links, 3 department contacts, P.IVA, Privacy/Cookie links
- [x] Motion/animation helpers, Lightbox, ProjectCarousel, ProjectGrid
- [x] Dual-division accent system (`accent.ts`)

### Pages required by the brief
- [x] Homepage - split hero (Construction | Solar), stats bar, division intros, featured projects, certifications strip, CTA band
- [x] About / Chi Siamo - history timeline, mission, certifications, safety & quality standards
- [x] Construction / Costruzioni - industrial/commercial/residential, services, 5-step methodology
- [x] Solar / Fotovoltaico - commercial PV, solar parks, energy efficiency, maintenance, technical capabilities
- [x] Projects / Progetti - filterable gallery (All / Construction / Solar) from `src/data/projects.ts`
- [x] Project detail page (`/progetti/$slug`, `/en/projects/$slug`)
- [x] Contact / Contatti - 3 department cards (General, Construction, Solar), map, quote form
- [x] Privacy Policy + Cookie Policy pages
- [x] 404 page

### Functional UI
- [x] Quote form with conditional fields per division (project type, m², installation type, kWp, …)
- [x] Form validation (react-hook-form + zod), GDPR consent checkbox, success state
- [x] Bilingual: Italian (primary, `/`) + English (secondary, `/en/...`) with i18n files (`src/i18n/it.json`, `en.json`)
- [x] Cookie consent banner + preferences dialog (necessary / analytics / marketing)
- [x] Google Maps iframe loads only after consent or click
- [x] Basic SEO meta per route (`src/i18n/seo.ts`)
- [x] Responsive layout (mobile → desktop)

---

## Phase 2 - Content ✅ COMPLETED WITH DEMO DATA - swap for real data before launch

> Real data not available yet, so realistic **demo** data is in place. Everything below lives in a
> single place, so the real values can be swapped in without touching layouts.

- [x] Company data in `src/data/company.ts` (demo): SRAGROUP S.r.l., Via Fabio Filzi 27, 20124 Milano, P.IVA 12345678903, REA MI-2045871, share capital € 100.000 - also feeds footer, Privacy/Cookie policy, Contact map and Google structured data
- [x] Footer shows the legally required company line (P.IVA, REA, share capital fully paid)
- [x] Department emails & phones (demo): info@sragroup.it (single mailbox for all departments), +39 02 8945 3100 / 3110 / 3120
- [x] Projects in `src/data/projects.ts` (demo): 8 case studies (4 construction, 4 solar) with location, year, metrics, gallery
- [x] Company history timeline (2001-2026) + homepage stats (25+ years, 180+ projects, 85 MWp, 98% on time) (demo)
- [x] Certifications ISO 9001 / 14001 / 45001 / SOA with descriptions (demo)
- [x] Leadership team with demo names and monogram cards instead of "photo coming soon"
- [x] Favicon + app icons (192/512) + `site.webmanifest`; `public/logo.png` for Google
- [x] Copy check: IT/EN keys identical, no untranslated strings left in Italian
- [x] Privacy Policy & Cookie Policy full text (Phase 5), company details filled automatically

### Before launch (client / PM)
- [ ] Replace demo values with the registered data: `src/data/company.ts` (company, phones, `socialLinks`), `src/data/projects.ts` + photos, stats/timeline/certifications/leadership in `src/i18n/it.json` + `en.json`
- [ ] Certificate PDFs/logos and leadership portraits (optional)
- [ ] Master logo as SVG from the client's designer
- [ ] Native Italian proofreading + client/DPO approval of the legal texts
- [ ] PM design review against the references (refeel-epc.it, clemanimpianti.com, tecnocem.it)

## Phase 3 - Custom CRM + Admin Panel (`/backend/admin`) ✅ COMPLETED (local) - see `backend/README.md`

> Custom CRM in plain PHP + MySQL (XAMPP locally, cPanel live). The quote form posts to `backend/api/lead.php`.

- [x] Decide CRM → custom PHP/MySQL CRM (no third-party CRM)
- [x] Lead API endpoint `backend/api/lead.php` (multipart: JSON payload + attachment)
- [x] Server-side validation mirroring the zod schema
- [x] File attachment upload (pdf/dwg/jpg/png, 10 MB, content check, private storage, auth-only download)
- [x] Rate limiting per IP + CORS allow-list
- [x] GDPR consent proof stored with the lead (privacy, marketing, language, page, IP, timestamp)
- [x] Website form connected (`src/lib/submitLead.ts`, error state when the API fails)
- [x] Admin auth: setup wizard, login, throttling, CSRF, session timeout, password change
- [x] Dashboard: KPIs, 30-day chart, division split, pipeline funnel, latest leads, follow-ups
- [x] Leads list: status tabs, search, filters, pagination, CSV export
- [x] Lead detail: pipeline stage, status/owner/priority/value/follow-up, notes, activity log, GDPR delete
- [x] Pipeline flow: New → Contacted → Qualified → Quote sent → Won / Lost (changed from the lead's **Manage** box; a first note can auto-mark New → Contacted; every change is logged)
- [x] **Multi-department routing**: users scoped to a division (Construction / Solar / General / All)
- [x] Users management with roles (Administrator / Team member)
- [x] Email notification to department + auto-reply (IT/EN), SMTP support (cPanel mailbox / Gmail) + "Send test email" button in My profile
  - On the server: set `mail.enabled` + SMTP details in `backend/config.php`, then send a test email
- [x] Run locally on XAMPP (junction into htdocs, create first admin) and test from the website form
- [x] Lead list shows the request summary; Owner/Value/Follow-up explained as internal team fields
- [x] Spam protection: hidden honeypot field + minimum fill time (no cookies, GDPR-friendly); bots get a fake success and nothing is saved
- [x] Admin panel in Italian + English (per-user language in My profile, IT/EN switch on sign-in, Italian dates)
- [x] cPanel hosting solved: `npm run build:cpanel` prerenders all pages to static HTML + bundles `backend/` into `deploy/public_html`

## Phase 4 - Integrations ✅ CODE COMPLETED - client account steps pending (see `docs/gtm-ga4-setup.md`)

### Google Analytics / Tag Manager
- [x] Consent Mode v2 fixed: banner now sends real `gtag('consent','update')` (before it only pushed a custom event that Consent Mode ignores) + `consent_update` event
- [x] GTM snippet (`src/lib/analytics.ts`) loads only when `VITE_GTM_ID` is set, with **default consent = denied** set before GTM in one inline script
- [x] Events tracked: `generate_lead` (division, language, attachment), `cta_click` (every link to Contact), `contact_click` (phone / email / WhatsApp), `language_switch` - no personal data
- [x] GTM/GA4 container setup guide: tags, triggers, consent settings, key event (`docs/gtm-ga4-setup.md`)
- [ ] Client: create GTM container + GA4 property, put `VITE_GTM_ID` in `.env.production`, configure container per the guide
- [ ] Client: mark `generate_lead` as key event (conversion) in GA4
- [ ] Verify in GTM Preview + GA4 DebugView that nothing fires before consent (needs the real container)

### Google Maps
- [x] Decision: keep the keyless Google Maps embed (no API key, no cost) - loads only after marketing consent or a click
- [x] Map follows the registered address in `src/data/company.ts` (`mapQuery` = address), so it updates with the real data from Phase 2

### Other
- [x] Google Search Console verification ready: `VITE_GSC_VERIFICATION` meta tag + sitemap from Phase 6 (client: add property, verify, submit sitemap)
- [x] Google Business Profile + LinkedIn / Instagram / Facebook / YouTube links: `socialLinks` in `src/data/company.ts` -> footer "Seguici" + JSON-LD `sameAs` (shown once URLs are filled in)
- [ ] Client: provide social / Google Business URLs

## Phase 5 - Compliance & Security ✅ COMPLETED (code)

- [x] Cookie consent manager (custom, categories, re-open preferences)
- [x] Privacy & Cookie policy pages linked in footer and banner
- [x] Final legal text written (IT + EN) from the real data processing: controller, data, purposes/legal bases, retention (24 months / 10 years), recipients, Google transfers (DPF), rights; company details filled from `src/data/company.ts`; placeholder banner removed (client/DPO sign-off tracked in Phase 2)
- [x] Cookie list matches the real tools today: `sragroup-consent` (localStorage), CRM-only `sra_crm`/`crm_lang`, Google Maps after consent, Google Fonts (no cookies), no analytics yet - update when GA4 goes live (Phase 4)
- [x] Consent manager meets Garante cookie guidelines (equal Accept/Reject, granular categories, nothing pre-ticked, re-open link, Consent Mode v2) - certified CMP (Iubenda / Cookiebot) only if the client asks
- [x] **Security headers** in `public/.htaccess` (cPanel): HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` done - `Content-Security-Policy` added (fonts, Maps, GTM/GA4 allowed); stricter CSP on the CRM
- [x] CRM security: bcrypt passwords, CSRF, login throttling, session timeout, upload checks, rate limit, protected `config.php`/`includes`/`storage`
- [x] HTTPS enforced in `public/.htaccess` (redirect + HSTS) - enable AutoSSL on the server (see `DEPLOY.md`)
- [x] Headers verified locally on Apache (XAMPP) - re-check online with securityheaders.com after upload
- [x] `npm audit` (0 vulnerabilities) and dependency cleanup (41 unused UI components + 30 unused packages removed)

## Phase 6 - SEO & Performance ✅ COMPLETED (Lighthouse run pending)

- [x] Per-page title/description
- [x] `hreflang` alternates IT ↔ EN on every page + `x-default` (`src/i18n/seo.ts`)
- [x] `sitemap.xml` generated by `npm run build:cpanel` from the prerendered pages (32 URLs, IT + EN, hreflang alternates, 404 excluded) + `Sitemap:` line in `robots.txt`
- [x] Canonical URLs with final domain (`SITE_URL = https://www.sragroup.it`)
- [x] All pages prerendered to static HTML (fast load, fully crawlable)
- [x] Open Graph / Twitter images on every page (1200×630 JPEGs in `public/og`, project pages use their cover)
- [x] JSON-LD structured data: `GeneralContractor` (Organization + LocalBusiness, 3 department contact points) on home, `BreadcrumbList` on every inner page and project
- [x] Image optimization: all images WebP (6.6 MB → 3.1 MB), max 1600px (heroes 1920px), lazy-load + width/height below the fold, `fetchPriority=high` on heroes
- [ ] Lighthouse target: Performance ≥ 90, Accessibility ≥ 95, SEO 100 (mobile) - run in Chrome DevTools > Lighthouse (could not launch Chrome from the automation)
- [~] Accessibility (WCAG 2.1 AA): code checks done (html lang, alt texts / decorative images, labelled form fields + errors, focus outlines, reduced-motion support) - confirm contrast with the Lighthouse run

## Phase 7 - QA & Testing ✅ COMPLETED (automated) - manual Safari/Firefox + PM review pending

- [x] Responsive QA: 10 key pages (IT + EN) at 6 widths - mobile 360, tablet 768, laptop 1024 / 1280 / 1366, desktop 1920 - in headless Edge: no horizontal overflow, no clipped text, no JS errors
- [x] Responsive fixes:
  - tablet: home division headings now scale with the screen
  - tablet: Costruzioni sector cards and Contact department cards go full width below 1024px
  - footer: contacts no longer overlap on tablet or desktop
  - laptop 1024: header no longer overflows (quote button from 1280px, nav on one line)
  - mobile: smaller logo so it doesn't collide with IT/EN
  - Chi Siamo values grid and stat numbers (home, solar, project pages) scale per screen
- [x] Touch targets: IT/EN switch, footer/legal links, breadcrumb, contact links and policy table of contents now ≥ 24px; smallest labels raised to ~11px
- [x] Every form path end-to-end into the CRM (General / Construction / Solar, with and without attachment, validation errors, spam and rate limit) - tested on XAMPP
- [x] IT ↔ EN: keys identical in both languages, every page has a working IT/EN alternate (link checker)
- [x] Consent: no Google request before consent; "Accept all" stores the choice and loads the map (GTM/GA verified with a test ID in Phase 4)
- [x] Broken links: 1,600 internal links and assets across 33 prerendered pages, 0 broken; 404 page served for unknown URLs
- [x] `npm run lint` (0 errors), `npm run build:cpanel`, `npm test` pass
- [~] Cross-browser: Chromium (Edge/Chrome) automated - check Safari (iPhone) and Firefox by hand once
- [ ] Lighthouse score in Chrome DevTools (could not launch Chrome from automation; see Phase 6)
- [ ] PM/client review round + fix feedback

---

## Progress Summary

| Phase | Status |
|---|---|
| 0. Setup & Foundation | ✅ Done |
| 1. Frontend (design, pages, bilingual, form UI, cookie banner) | ✅ Done |
| 2. Content | ✅ Done with demo data (swap real data before launch) |
| 3. Custom CRM + admin panel | ✅ Done (tested on XAMPP) |
| 4. Integrations (GTM/GA4, Maps) | ✅ Code done - waiting for client GTM/GA4/Search Console accounts |
| 5. Compliance & Security | ✅ Done (client/DPO sign-off in Phase 2) |
| 6. SEO & Performance | ✅ Done (Lighthouse run in Chrome pending) |
| 7. QA & Testing | ✅ Done (automated + responsive fixes); Safari/Firefox check + PM review pending |

**Next step:** deploy `deploy.zip` to cPanel (see `DEPLOY.md`), then swap demo data for real data.
