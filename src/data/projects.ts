import constructionHero from "@/assets/construction-hero.webp";
import projectConstruction from "@/assets/project-construction.webp";
import projectSolar from "@/assets/project-solar.webp";
import solarHero from "@/assets/solar-hero.webp";
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
import sField from "@/assets/s-field.webp";
import sHardhat from "@/assets/s-hardhat.webp";
import sInstall from "@/assets/s-install.webp";
import sPark from "@/assets/s-park.webp";
import sRoofIndustrial from "@/assets/s-roof-industrial.webp";
import sRoofRows from "@/assets/s-roof-rows.webp";
import sRows from "@/assets/s-rows.webp";
import sStorage from "@/assets/s-storage.webp";
import type { Division, Lang } from "@/i18n/routes";

export type { Division };
export type Localized = { it: string; en: string };

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
  location: string;
  year: number;
  metric: Localized;
  summary: Localized;
  challenge: Localized;
  solution: Localized;
  keyFigures: { label: Localized; value: Localized | string }[];
  coverImage: string;
  gallery: string[];
  featured?: boolean;
};

export function localize(value: Localized | string, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

const projects: Project[] = [
  {
    id: "c-001",
    slug: "hub-logistico-piacenza",
    division: "construction",
    title: { it: "Hub logistico Nord", en: "North Logistics Hub" },
    location: "Piacenza",
    year: 2026,
    metric: { it: "42.000 m²", en: "42,000 m²" },
    featured: true,
    summary: {
      it: "Nuovo polo logistico di classe A con uffici integrati, realizzato chiavi in mano per un operatore della distribuzione.",
      en: "A new grade-A logistics hub with integrated offices, delivered turnkey for a distribution operator.",
    },
    challenge: {
      it: "Il cliente doveva rendere operativo il magazzino prima del picco stagionale, su un'area con terreni eterogenei e vincoli idraulici stringenti.",
      en: "The client needed the warehouse operational before peak season, on a site with mixed ground conditions and strict drainage constraints.",
    },
    solution: {
      it: "Abbiamo combinato strutture prefabbricate in calcestruzzo con un cantiere organizzato per fasi parallele, anticipando le opere idrauliche e consegnando i primi 20.000 m² con sei settimane di anticipo.",
      en: "We combined precast concrete structures with a site organised in parallel phases, front-loading the drainage works and handing over the first 20,000 m² six weeks early.",
    },
    keyFigures: [
      {
        label: { it: "Superficie coperta", en: "Covered area" },
        value: { it: "42.000 m²", en: "42,000 m²" },
      },
      { label: { it: "Baie di carico", en: "Loading bays" }, value: "64" },
      {
        label: { it: "Durata lavori", en: "Build time" },
        value: { it: "14 mesi", en: "14 months" },
      },
      { label: { it: "Certificazione", en: "Certification" }, value: "LEED Gold" },
    ],
    coverImage: cWarehouse,
    gallery: [cWarehouseInterior, cSiteAerial, projectConstruction],
  },
  {
    id: "s-001",
    slug: "solar-park-valdichiana",
    division: "solar",
    title: { it: "Solar Park Valdichiana", en: "Valdichiana Solar Park" },
    location: "Arezzo",
    year: 2025,
    metric: { it: "18,4 MWp", en: "18.4 MWp" },
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
        value: { it: "18,4 MWp", en: "18.4 MWp" },
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
    coverImage: sField,
    gallery: [sRows, sPark, sInstall],
  },
  {
    id: "c-002",
    slug: "campus-direzionale-milano",
    division: "construction",
    title: { it: "Campus direzionale", en: "Corporate Office Campus" },
    location: "Milano",
    year: 2025,
    metric: { it: "16.800 m²", en: "16,800 m²" },
    featured: true,
    summary: {
      it: "Tre edifici per uffici ad alta efficienza energetica con piazza pedonale e parcheggi interrati.",
      en: "Three high-efficiency office buildings with a pedestrian plaza and underground parking.",
    },
    challenge: {
      it: "Cantiere in pieno contesto urbano, con edifici confinanti abitati e una finestra di consegna legata al trasferimento della sede del cliente.",
      en: "A dense urban site next to occupied buildings, with a handover date tied to the client's headquarters move.",
    },
    solution: {
      it: "Paratie e scavi monitorati in continuo, logistica di cantiere notturna e progettazione BIM coordinata tra strutture e impianti per eliminare le interferenze prima dell'esecuzione.",
      en: "Continuously monitored retaining walls and excavation, night-time site logistics and coordinated BIM design across structure and MEP to clear clashes before construction.",
    },
    keyFigures: [
      {
        label: { it: "Superficie lorda", en: "Gross floor area" },
        value: { it: "16.800 m²", en: "16,800 m²" },
      },
      { label: { it: "Piani interrati", en: "Basement levels" }, value: "2" },
      { label: { it: "Classe energetica", en: "Energy class" }, value: "A4" },
      {
        label: { it: "Ore senza infortuni", en: "Injury-free hours" },
        value: { it: "310.000", en: "310,000" },
      },
    ],
    coverImage: cOffice,
    gallery: [cOffice2, cBlueprint, constructionHero],
  },
  {
    id: "s-002",
    slug: "copertura-industriale-bergamo",
    division: "solar",
    title: { it: "Copertura industriale", en: "Industrial Rooftop" },
    location: "Bergamo",
    year: 2025,
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
    coverImage: sRoofIndustrial,
    gallery: [sRoofRows, sHardhat, projectSolar],
  },
  {
    id: "c-003",
    slug: "residenze-porta-est-bologna",
    division: "construction",
    title: { it: "Residenze Porta Est", en: "Porta Est Residences" },
    location: "Bologna",
    year: 2024,
    metric: { it: "96 unità", en: "96 units" },
    summary: {
      it: "Complesso residenziale in classe A con spazi comuni, verde condominiale e impianti a pompa di calore.",
      en: "A class-A residential complex with shared amenities, landscaped gardens and heat-pump systems.",
    },
    challenge: {
      it: "Rispettare un budget chiuso garantendo finiture di qualità e i requisiti energetici più recenti.",
      en: "Holding a fixed budget while delivering quality finishes and the latest energy requirements.",
    },
    solution: {
      it: "Ingegneria del valore in fase di progetto, strutture in calcestruzzo armato ottimizzate e capitolati condivisi con il committente fin dall'inizio.",
      en: "Value engineering at design stage, optimised reinforced concrete structures and specifications agreed with the client from day one.",
    },
    keyFigures: [
      { label: { it: "Alloggi", en: "Homes" }, value: "96" },
      { label: { it: "Superficie", en: "Floor area" }, value: { it: "9.400 m²", en: "9,400 m²" } },
      { label: { it: "Classe energetica", en: "Energy class" }, value: "A" },
      { label: { it: "Scostamento budget", en: "Budget variance" }, value: "0%" },
    ],
    coverImage: cResidential,
    gallery: [cCranes, cWorkers, cEngineering],
  },
  {
    id: "s-003",
    slug: "agrivoltaico-foggia",
    division: "solar",
    title: { it: "Impianto agrivoltaico", en: "Agrivoltaic Plant" },
    location: "Foggia",
    year: 2024,
    metric: { it: "9,6 MWp", en: "9.6 MWp" },
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
      { label: { it: "Potenza", en: "Capacity" }, value: { it: "9,6 MWp", en: "9.6 MWp" } },
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
    coverImage: solarHero,
    gallery: [sPark, sRows, sField],
  },
  {
    id: "c-004",
    slug: "polo-produttivo-brescia",
    division: "construction",
    title: { it: "Polo produttivo", en: "Manufacturing Plant" },
    location: "Brescia",
    year: 2025,
    metric: { it: "23.500 m²", en: "23,500 m²" },
    summary: {
      it: "Nuovo stabilimento in carpenteria metallica con carroponti, uffici tecnici e aree di collaudo.",
      en: "A new steel-framed plant with overhead cranes, engineering offices and testing areas.",
    },
    challenge: {
      it: "Luci strutturali ampie per carroponti da 32 t e un cronoprogramma vincolato all'arrivo delle nuove linee produttive.",
      en: "Long spans for 32 t overhead cranes and a schedule locked to the arrival of new production lines.",
    },
    solution: {
      it: "Progetto integrato strutture-impianti, prefabbricazione in officina delle travi reticolari e montaggio in sequenza con due autogru dedicate.",
      en: "Integrated structural and MEP design, shop-fabricated trusses and sequenced erection with two dedicated mobile cranes.",
    },
    keyFigures: [
      {
        label: { it: "Superficie", en: "Floor area" },
        value: { it: "23.500 m²", en: "23,500 m²" },
      },
      {
        label: { it: "Acciaio strutturale", en: "Structural steel" },
        value: { it: "1.850 t", en: "1,850 t" },
      },
      { label: { it: "Luce massima", en: "Max span" }, value: "36 m" },
      { label: { it: "Portata carroponti", en: "Crane capacity" }, value: "32 t" },
    ],
    coverImage: projectConstruction,
    gallery: [cSteel, cWorkers, cSiteAerial],
  },
  {
    id: "s-004",
    slug: "polo-logistico-verona-storage",
    division: "solar",
    title: { it: "Polo logistico con accumulo", en: "Logistics Hub with Storage" },
    location: "Verona",
    year: 2026,
    metric: { it: "1,2 MWp + 2 MWh", en: "1.2 MWp + 2 MWh" },
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
      { label: { it: "Fotovoltaico", en: "Solar" }, value: { it: "1,2 MWp", en: "1.2 MWp" } },
      { label: { it: "Accumulo", en: "Storage" }, value: "2 MWh" },
      { label: { it: "Punti di ricarica", en: "Charging points" }, value: "40" },
      { label: { it: "Riduzione costi energia", en: "Energy cost reduction" }, value: "-46%" },
    ],
    coverImage: sRoofRows,
    gallery: [sStorage, sEv, sInstall],
  },
];

export function getProjects(division?: Division): Project[] {
  return division ? projects.filter((p) => p.division === division) : projects;
}

export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Previous and next project in list order, wrapping around. */
export function getAdjacentProjects(slug: string): { prev: Project; next: Project } | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  const at = (i: number) => projects[(i + projects.length) % projects.length] as Project;
  return { prev: at(index - 1), next: at(index + 1) };
}
