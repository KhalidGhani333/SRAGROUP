# Live staging verification — 26 October 2026

Site: https://axistechstaging.com/sra-group/

The uploaded site contains the latest delivered changes from the 23 October document.

## Confirmed live

- Italian and English Home, Fotovoltaico/Solar, Construction, Projects and Contact pages return the packaged HTML. All ten pages match after normalizing Cloudflare's email-address protection markup; no other HTML difference was found.
- Seven primary JavaScript/CSS assets match the packaged files byte for byte. The additional Projects route module also matches.
- Updated Home content and figures, Construction services/sectors/statistics/method, removed Construction team, six renamed Solar projects, revised project locations/capacities, supplied images, footer text and banner signatures are deployed.
- Forty viewport/content checks completed across ten pages at 320, 390, 768 and 1440 pixels without horizontal page overflow.
- The three public form variants in both languages accept only name, email and telephone when tested with a browser-local mock. Marketing checkbox is absent. These mock submissions did not reach the server.
- The live PHP endpoint returned HTTP 422 with only the telephone validation error for an intentionally invalid request containing a name and valid email but no telephone, surname, company, message or privacy acknowledgement. This confirms the new optional-field validation is deployed. No valid enquiry, database write or email delivery was tested.

## Hosting observations

Two requests returned Cloudflare HTTP 520 during verification: the Italian Fotovoltaico page and the Projects route module `assets/progetti-hEqs_2Q3.js`. Both succeeded on retry. The route module subsequently returned HTTP 200 and the correct file hash on three consecutive requests.

The browser asset-health assertion recorded that transient 520; it was not an entirely error-free network run. The observed failures concern intermittent serving responses rather than a missing or outdated uploaded file.

## Previously held items

- Solar staff remains 90, pending resolution of the new reference's 92 versus the previous 90.
- Solar capacity remains 100+ MWp because the document supplied XX MWp without a numeric replacement.
- No unseen instruction was inferred from the cropped division-panel reference.

No server files, configuration or credentials were changed during this live verification.
