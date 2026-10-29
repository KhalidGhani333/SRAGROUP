import condominiFacade from "@/assets/client-oct28/condomini-facade.webp";
import constructionHero from "@/assets/construction-hero.webp";
import projectConstruction from "@/assets/project-construction.webp";
import cBlueprint from "@/assets/c-blueprint.webp";
import cCranes from "@/assets/c-cranes.webp";
import cEngineering from "@/assets/c-engineering.webp";
import cOffice from "@/assets/c-office.webp";
import cOffice2 from "@/assets/c-office-2.webp";
import cResidential from "@/assets/c-residential.webp";
import cSiteAerial from "@/assets/c-site-aerial.webp";
import cSteel from "@/assets/c-steel.webp";
import cWarehouse from "@/assets/c-warehouse.webp";
import cWarehouseInterior from "@/assets/c-warehouse-interior.webp";
import cWorkers from "@/assets/c-workers.webp";
import sEv from "@/assets/s-ev.webp";
import sHardhat from "@/assets/s-hardhat.webp";
import sInstall from "@/assets/s-install.webp";
import sRoofIndustrial from "@/assets/s-roof-industrial.webp";
import sRoofRows from "@/assets/s-roof-rows.webp";
import sStorage from "@/assets/s-storage.webp";
import agrivoltaicLift from "@/assets/project images/agrivoltaic-installation-scissor-lift.jpeg";
import agrivoltaicUnderside from "@/assets/project images/agrivoltaic-structure-underside.jpeg";
import pileDriverSky from "@/assets/project images/pile-driver-blue-sky.jpeg";
import rooftopCabling from "@/assets/project images/rooftop-pv-cable-trays.jpeg";
import mountingStructures from "@/assets/project images/solar-mounting-structures-installation.jpeg";
import parkHills from "@/assets/project images/solar-park-aerial-hills.jpeg";
import fixedBipole from "@/assets/project images/solar-fixed-bipole.jpg";
import trackerAxial from "@/assets/project images/solar-tracker-axial.jpg";
import solarComal from "@/assets/project images/solar-comal-2026.jpg";
import solarPvh from "@/assets/project images/solar-pvh-2026.jpg";
import solarArctech from "@/assets/project images/solar-arctech-2026.jpg";
import solarValmont from "@/assets/project images/solar-valmont-benevento.jpg";
import type { Division, Lang } from "@/i18n/routes";

export type { Division };
export type Localized = { it: string; en: string };
export type ProjectSection = {
  title: Localized;
  paragraphs?: Localized[];
  items?: Localized[];
};
export type ProjectDetail = {
  heading: Localized;
  intro?: Localized;
  facts: { label: Localized; value: Localized }[];
  sections: ProjectSection[];
  plannedQuantities?: { label: Localized; value: Localized }[];
};

/**
 * Shape mirrors a typical headless CMS entry (one document per project, localized fields as
 * objects, media as URLs). To move to a CMS, replace the array below with a fetch and keep
 * getProjects / getProjectBySlug as the only access points.
 */
export type Project = {
  id: string;
  slug: string;
  division: Division;
  title: Localized;
  location: Localized | string;
  year?: number | string;
  metric?: Localized;
  summary: Localized;
  challenge: Localized;
  solution: Localized;
  keyFigures: { label: Localized; value: Localized | string }[];
  coverImage: string;
  gallery: string[];
  featured?: boolean;
  detail?: ProjectDetail;
};

