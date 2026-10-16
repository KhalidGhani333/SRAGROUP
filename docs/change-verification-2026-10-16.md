# Requested changes verification — 2026-10-16

This audit covers the local workspace and locally rendered pages. It does not
verify the deployed website or publish changes.

## Completed

| Request | Verified result |
| --- | --- |
| Solar project locations and order | Roma → Bergamo → Vicenza → Napoli → Salerno → Alessandria. Bergamo retained its existing content. |
| Apply the same projects to the Projects page | The six solar projects appear first in the same sequence, followed by the four construction projects. The division filter uses the shared data. |
| Remove the first Solar service card | Commercial/industrial PV card removed in both languages; four service cards remain. |
| Resize the Solar photo collage | Collage and four cards have equal heights in the side-by-side layout, checked at 1440px and 768px. At 390px the sections stack without horizontal overflow. |
| Replace the vertical blue-panel collage photo | Replaced by the installation/scissor-lift photograph. |
| Update technical statistics | 135 MWp installed and three owned pile drivers; the installed-capacity figure is also consistent on Home and About. |
| Update Solar team | Seven members in the requested order, with Abbas Aryan as Amministratore/Administrator, Khalid Mohsin and Khan Rehmat as Project Managers, and Hussain Sadaqat, Azhar Jahanzalb, Hayat Khizar and Ali Zeeshan as Site Managers. |
| Add a Construction team section | Matching section exists, with a short announcement until names are supplied. |
| Replace Salerno and Alessandria photographs | Both user-provided files inspected visually and referenced by the shared project data. |
| Add an MWp line to the two new project cards | Both display “MWp · to be confirmed” / “MWp · da confermare”. Actual numbers remain pending. |
| Move Solar team above Process | Team precedes Process; Process is the final content section before the closing CTA. |
| Replace Home Solar hero photograph | The supplied blue-sky photograph with the team member on the right is saved in the existing hero asset and referenced by both languages. |
| Remove the company/address block below footer social icons | Block removed. Copyright and logo remain. |
| Update department contact details | General: info@sragroup.it; Construction: costruzioni@sragroup.it; Solar: fotovoltaico@sragroup.it. All use +39 351 831 0570, including working mailto/tel hrefs. Footer and Contact cards share the data. |
| Set social profiles | Instagram: sra_group_srl; Facebook: SRA-GROUP-SRL-61580999160347; TikTok: @sragroupsrl; WhatsApp: 393518310570. |
| Correct About team names | Hussain Rafaqat / HR and Hussain Sadaqat / HS in both languages. |
| Reorder Construction page | Banner → Projects → Specialist services → Sectors → Our team → Method, followed by the closing CTA. |
| Separate Contact page sections | Banner followed by Form → Contact Details → Map. One form remains; the quote anchor is preserved. |
| Set the Contact map location | Visible office address and map query use Via Enrico Toti, 6/B, 46029 Suzzara (MN). |

## Pending information

1. **Salerno and Alessandria actual MWp capacities.** The requested lines are present,
   but numerical capacities have not been supplied. Their years are also unspecified.
2. **Construction team names and roles.** The section is ready; the user explicitly
   said names would be supplied later.

## Content discrepancies to confirm

- **Roma project title:** the location is Roma, but the title remains “Solar Park
  Valdichiana” / “Valdichiana Solar Park”. The mobile screenshot question was not
  followed by a confirmed replacement title.
- **Office versus registered address:** the Contact map now uses Suzzara, as requested.
  Legal text and organization structured data still use the existing Milano address.
  A request to change the registered company address has not been provided.
- **Abbas Aryan's role on About:** Solar lists Amministratore/Administrator as requested;
  About still lists Responsabile Operativo/Operations Manager. Confirm if the About
  role should also change.

## Validation

- 134 targeted browser assertions passed across Home, Solar, Projects, About,
  Construction and Contact in Italian and English.
- Desktop: 1440px; mobile: 390px. Solar collage also checked at 768px.
- The three replacement photographs were opened and compared visually with the
  images supplied in the conversation.
- TypeScript: passed.
- Existing Vitest suite: one test passed.
- Full ESLint run: zero errors, three Fast Refresh warnings in Site.tsx, button.tsx
  and consent.tsx.
- Production build: passed.
- No live deployment was performed by this assistant. External social-profile
  availability and delivery to the new email inboxes were not tested.
