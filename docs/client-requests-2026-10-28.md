# Client changes dated 28 October 2026

Implemented and verified locally on 30 October 2026. Source: `SRA GROUP - CHANGES 28_10_2026.docx`. Read the document body, project table and all 13 referenced images (including text embedded in screenshots).

## Request coverage

- [x] Projects hero title: `La nostra esperienza prende forma nei progetti.`
- [x] Projects hero text: `Interventi realizzati in tutta Italia, testimonianza della nostra capacità di affrontare sfide complesse nel settore edile ed energetico.`
- [x] Projects hero background: supplied wide construction and solar photo (`image13.png`).
- [x] Projects listing title: `Le nostre realizzazioni. La forza della nostra esperienza.`
- [x] Six construction projects, in the document's sequence, shared by the Construction carousel and Projects page; project counts update automatically to 6 construction + 7 solar = 13.
- [x] First project: `Riqualificazione energetica condominiale`, metric `55+ condomìni · 100.000+ m² di facciate`; supplied detail heading, introduction, building-photo reference, figures, project text, six activities and results. The photo is extracted from the document's image9 screenshot; its embedded attribution remains in the source crop.
- [x] Second project: `Riqualificazione post-alluvione – 20 alloggi ACER`; Faenza (RA), 2025–2026, 20 apartments. Full supplied detail heading, metadata, three description paragraphs, eight activities and two experience paragraphs.
- [x] Third project: `Intervento di idroscarifica su silos industriali`; Vicenza (VI), about 16,000 m², subcontracted work. Full supplied detail heading, metadata, three description paragraphs, three activities and contribution paragraph.
- [x] Fourth project: `Interventi di consolidamento e rinforzo strutturale`; sites across Italy. Full supplied detail heading, metadata, three description paragraphs, seven activities and experience paragraph.
- [x] Fifth project: `Messa in sicurezza dei solai e adeguamento antincendio`; Gorizia (GO), Liceo Scientifico “Duca degli Abruzzi”, Via Randaccio branch. Full supplied detail heading, metadata, three description paragraphs, nine activities and contribution paragraph.
- [x] Sixth project: `Rifacimento e riqualificazione di coperture residenziali`; San Lazzaro di Savena (BO). Full supplied detail heading, two description paragraphs, seven activities and operational expertise paragraph. The specific location in the project instructions takes precedence over the table's generic nationwide label.
- [x] Sixth project's quantities: roof area 939 m²; converse 10 pieces; gutters 168 linear metres; sheet metal work 307 linear metres. Displayed under `Quantità prevista` with the supplied note that they must be verified against completed works, not represented as completed quantities.
- [x] Home construction half background: supplied real crane/scaffolding photo (`image10.png`), targeted by screenshot `image12.png`. Construction page hero remains unchanged because the screenshot identifies the home split hero.
- [x] Italian content and English translations on listing and detail routes. Language switching preserves the selected project. Detail pages have canonical/hreflang links, breadcrumbs, contact/back navigation and sitemap entries.

## Asset and scope notes

The document supplies one building-photo reference for project 1, the new Projects background, and the new home construction photo. Existing illustrative covers are reused for the other five project cards/details; the document provides their written detail content, not replacement photos. No dates or completed measurements were invented where absent. All seven solar project records are unchanged from the previous committed content.

New hero assets use responsive AVIF/WebP. Previous font, visible hero text and lazy-loading improvements are retained. Shared portfolio content remains in `src/data/projects.ts`; shared hero and card patterns remain in `src/components/site`.

## Verification

- Production cPanel build passed; 29 physical HTML pages, including 12 new localized project detail pages. Sitemap contains 28 indexable URLs.
- TypeScript passed; all 16 tests passed, including new detail route and language-switch coverage; targeted ESLint and Prettier passed.
- Verified 272 rendered detail text fields against the shared project data, including every paragraph, activity, metadata field and planned quantity in both languages.
- 36 Chrome checks passed at 320px and 1440px, including all 12 detail pages, carousel/list order, filter results, first-card navigation, home photo selection, content and horizontal overflow.
- 24 actual IT/EN language switches preserved the selected detail page.
- Desktop detail and full mobile roof-page screenshots inspected.

These changes are local and packaged for review; the live hosting has not been updated by this implementation.
