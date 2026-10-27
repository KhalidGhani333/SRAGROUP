import {
  Building2,
  Columns3,
  Factory,
  Hammer,
  Home,
  Layers,
  PaintRoller,
  Paintbrush,
  School,
  Users,
  BrickWall,
  SquareStack,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import cOffice from "@/assets/c-office.webp";
import cResidential from "@/assets/c-residential.webp";
import cWarehouse from "@/assets/c-warehouse.webp";
import { Reveal } from "@/components/site/Motion";
import { ProjectCarousel } from "@/components/site/ProjectCarousel";
import { OperationalStats, type OperationalStat } from "@/components/site/OperationalStats";
import { CTA, NumberedSteps, PageHero, SectionIntro, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

type Card = { title: string; text: string };

const sectorIcons: LucideIcon[] = [Factory, Building2, Home, School];
const sectorImages = [cWarehouse, cOffice, cResidential, images.about];
const serviceIcons: LucideIcon[] = [
  PaintRoller,
  Layers,
  Paintbrush,
  Home,
  BrickWall,
  SquareStack,
  Columns3,
  Users,
];

export function ConstructionPage() {
  const { t, list } = useT();
  return (
    <>
      <PageHero
        eyebrow={t("construction.hero.eyebrow")}
        title={t("construction.hero.title")}
        text={t("construction.hero.text")}
        tagline={t("construction.hero.tagline")}
        image={images.constructionHero}
        division="construction"
        breadcrumb={[{ label: t("nav.construction") }]}
      />

      <div className="border-t border-border">
        <ProjectCarousel
          division="construction"
          eyebrow={t("construction.projects.eyebrow")}
          title={t("construction.projects.title")}
        />
      </div>

      <section className="noise relative bg-charcoal py-28 text-offwhite">
        <div className="site-container">
          <SectionIntro
            eyebrow={t("construction.services.eyebrow")}
            title={t("construction.services.title")}
            division="construction"
            onDark
          />
          <ul className="mt-14 grid gap-px bg-offwhite/10 sm:grid-cols-2 xl:grid-cols-4">
            {list<Card>("construction.services.items").map((item, i) => {
              const Icon = serviceIcons[i] ?? Hammer;
              return (
                <li
                  key={item.title}
                  className="group relative bg-charcoal transition-colors duration-500 hover:bg-slate"
                >
                  <span
                    className="absolute top-0 left-0 h-0.5 w-0 bg-construction transition-all duration-500 group-hover:w-full"
                    aria-hidden
                  />
                  <Reveal delay={(i % 4) * 0.06} className="h-full p-7 md:p-8">
                    <span className="grid size-14 place-items-center border border-offwhite/15 text-construction transition-colors duration-500 group-hover:border-construction group-hover:bg-construction group-hover:text-charcoal">
                      <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                    </span>
                    <p className="mt-6 text-sm text-offwhite/45">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-offwhite/60">{item.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="site-container py-24">
        <SectionIntro
          eyebrow={t("construction.sectors.eyebrow")}
          title={t("construction.sectors.title")}
          division="construction"
        />
        <ul className="mt-14 grid gap-4 lg:grid-cols-2">
          {list<Card>("construction.sectors.items").map((item, i) => {
            const Icon = sectorIcons[i] ?? Factory;
            return (
              <li key={item.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <article className="group relative isolate flex min-h-[38rem] h-full flex-col justify-end overflow-hidden bg-charcoal p-7 text-offwhite md:min-h-[34rem] md:p-8">
                    <img
                      src={sectorImages[i]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={1600}
                      height={1067}
                      className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/10" />
                    <div className="absolute top-7 right-7 left-7 flex items-start justify-between md:top-8 md:right-8 md:left-8">
                      <span className="grid size-14 place-items-center bg-construction text-charcoal">
                        <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="text-outline font-display text-6xl leading-none font-bold text-offwhite">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-offwhite/70">{item.text}</p>
                    <span
                      className="absolute bottom-0 left-0 h-1 w-0 bg-construction transition-all duration-700 group-hover:w-full"
                      aria-hidden
                    />
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-charcoal py-24 text-offwhite">
        <div className="site-container">
          <SectionIntro
            eyebrow={t("construction.capabilities.eyebrow")}
            title={t("construction.capabilities.title")}
            text={t("construction.capabilities.text")}
            division="construction"
            onDark
          />
          <div className="mt-14">
            <OperationalStats stats={list<OperationalStat>("construction.capabilities.stats")} />
          </div>
        </div>
      </section>

      <section className="site-container py-24">
        <SectionIntro
          eyebrow={t("construction.method.eyebrow")}
          title={t("construction.method.title")}
          division="construction"
        />
        <div className="mt-12">
          <NumberedSteps items={list<Card>("construction.method.items")} division="construction" />
        </div>
      </section>

      <CTA
        title={t("construction.cta")}
        subtitle={t("construction.ctaSubtitle")}
        description={t("construction.ctaDescription")}
        text={t("construction.ctaText")}
        callLabel={t("construction.ctaCall")}
        division="construction"
      />
    </>
  );
}
