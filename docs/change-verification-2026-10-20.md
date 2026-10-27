# Document verification — 20 October 2026

Compared the local frontend with **SRA GROUP - CHANGES 19_10_2026.docx**, including the screenshots embedded in that document. This report verifies local source and the local development site; it does not verify a staging deployment.

| Document request | Result |
| --- | --- |
| Improve the pixelated Solar home hero | Complete: the current asset is 944 × 1666, its HTML dimensions match, and the reduced overlays preserve the jacket logo. Visually reviewed at desktop size. |
| Fix the home statistics alignment | Complete: numbers and units fit at 320, 390, 1024 and 1440 pixels in both languages. |
| Update the first five Solar projects | Complete: Roma / Solar Park Campagnano / 2026 / 10 MWp; Bergamo / 2026 / 2.8 MWp; Vicenza / 2026 / 2 MWp; Avellino / 2026 / 8.5 MWp; Salerno / 2026 / 8.5 MWp. Italian decimal formatting is preserved. |
| Replace the Solar services heading and all four cards | Complete: heading, titles, subtitles and descriptions match the supplied Italian copy; English equivalents are present. The collage matches the four-card grid height on desktop. |
| Solar technical statistics | Complete: +100 MWp nel 2026; 90; 100% with the national operations label; 2. Values are green and supporting labels gray. |
| Abbas Aryan's role | Complete: Responsabile Operativo / Operations Manager in the shared Solar and Construction team. |
| Replace all six process steps | Complete: supplied Italian titles and descriptions, in order, with English equivalents. |
| Replace the Solar closing heading, paragraph and button labels | Complete: supplied copy is present. Quote link retains the Solar division selection; phone link uses +39 351 831 0570. |
| Remove About Us leadership | Complete: section absent from both rendered language versions. |
| About Us timeline and photo | Complete: exactly 2022, 2024 and 2026 with new localized content; year and caption overlay removed from the photo. |
| Correct Jahanzaib on Construction and Solar | Complete: Azhar Jahanzaib appears on both pages in both languages. |
| Mix Solar and Construction projects | Complete: the full portfolio alternates divisions while both have entries, then shows the remaining two Solar projects. Division-specific order remains intact. |
| Home statistics: 5+ and 100+ MWp | Complete in Italian and English. |

## Verification

- 28 service, process and closing-section text fields match the DOCX copy exactly after whitespace normalization.
- Browser checks on Solar, Construction, About Us and Projects in Italian and English at 320 and 1440 pixels: content assertions pass; no page horizontal overflow.
- Home hero resolution and statistics checked in both languages; responsive statistics checks at 320, 390, 1024 and 1440 pixels.
- No build, ZIP or deployment created during this verification.

No document item remains pending in the local frontend.
