import constructionHero from "@/assets/construction-hero.webp";
import solarHero from "@/assets/heroes/solarHome-1600.webp";
import solarPageHero from "@/assets/heroes/solar-1600.webp";
import constructionSmall from "@/assets/heroes/construction-768.webp";
import solarHomeSmall from "@/assets/heroes/solarHome-768.webp";
import solarSmall from "@/assets/heroes/solar-768.webp";
import aboutSmall from "@/assets/heroes/about-768.webp";
import projectsSmall from "@/assets/heroes/projects-768.webp";
import contactSmall from "@/assets/heroes/contact-768.webp";
import legalSmall from "@/assets/heroes/legal-768.webp";
import solarHomeAvif from "@/assets/heroes/solarHome-full.avif";
import solarHomeAvifSmall from "@/assets/heroes/solarHome-small.avif";
import solarAvif from "@/assets/heroes/solar-full.avif";
import solarAvifSmall from "@/assets/heroes/solar-small.avif";
import solarDivision from "@/assets/project images/solar-park-aerial-farmland.jpeg";
import solarCta from "@/assets/project images/ground-mounted-pv-urban-wide.jpeg";
import cBlueprint from "@/assets/c-blueprint.webp";
import cSiteAerial from "@/assets/c-site-aerial.webp";
import cSteel from "@/assets/c-steel.webp";
import cWorkers from "@/assets/c-workers.webp";
import projectSolar from "@/assets/project-solar.webp";
import homeConstruction from "@/assets/client-oct28/home-construction.webp";
import homeConstructionSmall from "@/assets/client-oct28/home-construction-small.webp";
import homeConstructionAvif from "@/assets/client-oct28/home-construction.avif";
import homeConstructionAvifSmall from "@/assets/client-oct28/home-construction-small.avif";
import projectsHero from "@/assets/client-oct28/projects-hero.webp";
import projectsHeroSmall from "@/assets/client-oct28/projects-hero-small.webp";
import projectsHeroAvif from "@/assets/client-oct28/projects-hero.avif";
import projectsHeroAvifSmall from "@/assets/client-oct28/projects-hero-small.avif";

/** Shared stock imagery and client-supplied photos from the October change documents. */
export const images = {
  constructionHero,
  homeConstruction,
  /** Home split hero (solar half). */
  solarHero,
  /** Fotovoltaico page hero. */
  solarPageHero,
  constructionDivision: cSteel,
  solarDivision,
  solarCta,
  about: projectSolar,
  projects: projectsHero,
  contact: cBlueprint,
  legal: cWorkers,
};

/** Actual image dimensions keep responsive candidates accurate and avoid upscaling. */
export const heroSources: Record<
  string,
  { small: string; width: number; height: number; avif?: string; avifSmall?: string }
> = {
  [constructionHero]: { small: constructionSmall, width: 1600, height: 1008 },
  [homeConstruction]: {
    small: homeConstructionSmall,
    width: 1086,
    height: 1448,
    avif: homeConstructionAvif,
    avifSmall: homeConstructionAvifSmall,
  },
  [projectsHero]: {
    small: projectsHeroSmall,
    width: 1780,
    height: 883,
    avif: projectsHeroAvif,
    avifSmall: projectsHeroAvifSmall,
  },
  [solarHero]: {
    small: solarHomeSmall,
    width: 944,
    height: 1666,
    avif: solarHomeAvif,
    avifSmall: solarHomeAvifSmall,
  },
  [solarPageHero]: {
    small: solarSmall,
    width: 1448,
    height: 1086,
    avif: solarAvif,
    avifSmall: solarAvifSmall,
  },
  [projectSolar]: { small: aboutSmall, width: 1408, height: 912 },
  [cSiteAerial]: { small: projectsSmall, width: 1600, height: 1067 },
  [cBlueprint]: { small: contactSmall, width: 1600, height: 1067 },
  [cWorkers]: { small: legalSmall, width: 1600, height: 1067 },
};
