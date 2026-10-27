# Changes from SRA GROUP - CHANGES 23_10_2026.docx

Implemented on 24 October 2026. The user's instruction was to implement the clear requests and leave unresolved figures unchanged. This is a local implementation report, not a deployment confirmation.

## Implemented

- All shared page banners now show `SRA GROUP` without the Milano suffix.
- The Fotovoltaico banner uses the document's aerial photograph.
- All six Solar projects have the requested names. Projects 3, 5 and 6 have the supplied locations, years and capacities; projects 1, 4 and 5 have the supplied replacement photographs. Carousel and full portfolio use the same data source.
- Solar services collage photos 2 and 4 replaced; photos 1 and 3 and the logo retained.
- All public quote-form variants require only name, email and telephone. Surname, company, message and project details are optional. Numeric details still validate when supplied. General enquiries are selected by default, so visitors can submit without choosing a division.
- Marketing checkbox removed; the form sends marketing consent as false. The existing privacy acknowledgement remains optional and its actual value is recorded rather than assuming consent.
- PHP lead validation and privacy-value storage updated to match the form. No credentials, configuration, database schema, uploads or admin authentication files changed.
- Construction hero description and supporting line replaced.
- Construction services replaced with eight numbered cards and relevant line icons.
- Construction sectors replaced with the supplied heading and four cards.
- Construction team section removed; Solar team retained.
- Construction statistics section added: 2009, 35, 100%, 360 degrees, with supplied descriptions.
- Construction method's six titles and descriptions replaced.
- Construction closing section retains its existing two-column arrangement, with the supplied subtitle, descriptions and contact label.
- Home hero panels use the supplied distinct Construction and Solar text.
- Home marquee contains the ten supplied service phrases.
- Home introduction uses the supplied heading and text. Construction figures updated to 2009 and 35.
- Home division panels retain their two photographs and use the supplied company labels, distinct titles, descriptions and four service bullets each.
- Home strengths section replaced with the supplied heading, introduction and six cards.
- Home closing contact section places the supplied heading/paragraph on the left and stacked contact buttons on the right.
- Footer tagline replaced with the supplied sentence.
- English equivalents supplied for the changed Italian content.

## Status of initially held items

- The Home reference supplies `XX MWp` without a number. The existing `100+ MWp` figure remains.
- Resolved on 28 October 2026: the Home Solar staff figure is now 92 in Italian and English, as explicitly supplied in the document. The separate Fotovoltaico capability figure remains 90; the document did not request changing it.
- The division-panel reference screenshot ends mid-sentence. Its visible, explicit content and instruction to keep both photographs were implemented; no unseen layout instruction was inferred.

## Verification

- 11 Vitest tests pass, including minimal enquiries for all three divisions and required-field/invalid-value cases.
- PHP syntax check passes. 20 isolated validation checks pass without accessing a database or sending email.
- Italian and English Home, Solar, Construction, Projects and Contact pages pass content checks and horizontal-overflow checks at 320, 390, 768 and 1440 pixels (40 viewport checks).
- Six minimal form submissions (three divisions in two languages) succeed against a local browser mock using only name, email and telephone. No live lead was submitted.
- TypeScript and formatting checks pass. Lint reports no errors; the existing shared-component fast-refresh warning remains.
- Final visual review completed after React hydration. The capacity number and MWp unit fit at 320, 390, 768, 1024 and 1440 pixels. Supplied hero and collage assets load successfully.
- Supplied photographs were converted to high-quality JPEGs at their original dimensions to reduce transfer size; source originals remain in the supplied document.

## Deployment dependency

The next deployment must include the updated `backend/api/lead.php` alongside the frontend. Uploading only frontend files would leave the previous backend validation in place. Preserve the server's existing `backend/config.php` and all live credentials. No new build or ZIP was created for this change set.
