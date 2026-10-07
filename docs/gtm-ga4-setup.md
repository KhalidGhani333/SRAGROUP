# Google Tag Manager, GA4 and Search Console setup

The website code is ready. These steps happen in the client's Google accounts, ideally signed in with a company Google account that SRAGROUP owns.

## 1. Create the accounts

1. **GA4:** at analytics.google.com, create the property "SRAGROUP" (timezone Italy, currency EUR). Add a **Web** data stream for `https://www.sragroup.it` and copy the **Measurement ID** (`G-XXXXXXX`).
2. **GTM:** at tagmanager.google.com, create the container "sragroup.it" (type: Web) and copy the **container ID** (`GTM-XXXXXXX`).
3. Put the ID in `.env.production` (copy it from `.env.example`):
   ```
   VITE_GTM_ID=GTM-XXXXXXX
   ```
4. Run `npm run build:cpanel` and upload.

## 2. What the site already does

- Before GTM loads, Consent Mode v2 defaults are set to **denied** (analytics, ads, ad user data, ad personalization).
- The cookie banner sends `gtag('consent','update', …)` together with the `consent_update` event:
  - **Analytics** in the banner sets `analytics_storage`.
  - **Marketing** sets `ad_storage`, `ad_user_data` and `ad_personalization`.
- Events pushed to the `dataLayer`:

| Event | When | Parameters |
|---|---|---|
| `generate_lead` | quote form sent successfully | `division`, `form_language`, `has_attachment` |
| `cta_click` | click on any link to the Contact page | `location`, `division`, `label` |
| `contact_click` | click on a phone, email or WhatsApp link | `method`, `location` |
| `language_switch` | IT/EN switch | `language` |
| `consent_update` | banner choice | `analytics`, `marketing` |

No personal data (name, email, phone) is ever pushed.

## 3. Configure the GTM container

1. **Admin → Container settings:** turn on *Enable consent overview*.
2. **Variables → New → Data Layer Variable:** create `division`, `form_language`, `location`, `method`, `language` and `label`.
3. **Tag "GA4 – Config":**
   - Type: *Google tag*, ID `G-XXXXXXX`
   - Trigger: *Initialization – All Pages*
   - Consent settings: *Require additional consent* → `analytics_storage`
4. **Triggers (Custom Event):** create `generate_lead`, `cta_click`, `contact_click` and `language_switch`.
5. **Tag "GA4 – Events":**
   - Type: *GA4 Event*, event name `{{Event}}`
   - Parameters: the variables from step 2
   - Fire on the four triggers from step 4
   - Same consent requirement as the config tag
6. **Preview** (Tag Assistant):
   - With **Reject**, no GA4 hit is sent.
   - After **Accept**, `page_view` and the events appear.
7. Click **Submit → Publish**.

## 4. GA4

- **Admin → Events:** mark `generate_lead` as a **key event** (conversion).
- **Admin → Data retention:** set 14 months.
- After GA4 goes live, update the "Cookie analitici" section of the Cookie Policy (`legal.cookies` in `src/i18n/it.json` and `en.json`) with the GA4 cookies (`_ga`, `_ga_<ID>`, 13 months).

## 5. Google Search Console

1. At search.google.com/search-console, add the **URL-prefix** property `https://www.sragroup.it/`.
2. Choose **HTML tag** and copy only the `content` value into `.env.production`:
   ```
   VITE_GSC_VERIFICATION=abc123...
   ```
3. Rebuild, upload, then click **Verify**.
4. **Sitemaps:** submit `sitemap.xml`.

## 6. Google Business Profile and social links

Create or claim the Google Business Profile for the registered address. Then paste the public URLs into `socialLinks` in `src/data/company.ts`:
- Google Business, LinkedIn and the other profiles appear in the footer.
- They are also passed to Google as `sameAs`.
