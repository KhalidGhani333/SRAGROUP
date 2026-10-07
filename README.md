# SRAGROUP Digital Presence

Build a modern corporate website for SRAGROUP, an Italian B2B company with two divisions: Construction (Costruzioni) and Solar Energy (Fotovoltaico). All text in professional Italian. React, Tailwind, shadcn/ui, React Router. Keep the code simple and reusable.
Design: industrial, clean, premium. Dark charcoal (#0F1115) and off-white (#F5F5F2) base. Construction accent amber (#E8A33D), Solar accent green (#2BB673), used only on each division's sections. Fonts: Space Grotesk for headings, Inter for body. Large Unsplash images of construction sites and solar panels. Fully responsive.
Global: sticky header with uploaded logo, nav (Home, Chi Siamo, Costruzioni, Fotovoltaico, Progetti, Contatti) and button "Richiedi un preventivo". Footer with logo, links, contacts for 3 departments, "P.IVA 00000000000", Privacy and Cookie links.
Pages:
1. Home (/): full-screen split hero, left half Construction, right half Solar, each with title, short line and CTA button. Then stats bar (4 numbers), two division intro sections, 3 featured project cards, certifications strip (ISO 9001, ISO 14001, ISO 45001, SOA), CTA band.
2. Chi Siamo (/chi-siamo): history timeline, mission, certifications, safety and quality standards.
3. Costruzioni (/costruzioni): hero, Industrial/Commercial/Residential cards, services grid, 5-step methodology, CTA.
4. Fotovoltaico (/fotovoltaico): hero, services (commercial PV, solar parks, energy efficiency, maintenance), technical capabilities, process steps, CTA.
5. Progetti (/progetti): filter tabs Tutti / Costruzioni / Fotovoltaico over a grid of 6 sample projects from a local data file (title, location, year, division, metric, image).
6. Contatti (/contatti): 3 department cards, Google Maps iframe, and a quote form: first select division (Generale, Costruzioni, Fotovoltaico). Costruzioni shows project type and area in m². Fotovoltaico shows installation type and kWp. Common fields: name, company, email, phone, message, required GDPR consent checkbox. On submit show a success message only (no backend).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bc1ed59c-d4b7-4d2c-a7d8-2db6be96ee73).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