export function localize(value: Localized | string, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

const projects: Project[] = [
  {
    id: "c-001",
    slug: "riqualificazione-energetica-condominiale",
    division: "construction",
    title: {
      it: "Riqualificazione energetica condominiale",
      en: "Residential energy renovation",
    },
    location: {
      it: "Italia",
      en: "Italy",
    },
    metric: {
      it: "55+ condomìni · 100.000+ m² di facciate",
      en: "55+ apartment buildings · 100,000+ m² of façades",
    },
    summary: {
      it: "Un'esperienza consolidata negli interventi di isolamento termico a cappotto e riqualificazione del patrimonio residenziale.",
      en: "Extensive experience in external wall insulation and residential building renovation.",
    },
    challenge: {
      it: "",
      en: "",
    },
    solution: {
      it: "",
      en: "",
    },
    keyFigures: [],
    coverImage: condominiFacade,
    gallery: [],
    featured: true,
    detail: {
      heading: {
        it: "Oltre 55 condomìni. Più di 100.000 m² di facciate.",
        en: "Over 55 apartment buildings. More than 100,000 m² of façades.",
      },
      intro: {
        it: "Un'esperienza consolidata negli interventi di isolamento termico a cappotto e riqualificazione del patrimonio residenziale.",
        en: "Extensive experience in external wall insulation and residential building renovation.",
      },
      facts: [
        {
          label: {
            it: "Condomìni interessati",
            en: "Apartment buildings",
          },
          value: {
            it: "55+",
            en: "55+",
          },
        },
        {
          label: {
            it: "m² di facciate realizzate",
            en: "m² of completed façades",
          },
          value: {
            it: "100.000+",
            en: "100,000+",
          },
        },
      ],
      sections: [
        {
          title: {
            it: "Il progetto",
            en: "The project",
          },
          paragraphs: [
            {
              it: "SRA Costruzioni ha preso parte a un importante programma di riqualificazione energetica del patrimonio edilizio residenziale, intervenendo su oltre 55 condomìni e realizzando più di 100.000 m² di facciate.",
              en: "SRA Costruzioni took part in a major energy renovation programme for residential buildings, working on over 55 apartment buildings and completing more than 100,000 m² of façades.",
            },
            {
              it: "L'esperienza maturata in questi interventi testimonia la capacità dell'azienda di operare su cantieri di diverse dimensioni, attraverso squadre specializzate e una organizzazione strutturata.",
              en: "The experience gained demonstrates the company’s ability to work on sites of different sizes, with specialist teams and a structured organisation.",
            },
          ],
        },
        {
          title: {
            it: "Principali lavorazioni",
            en: "Main activities",
          },
          items: [
            {
              it: "Posa di sistemi di isolamento termico a cappotto.",
              en: "Installation of external thermal insulation systems.",
            },
            {
              it: "Installazione di pannelli isolanti.",
              en: "Installation of insulation panels.",
            },
            {
              it: "Applicazione di rasature armate con reti di rinforzo.",
              en: "Application of reinforced skim coats with reinforcing mesh.",
            },
            {
              it: "Realizzazione di finiture e rivestimenti esterni.",
              en: "Execution of exterior finishes and cladding.",
            },
            {
              it: "Ripristino e riqualificazione delle superfici di facciata.",
              en: "Restoration and renovation of façade surfaces.",
            },
            {
              it: "Lavorazioni complementari di completamento.",
              en: "Associated completion works.",
            },
          ],
        },
        {
          title: {
            it: "Risultati",
            en: "Results",
          },
          paragraphs: [
            {
              it: "Oltre 55 edifici condominiali interessati da interventi di riqualificazione e più di 100.000 m² di facciate realizzate, a dimostrazione dell'esperienza operativa maturata nel settore della riqualificazione edilizia.",
              en: "Over 55 apartment buildings renovated and more than 100,000 m² of façades completed, demonstrating the practical experience gained in building renovation.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "s-001",
    slug: "solar-park-valdichiana",
    division: "solar",
    title: { it: "Impianto Struttura Fissa Bipalo", en: "Fixed Bipole Structure Installation" },
    location: "Roma",
    year: 2026,
    metric: { it: "10 MWp", en: "10 MWp" },
    featured: true,
    summary: {
      it: "Parco fotovoltaico a terra con inseguitori monoassiali, sviluppato dall'autorizzazione alla connessione in alta tensione.",
      en: "A ground-mounted solar park with single-axis trackers, developed from permitting through to high-voltage grid connection.",
    },
    challenge: {
      it: "Un'area agricola collinare con vincoli paesaggistici richiedeva un layout a basso impatto visivo e un iter autorizzativo complesso.",
      en: "Hilly farmland under landscape protection required a low-visual-impact layout and a complex permitting process.",
    },
    solution: {
      it: "Layout modellato sull'orografia, fasce di mitigazione con specie autoctone e sottostazione progettata in house. Connessione completata nei tempi previsti dal gestore di rete.",
      en: "A layout shaped to the terrain, buffer planting with native species and an in-house designed substation. Grid connection was completed within the operator's schedule.",
    },
    keyFigures: [
      {
        label: { it: "Potenza installata", en: "Installed capacity" },
        value: { it: "10 MWp", en: "10 MWp" },
      },
      {
        label: { it: "Produzione annua", en: "Annual output" },
        value: { it: "27 GWh", en: "27 GWh" },
      },
      {
        label: { it: "CO₂ evitata", en: "CO₂ avoided" },
        value: { it: "11.800 t/anno", en: "11,800 t/yr" },
      },
      { label: { it: "Moduli", en: "Modules" }, value: { it: "32.300", en: "32,300" } },
    ],
    coverImage: fixedBipole,
    gallery: [mountingStructures, pileDriverSky],
  },
  {
    id: "c-002",
    slug: "riqualificazione-post-alluvione-acer-faenza",
    division: "construction",
    title: {
      it: "Riqualificazione post-alluvione – 20 alloggi ACER",
      en: "Post-flood renovation – 20 ACER homes",
    },
    location: {
      it: "Faenza (RA)",
      en: "Faenza (RA)",
    },
    metric: {
      it: "20 appartamenti",
      en: "20 apartments",
    },
    summary: {
      it: "SRA Costruzioni ha partecipato agli interventi di ripristino e riqualificazione di 20 alloggi di edilizia residenziale pubblica ACER situati nel Comune di Faenza, interessati da danni provocati dagli eventi alluvionali.",
      en: "SRA Costruzioni took part in the restoration and renovation of 20 ACER public housing apartments in the municipality of Faenza that had been damaged by flooding.",
    },
    challenge: {
      it: "",
      en: "",
    },
    solution: {
      it: "",
      en: "",
    },
    keyFigures: [],
    coverImage: cResidential,
    gallery: [],
    featured: true,
    detail: {
      heading: {
        it: "Ripristino e riqualificazione di 20 alloggi ACER a Faenza",
        en: "Restoration and renovation of 20 ACER homes in Faenza",
      },
      facts: [
        {
          label: {
            it: "Località",
            en: "Location",
          },
          value: {
            it: "Faenza (RA)",
            en: "Faenza (RA)",
          },
        },
        {
          label: {
            it: "Periodo di intervento",
            en: "Work period",
          },
          value: {
            it: "2025–2026",
            en: "2025–2026",
          },
        },
        {
          label: {
            it: "Settore",
            en: "Sector",
          },
          value: {
            it: "Edilizia residenziale pubblica",
            en: "Public housing",
          },
        },
        {
          label: {
            it: "Tipologia",
            en: "Type",
          },
          value: {
            it: "Ripristino post-alluvione e riqualificazione edilizia",
            en: "Post-flood restoration and building renovation",
          },
        },
        {
          label: {
            it: "Unità immobiliari",
            en: "Housing units",
          },
          value: {
            it: "20 appartamenti",
            en: "20 apartments",
          },
        },
      ],
      sections: [
        {
          title: {
            it: "Descrizione del progetto",
            en: "Project description",
          },
          paragraphs: [
            {
              it: "SRA Costruzioni ha partecipato agli interventi di ripristino e riqualificazione di 20 alloggi di edilizia residenziale pubblica ACER situati nel Comune di Faenza, interessati da danni provocati dagli eventi alluvionali.",
              en: "SRA Costruzioni took part in the restoration and renovation of 20 ACER public housing apartments in the municipality of Faenza that had been damaged by flooding.",
            },
            {
              it: "Le lavorazioni, eseguite nel periodo 2025–2026, hanno riguardato un articolato programma di opere edili, finalizzato al recupero degli ambienti abitativi danneggiati e al ripristino delle condizioni di funzionalità e abitabilità degli immobili.",
              en: "The works, carried out in 2025–2026, involved an extensive building programme to recover damaged living spaces and restore the properties to a functional, habitable condition.",
            },
            {
              it: "L'intervento ha previsto una prima fase di demolizione e rimozione delle parti compromesse, seguita dalle opere di ricostruzione, ripristino e finitura degli ambienti interni.",
              en: "An initial phase of demolition and removal of damaged parts was followed by reconstruction, restoration and finishing of the interiors.",
            },
          ],
        },
        {
          title: {
            it: "Principali lavorazioni eseguite",
            en: "Main activities completed",
          },
          items: [
            {
              it: "Demolizione e rimozione delle pavimentazioni esistenti.",
              en: "Demolition and removal of existing flooring.",
            },
            {
              it: "Demolizione e rimozione degli intonaci deteriorati.",
              en: "Demolition and removal of damaged plaster.",
            },
            {
              it: "Preparazione e ripristino dei supporti murari.",
              en: "Preparation and restoration of masonry substrates.",
            },
            {
              it: "Rifacimento degli intonaci interni.",
              en: "Renewal of internal plasterwork.",
            },
            {
              it: "Ripristino dei sottofondi e delle superfici di posa.",
              en: "Restoration of screeds and laying surfaces.",
            },
            {
              it: "Realizzazione delle nuove pavimentazioni.",
              en: "Installation of new flooring.",
            },
            {
              it: "Opere di rasatura, tinteggiatura e finitura.",
              en: "Skim coating, painting and finishing.",
            },
            {
              it: "Lavorazioni edili complementari per il recupero degli alloggi.",
              en: "Associated building works to restore the homes.",
            },
          ],
        },
        {
          title: {
            it: "Esperienza e capacità operativa",
            en: "Experience and operational capability",
          },
          paragraphs: [
            {
              it: "L'intervento rappresenta un'importante esperienza di SRA Costruzioni nel settore del recupero edilizio post-emergenza, evidenziando la capacità dell'impresa di organizzare e gestire lavorazioni articolate su più unità abitative.",
              en: "The project represents important experience for SRA Costruzioni in post-emergency building restoration, demonstrating its ability to organise and manage complex works across multiple homes.",
            },
            {
              it: "Un progetto che testimonia il nostro impegno nella riqualificazione del patrimonio residenziale pubblico e nel recupero di edifici danneggiati da eventi straordinari.",
              en: "A project that reflects our commitment to renovating public housing and restoring buildings damaged by exceptional events.",
            },
          ],
        },
      ],
    },
    year: "2025–2026",
  },
  {
    id: "s-002",
    slug: "copertura-industriale-bergamo",
    division: "solar",
    title: { it: "Revamping Industriale", en: "Industrial Revamping" },
    location: "Bergamo",
    year: 2026,
    metric: { it: "2,8 MWp", en: "2.8 MWp" },
    summary: {
      it: "Impianto in autoconsumo sulla copertura di uno stabilimento metalmeccanico, con rifacimento del tetto e rimozione dell'amianto.",
      en: "A self-consumption system on the roof of a metalworking plant, including roof replacement and asbestos removal.",
    },
    challenge: {
      it: "La produzione non poteva fermarsi e la copertura esistente in cemento-amianto andava bonificata prima dell'installazione.",
      en: "Production could not stop, and the existing asbestos-cement roof had to be removed before installation.",
    },
    solution: {
      it: "Intervento per campate con bonifica, nuova copertura e posa dei moduli in sequenza, coordinando divisione Costruzioni e Fotovoltaico sotto un'unica regia.",
      en: "Bay-by-bay works covering removal, new roofing and module installation in sequence, with the Construction and Solar divisions under a single site management.",
    },
    keyFigures: [
      { label: { it: "Potenza", en: "Capacity" }, value: { it: "2,8 MWp", en: "2.8 MWp" } },
      { label: { it: "Autoconsumo", en: "Self-consumption" }, value: "78%" },
      {
        label: { it: "Rientro stimato", en: "Estimated payback" },
        value: { it: "5,5 anni", en: "5.5 years" },
      },
      {
        label: { it: "Amianto bonificato", en: "Asbestos removed" },
        value: { it: "21.000 m²", en: "21,000 m²" },
      },
    ],
    coverImage: rooftopCabling,
    gallery: [sRoofIndustrial, sRoofRows, sHardhat],
  },
  {
    id: "c-003",
    slug: "idroscarifica-silos-industriali-vicenza",
    division: "construction",
    title: {
      it: "Intervento di idroscarifica su silos industriali",
      en: "Hydrodemolition of industrial silos",
    },
    location: {
      it: "Vicenza (VI)",
      en: "Vicenza (VI)",
    },
    metric: {
      it: "16.000 m²",
      en: "16,000 m²",
    },
    summary: {
      it: "SRA Costruzioni ha eseguito un importante intervento specialistico di idroscarifica su strutture industriali a silos, per una superficie complessiva di circa 16.000 m².",
      en: "SRA Costruzioni carried out a major specialist hydrodemolition project on industrial silo structures, covering a total area of approximately 16,000 m².",
    },
    challenge: {
      it: "",
      en: "",
    },
    solution: {
      it: "",
      en: "",
    },
    keyFigures: [],
    coverImage: cWarehouse,
    gallery: [],
    detail: {
      heading: {
        it: "Intervento specialistico di idroscarifica su silos industriali",
        en: "Specialist hydrodemolition of industrial silos",
      },
      facts: [
        {
          label: {
            it: "Località",
            en: "Location",
          },
          value: {
            it: "Vicenza (VI)",
            en: "Vicenza (VI)",
          },
        },
        {
          label: {
            it: "Settore",
            en: "Sector",
          },
          value: {
            it: "Edilizia industriale",
            en: "Industrial construction",
          },
        },
        {
          label: {
            it: "Tipologia",
            en: "Type",
          },
          value: {
            it: "Idroscarifica e trattamento delle superfici",
            en: "Hydrodemolition and surface treatment",
          },
        },
        {
          label: {
            it: "Superficie di intervento",
            en: "Work area",
          },
          value: {
            it: "Circa 16.000 m²",
            en: "Approximately 16,000 m²",
          },
        },
        {
          label: {
            it: "Esecuzione",
            en: "Delivery",
          },
          value: {
            it: "In subappalto",
            en: "Subcontracted works",
          },
        },
      ],
      sections: [
        {
          title: {
            it: "Descrizione del progetto",
            en: "Project description",
          },
          paragraphs: [
            {
              it: "SRA Costruzioni ha eseguito un importante intervento specialistico di idroscarifica su strutture industriali a silos, per una superficie complessiva di circa 16.000 m².",
              en: "SRA Costruzioni carried out a major specialist hydrodemolition project on industrial silo structures, covering a total area of approximately 16,000 m².",
            },
            {
              it: "Le lavorazioni hanno riguardato il trattamento delle superfici mediante idroscarifica, nell'ambito delle attività di preparazione e riqualificazione delle strutture esistenti.",
              en: "The works involved treating surfaces by hydrodemolition as part of the preparation and renovation of the existing structures.",
            },
            {
              it: "L'intervento rappresenta un'esperienza significativa nel settore delle lavorazioni industriali specialistiche, evidenziando la capacità operativa di SRA Costruzioni nella gestione di attività su superfici estese e in contesti tecnicamente impegnativi.",
              en: "The project represents significant experience in specialist industrial works, demonstrating SRA Costruzioni’s operational capability on extensive surfaces and in technically demanding environments.",
            },
          ],
        },
        {
          title: {
            it: "Lavorazioni principali",
            en: "Main activities",
          },
          items: [
            {
              it: "Interventi di idroscarifica sulle superfici dei silos.",
              en: "Hydrodemolition of silo surfaces.",
            },
            {
              it: "Trattamento e preparazione delle superfici esistenti.",
              en: "Treatment and preparation of existing surfaces.",
            },
            {
              it: "Organizzazione delle lavorazioni su un'estensione complessiva di circa 16.000 m².",
              en: "Organisation of works over a total area of approximately 16,000 m².",
            },
          ],
        },
        {
          title: {
            it: "Il nostro contributo",
            en: "Our contribution",
          },
          paragraphs: [
            {
              it: "Attraverso l'impiego di personale operativo e un'adeguata organizzazione delle attività, SRA Costruzioni ha contribuito all'esecuzione dell'intervento per conto dell'impresa appaltatrice, consolidando la propria esperienza nelle lavorazioni specialistiche in ambito industriale.",
              en: "With operational staff and organised activities, SRA Costruzioni contributed to delivering the works on behalf of the main contractor, strengthening its experience in specialist industrial construction.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "s-003",
    slug: "agrivoltaico-foggia",
    division: "solar",
    title: { it: "Agrivoltaico PVH", en: "PVH Agrivoltaic" },
    location: "Caserta",
    year: 2026,
    metric: { it: "7,3 MWp", en: "7.3 MWp" },
    summary: {
      it: "Impianto agrivoltaico elevato che mantiene la coltivazione sotto i moduli, con monitoraggio agronomico integrato.",
      en: "An elevated agrivoltaic plant that keeps crops growing beneath the modules, with integrated agronomic monitoring.",
    },
    challenge: {
      it: "Conciliare produzione energetica e continuità agricola, rispettando i requisiti delle linee guida nazionali sull'agrivoltaico.",
      en: "Balancing energy production with continued farming while meeting national agrivoltaic guidelines.",
    },
    solution: {
      it: "Strutture rialzate a interfila ampia, scelte con l'azienda agricola, e sensori microclimatici per misurare resa e consumo idrico.",
      en: "Raised structures with wide row spacing, chosen together with the farm, plus microclimate sensors to track yield and water use.",
    },
    keyFigures: [
      { label: { it: "Potenza", en: "Capacity" }, value: { it: "7,3 MWp", en: "7.3 MWp" } },
      { label: { it: "Superficie agricola", en: "Farmland retained" }, value: "92%" },
      {
        label: { it: "Produzione annua", en: "Annual output" },
        value: { it: "15,2 GWh", en: "15.2 GWh" },
      },
      {
        label: { it: "Altezza strutture", en: "Structure height" },
        value: { it: "2,6 m", en: "2.6 m" },
      },
    ],
    coverImage: solarPvh,
    gallery: [agrivoltaicUnderside],
  },
  {
    id: "c-004",
    slug: "consolidamento-rinforzo-strutturale",
    division: "construction",
    title: {
      it: "Interventi di consolidamento e rinforzo strutturale",
      en: "Structural consolidation and strengthening",
    },
    location: {
      it: "Cantieri in tutta Italia",
      en: "Sites across Italy",
    },
    summary: {
      it: "SRA Costruzioni ha maturato una significativa esperienza nell'esecuzione di interventi di consolidamento e rinforzo strutturale su edifici esistenti, operando in diversi cantieri distribuiti sul territorio nazionale.",
      en: "SRA Costruzioni has gained significant experience in consolidation and structural strengthening of existing buildings at sites across Italy.",
    },
    challenge: {
      it: "",
      en: "",
    },
    solution: {
      it: "",
      en: "",
    },
    keyFigures: [],
    coverImage: cEngineering,
    gallery: [],
    detail: {
      heading: {
        it: "Consolidamento e rinforzo strutturale degli edifici",
        en: "Structural consolidation and strengthening of buildings",
      },
      facts: [
        {
          label: {
            it: "Settore",
            en: "Sector",
          },
          value: {
            it: "Edilizia e consolidamento strutturale",
            en: "Construction and structural consolidation",
          },
        },
        {
          label: {
            it: "Località",
            en: "Location",
          },
          value: {
            it: "Diverse regioni d'Italia",
            en: "Various regions of Italy",
          },
        },
        {
          label: {
            it: "Tipologia",
            en: "Type",
          },
          value: {
            it: "Interventi di rinforzo e miglioramento sismico",
            en: "Strengthening and seismic improvement works",
          },
        },
      ],
      sections: [
        {
          title: {
            it: "Descrizione del progetto",
            en: "Project description",
          },
          paragraphs: [
            {
              it: "SRA Costruzioni ha maturato una significativa esperienza nell'esecuzione di interventi di consolidamento e rinforzo strutturale su edifici esistenti, operando in diversi cantieri distribuiti sul territorio nazionale.",
              en: "SRA Costruzioni has gained significant experience in consolidation and structural strengthening of existing buildings at sites across Italy.",
            },
            {
              it: "Le lavorazioni hanno riguardato principalmente la realizzazione di intonaci armati e sistemi di rinforzo strutturale, nell'ambito di interventi finalizzati al miglioramento delle prestazioni meccaniche e della sicurezza degli edifici.",
              en: "The works mainly involved reinforced render and structural strengthening systems, as part of projects to improve the mechanical performance and safety of buildings.",
            },
            {
              it: "Grazie all'impiego di squadre specializzate e a un'organizzazione operativa flessibile, l'azienda è in grado di affrontare lavorazioni tecnicamente complesse su immobili residenziali e altre tipologie di strutture.",
              en: "With specialist teams and a flexible operational organisation, the company can undertake technically complex works on residential buildings and other structures.",
            },
          ],
        },
        {
          title: {
            it: "Principali lavorazioni",
            en: "Main activities",
          },
          items: [
            {
              it: "Realizzazione di intonaci armati strutturali.",
              en: "Application of structural reinforced render.",
            },
            {
              it: "Posa di reti di rinforzo strutturale.",
              en: "Installation of structural reinforcing mesh.",
            },
            {
              it: "Applicazione di malte strutturali.",
              en: "Application of structural mortars.",
            },
            {
              it: "Installazione di connettori e sistemi di collegamento.",
              en: "Installation of connectors and connection systems.",
            },
            {
              it: "Realizzazione di rinforzi mediante barre e fiocchi strutturali.",
              en: "Strengthening using structural bars and fibre anchors.",
            },
            {
              it: "Preparazione e ripristino delle superfici murarie.",
              en: "Preparation and restoration of masonry surfaces.",
            },
            {
              it: "Opere complementari di consolidamento e ripristino.",
              en: "Associated consolidation and restoration works.",
            },
          ],
        },
        {
          title: {
            it: "La nostra esperienza",
            en: "Our experience",
          },
          paragraphs: [
            {
              it: "Gli interventi eseguiti in diverse località italiane testimoniano la competenza di SRA Costruzioni nelle lavorazioni di consolidamento e rinforzo strutturale, con particolare attenzione alla qualità esecutiva, al rispetto delle prescrizioni progettuali e alla corretta realizzazione delle opere.",
              en: "Works carried out in various Italian locations demonstrate SRA Costruzioni’s expertise in consolidation and structural strengthening, with particular attention to workmanship, design requirements and correct execution.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "s-004",
    slug: "polo-logistico-verona-storage",
    division: "solar",
    title: { it: "Tracker Axial", en: "Axial Tracker" },
    location: "Avellino",
    year: 2026,
    metric: { it: "8,5 MWp", en: "8.5 MWp" },
    featured: false,
    summary: {
      it: "Impianto su copertura con sistema di accumulo e 40 punti di ricarica per la flotta elettrica aziendale.",
      en: "A rooftop system with battery storage and 40 charging points for the company's electric fleet.",
    },
    challenge: {
      it: "Ricaricare la flotta di notte senza aumentare la potenza impegnata e senza picchi in bolletta.",
      en: "Charging the fleet overnight without raising contracted power or creating demand peaks.",
    },
    solution: {
      it: "Accumulo dimensionato sui profili di carico reali e gestione energetica che sposta la produzione diurna verso la ricarica notturna.",
      en: "Storage sized on real load profiles, with energy management shifting daytime generation to overnight charging.",
    },
    keyFigures: [
      { label: { it: "Fotovoltaico", en: "Solar" }, value: { it: "8,5 MWp", en: "8.5 MWp" } },
      { label: { it: "Accumulo", en: "Storage" }, value: "2 MWh" },
      { label: { it: "Punti di ricarica", en: "Charging points" }, value: "40" },
      { label: { it: "Riduzione costi energia", en: "Energy cost reduction" }, value: "-46%" },
    ],
    coverImage: trackerAxial,
    gallery: [sStorage, sEv, sInstall],
  },
  {
    id: "c-005",
    slug: "sicurezza-solai-antincendio-gorizia",
    division: "construction",
    title: {
      it: "Messa in sicurezza dei solai e adeguamento antincendio",
      en: "Floor slab safety and fire protection upgrades",
    },
    location: {
      it: "Gorizia (GO)",
      en: "Gorizia (GO)",
    },
    summary: {
      it: "SRA Costruzioni ha operato nell'ambito degli interventi di messa in sicurezza e adeguamento antincendio dei soffitti e controsoffitti del Liceo Scientifico “Duca degli Abruzzi” di Gorizia.",
      en: "SRA Costruzioni worked on safety and fire protection upgrades to ceilings and suspended ceilings at the “Duca degli Abruzzi” Science High School in Gorizia.",
    },
    challenge: {
      it: "",
      en: "",
    },
    solution: {
      it: "",
      en: "",
    },
    keyFigures: [],
    coverImage: cOffice2,
    gallery: [],
    detail: {
      heading: {
        it: "Riqualificazione e messa in sicurezza dei soffitti scolastici",
        en: "Renovation and safety upgrades to school ceilings",
      },
      facts: [
        {
          label: {
            it: "Località",
            en: "Location",
          },
          value: {
            it: "Gorizia (GO)",
            en: "Gorizia (GO)",
          },
        },
        {
          label: {
            it: "Edificio",
            en: "Building",
          },
          value: {
            it: "Liceo Scientifico “Duca degli Abruzzi” – Succursale di Via Randaccio",
            en: "“Duca degli Abruzzi” Science High School – Via Randaccio branch",
          },
        },
        {
          label: {
            it: "Settore",
            en: "Sector",
          },
          value: {
            it: "Edilizia pubblica e scolastica",
            en: "Public and school construction",
          },
        },
        {
          label: {
            it: "Tipologia",
            en: "Type",
          },
          value: {
            it: "Messa in sicurezza dei solai, sistemi antisfondellamento e adeguamento antincendio",
            en: "Floor slab safety, ceiling collapse prevention systems and fire protection upgrades",
          },
        },
      ],
      sections: [
        {
          title: {
            it: "Descrizione del progetto",
            en: "Project description",
          },
          paragraphs: [
            {
              it: "SRA Costruzioni ha operato nell'ambito degli interventi di messa in sicurezza e adeguamento antincendio dei soffitti e controsoffitti del Liceo Scientifico “Duca degli Abruzzi” di Gorizia.",
              en: "SRA Costruzioni worked on safety and fire protection upgrades to ceilings and suspended ceilings at the “Duca degli Abruzzi” Science High School in Gorizia.",
            },
            {
              it: "Le lavorazioni hanno interessato il ripristino e la riqualificazione dei soffitti esistenti, con l'installazione di sistemi antisfondellamento, controsoffitti e soluzioni tecniche per la protezione antincendio.",
              en: "The works involved restoring and renovating existing ceilings, installing ceiling collapse prevention systems, suspended ceilings and technical fire protection solutions.",
            },
            {
              it: "L'intervento ha richiesto lavorazioni specialistiche, con particolare attenzione alla sicurezza degli ambienti scolastici e al rispetto delle prescrizioni tecniche di progetto.",
              en: "The project required specialist works, with particular attention to school safety and compliance with the technical design requirements.",
            },
          ],
        },
        {
          title: {
            it: "Principali lavorazioni",
            en: "Main activities",
          },
          items: [
            {
              it: "Demolizione e rimozione dei soffitti e controsoffitti esistenti.",
              en: "Demolition and removal of existing ceilings and suspended ceilings.",
            },
            {
              it: "Installazione di sistemi antisfondellamento dei solai.",
              en: "Installation of floor slab ceiling collapse prevention systems.",
            },
            {
              it: "Posa di reti e sistemi di rinforzo in materiale composito.",
              en: "Installation of composite mesh and reinforcement systems.",
            },
            {
              it: "Realizzazione di controsoffitti in cartongesso, anche con caratteristiche antincendio.",
              en: "Installation of plasterboard suspended ceilings, including fire resistant systems.",
            },
            {
              it: "Installazione di strutture metalliche di sostegno dei controsoffitti.",
              en: "Installation of metal support structures for suspended ceilings.",
            },
            {
              it: "Realizzazione di controsoffitti modulari con pannelli in fibra minerale.",
              en: "Installation of modular suspended ceilings with mineral fibre panels.",
            },
            {
              it: "Applicazione di sistemi protettivi intumescenti.",
              en: "Application of intumescent protection systems.",
            },
            {
              it: "Realizzazione di botole e accessi per ispezione e manutenzione.",
              en: "Provision of hatches and access for inspection and maintenance.",
            },
            {
              it: "Opere complementari di ripristino e finitura.",
              en: "Associated restoration and finishing works.",
            },
          ],
        },
        {
          title: {
            it: "Il nostro contributo",
            en: "Our contribution",
          },
          paragraphs: [
            {
              it: "L'intervento rappresenta una referenza significativa nell'ambito dell'edilizia pubblica, valorizzando le competenze di SRA Costruzioni nella realizzazione di sistemi di protezione dei solai, controsoffittature tecniche e opere di adeguamento antincendio.",
              en: "The project is a significant reference in public construction, highlighting SRA Costruzioni’s expertise in floor slab protection systems, technical suspended ceilings and fire protection upgrades.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "s-005",
    slug: "impianto-fotovoltaico-salerno",
    division: "solar",
    title: { it: "Agrivoltaico Arctech Solar", en: "Arctech Solar Agrivoltaic" },
    location: "Rovigo",
    year: 2026,
    metric: { it: "5,2 MWp", en: "5.2 MWp" },
    summary: {
      it: "Impianto agrivoltaico Arctech Solar a Rovigo.",
      en: "Arctech Solar agrivoltaic installation in Rovigo.",
    },
    challenge: { it: "", en: "" },
    solution: { it: "", en: "" },
    keyFigures: [],
    coverImage: solarArctech,
    gallery: [],
  },
  {
    id: "c-006",
    slug: "coperture-residenziali-san-lazzaro",
    division: "construction",
    title: {
      it: "Rifacimento e riqualificazione di coperture residenziali",
      en: "Residential roof renewal and renovation",
    },
    location: {
      it: "San Lazzaro di Savena (BO)",
      en: "San Lazzaro di Savena (BO)",
    },
    summary: {
      it: "SRA Costruzioni ha operato nell'ambito di interventi di riqualificazione delle coperture residenziali, occupandosi delle principali lavorazioni edili necessarie al ripristino e al rifacimento dei sistemi di copertura.",
      en: "SRA Costruzioni worked on residential roof renovation, carrying out the main building activities needed to restore and renew roofing systems.",
    },
    challenge: {
      it: "",
      en: "",
    },
    solution: {
      it: "",
      en: "",
    },
    keyFigures: [],
    coverImage: cResidential,
    gallery: [],
    detail: {
      heading: {
        it: "Rifacimento e riqualificazione delle coperture",
        en: "Roof renewal and renovation",
      },
      facts: [
        {
          label: {
            it: "Località",
            en: "Location",
          },
          value: {
            it: "San Lazzaro di Savena (BO)",
            en: "San Lazzaro di Savena (BO)",
          },
        },
      ],
      sections: [
        {
          title: {
            it: "Descrizione del progetto",
            en: "Project description",
          },
          paragraphs: [
            {
              it: "SRA Costruzioni ha operato nell'ambito di interventi di riqualificazione delle coperture residenziali, occupandosi delle principali lavorazioni edili necessarie al ripristino e al rifacimento dei sistemi di copertura.",
              en: "SRA Costruzioni worked on residential roof renovation, carrying out the main building activities needed to restore and renew roofing systems.",
            },
            {
              it: "Le attività comprendono la rimozione degli elementi esistenti, la realizzazione di sistemi impermeabilizzanti, la posa di nuovi manti di copertura e le opere complementari di lattoneria.",
              en: "Activities include removing existing elements, installing waterproofing systems, laying new roof coverings and associated sheet metal work.",
            },
          ],
        },
        {
          title: {
            it: "Principali lavorazioni",
            en: "Main activities",
          },
          items: [
            {
              it: "Rimozione e smontaggio delle coperture esistenti.",
              en: "Removal and dismantling of existing roof coverings.",
            },
            {
              it: "Preparazione dei supporti.",
              en: "Preparation of substrates.",
            },
            {
              it: "Posa di membrane impermeabilizzanti.",
              en: "Installation of waterproofing membranes.",
            },
            {
              it: "Rifacimento del manto di copertura con tegole.",
              en: "Renewal of tiled roof coverings.",
            },
            {
              it: "Installazione di converse e scossaline.",
              en: "Installation of roof junction flashings and cover flashings.",
            },
            {
              it: "Posa e sostituzione di gronde e lattonerie.",
              en: "Installation and replacement of gutters and sheet metal components.",
            },
            {
              it: "Opere complementari di finitura.",
              en: "Associated finishing works.",
            },
          ],
        },
        {
          title: {
            it: "Competenze operative",
            en: "Operational expertise",
          },
          paragraphs: [
            {
              it: "L'esperienza maturata nel settore delle coperture consente a SRA Costruzioni di affrontare interventi di manutenzione straordinaria e riqualificazione, con particolare attenzione all'impermeabilizzazione, alla protezione degli edifici e alla durabilità delle opere.",
              en: "Experience in roofing enables SRA Costruzioni to undertake major maintenance and renovation projects, with particular attention to waterproofing, building protection and durability.",
            },
          ],
        },
      ],
      plannedQuantities: [
        {
          label: {
            it: "Superficie copertura",
            en: "Roof area",
          },
          value: {
            it: "939 m²",
            en: "939 m²",
          },
        },
        {
          label: {
            it: "Converse",
            en: "Roof junction flashings",
          },
          value: {
            it: "10 pezzi",
            en: "10 pieces",
          },
        },
        {
          label: {
            it: "Gronde",
            en: "Gutters",
          },
          value: {
            it: "168 metri lineari",
            en: "168 linear metres",
          },
        },
        {
          label: {
            it: "Lattonerie",
            en: "Sheet metal work",
          },
          value: {
            it: "307 metri lineari",
            en: "307 linear metres",
          },
        },
      ],
    },
  },
  {
    id: "s-006",
    slug: "impianto-fotovoltaico-alessandria",
    division: "solar",
    title: { it: "Tracker Comal", en: "Comal Tracker" },
    location: "Rovigo",
    year: 2026,
    metric: { it: "7,3 MWp", en: "7.3 MWp" },
    summary: {
      it: "Impianto fotovoltaico con tracker Comal a Rovigo.",
      en: "Solar installation with Comal trackers in Rovigo.",
    },
    challenge: { it: "", en: "" },
    solution: { it: "", en: "" },
    keyFigures: [],
    coverImage: solarComal,
    gallery: [],
  },
  {
    id: "s-007",
    slug: "agrivoltaico-valmont-benevento",
    division: "solar",
    title: { it: "Agrivoltaico Valmont", en: "Valmont Agrivoltaic" },
    location: "Benevento",
    year: 2026,
    metric: { it: "10 MWp", en: "10 MWp" },
    summary: {
      it: "Impianto agrivoltaico Valmont a Benevento.",
      en: "Valmont agrivoltaic installation in Benevento.",
    },
    challenge: { it: "", en: "" },
    solution: { it: "", en: "" },
    keyFigures: [{ label: { it: "Potenza", en: "Capacity" }, value: "10 MWp" }],
    coverImage: solarValmont,
    gallery: [],
  },
];

export function getProjects(division?: Division): Project[] {
  if (division) return projects.filter((p) => p.division === division);
  const solar = getProjects("solar");
  const construction = getProjects("construction");
  // Mix divisions in the full portfolio while preserving each division's sequence.
  return Array.from({ length: Math.max(solar.length, construction.length) }, (_, i) => [
    solar[i],
    construction[i],
  ]).flatMap((pair) => pair.filter((project): project is Project => Boolean(project)));
}

export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug && project.detail);
}
