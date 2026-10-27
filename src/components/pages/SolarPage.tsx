import { Hammer, PanelsTopLeft, Settings, Sun, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import groundPv from "@/assets/project images/solar-collage-fixed-structure.jpg";
import pileDriver from "@/assets/project images/pile-driver-operator.jpeg";
import solarInstallation from "@/assets/project images/solar-collage-tracker.jpg";
import parkAerial from "@/assets/project images/solar-park-aerial-fields.jpeg";
import logoSrc from "@/assets/sra-logo.png";
import { Reveal } from "@/components/site/Motion";
import { ProjectCarousel } from "@/components/site/ProjectCarousel";
import { TeamSection, type TeamMember } from "@/components/site/TeamSection";
import { CTA, NumberedSteps, PageHero, SectionIntro, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

type Card = { title: string; text: string };
type Service = Card & { subtitle: string };
type Stat = { value: string; unit?: string; detail?: string; label: string };
const serviceIcons: LucideIcon[] = [Hammer, Settings, PanelsTopLeft, Wrench];

export function SolarPage() {
  const { t, list } = useT();
  return (
    <>
      <PageHero
        eyebrow={t("solar.hero.eyebrow")}
        title={t("solar.hero.title")}
        text={t("solar.hero.text")}
        image={images.solarPageHero}
        division="solar"
        breadcrumb={[{ label: t("nav.solar") }]}
      />

      <ProjectCarousel
        division="solar"
        eyebrow={t("solar.projects.eyebrow")}
        title={t("solar.projects.title")}
      />

      <section className="border-t border-border">
        <div className="site-container py-24">
          <SectionIntro
            eyebrow={t("solar.services.eyebrow")}
            title={t("solar.services.title")}
            division="solar"
          />
          <div className="mt-14 grid items-stretch gap-4 md:grid-cols-2">
            <Reveal className="relative aspect-square min-w-0 md:aspect-auto">
              <SolarCollage label={t("solar.services.collageLabel")} />
            </Reveal>
            <ul className="grid auto-rows-fr gap-4 sm:grid-cols-2">
              {list<Service>("solar.services.items").map((item, i) => {
                const Icon = serviceIcons[i] ?? Sun;
                return (
                  <li key={item.title}>
                    <Reveal delay={i * 0.06} className="h-full">
                      <article className="group relative flex h-full flex-col border border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-solar hover:shadow-[0_24px_60px_-30px_rgba(15,17,21,.35)] xl:p-7">
                        <div className="flex items-start justify-between">
                          <span className="grid size-10 place-items-center bg-solar/12 text-solar-ink transition-colors duration-500 group-hover:bg-solar group-hover:text-charcoal xl:size-12">
                            <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                          </span>
                          <span className="font-display text-sm font-semibold text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold tracking-tight xl:mt-10 xl:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 font-medium">{item.subtitle}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-24 text-offwhite">
        <div className="site-container">
          <SectionIntro
            eyebrow={t("solar.capabilities.eyebrow")}
            title={t("solar.capabilities.title")}
            text={t("solar.capabilities.text")}
            division="solar"
            onDark
          />
          <dl className="mt-14 grid grid-cols-2 gap-px bg-offwhite/10 lg:grid-cols-4">
            {list<Stat>("solar.capabilities.stats").map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 flex-col-reverse justify-end bg-charcoal p-5 sm:p-7 xl:p-10"
              >
                <dt className="mt-2 text-xs text-offwhite/60">{s.label}</dt>
                <dd className="min-h-20 font-display text-[clamp(1.75rem,8.5vw,2.25rem)] leading-none font-semibold tracking-tight text-solar sm:min-h-24 sm:text-5xl lg:text-[clamp(2.5rem,4vw,3.75rem)] xl:min-h-28">
                  <span className="flex items-baseline gap-x-0.5 whitespace-nowrap">
                    <span>{s.value}</span>
                    {s.unit && (
                      <>
                        {" "}
                        <span className="text-[.5em] tracking-normal">{s.unit}</span>
                      </>
                    )}
                  </span>
                  {s.detail && (
                    <>
                      {" "}
                      <span className="mt-2 block text-base leading-6 font-medium tracking-normal sm:text-lg">
                        {s.detail}
                      </span>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <TeamSection
        division="solar"
        eyebrow={t("solar.team.eyebrow")}
        title={t("solar.team.title")}
        members={list<TeamMember>("solar.team.members")}
      />

      <section className="site-container py-24">
        <SectionIntro
          eyebrow={t("solar.process.eyebrow")}
          title={t("solar.process.title")}
          division="solar"
        />
        <div className="mt-12">
          <NumberedSteps items={list<Card>("solar.process.items")} division="solar" />
        </div>
      </section>

      <CTA
        title={t("solar.cta")}
        text={t("solar.ctaText")}
        requestLabel={t("solar.ctaRequest")}
        callLabel={t("solar.ctaCall")}
        division="solar"
      />
    </>
  );
}

/** Photo collage around the SRA GROUP logo, in place of the single services photo. */
function SolarCollage({ label }: { label: string }) {
  const photo = "h-full w-full object-cover transition duration-[1.2s] ease-out hover:scale-[1.04]";
  return (
    <figure
      role="img"
      aria-label={label}
      className="absolute inset-0 grid grid-cols-3 grid-rows-[auto_repeat(3,minmax(0,1fr))] gap-3 bg-charcoal p-3 sm:gap-4 sm:p-4"
    >
      <div className="col-span-2 col-start-2 row-start-1 flex items-center justify-end gap-4 py-1 text-offwhite/70">
        <span className="h-px w-16 bg-current sm:w-24" aria-hidden />
        <span className="text-xs font-semibold tracking-[.2em] uppercase">SRA GROUP</span>
      </div>
      <div className="col-start-1 row-span-3 row-start-1 min-h-0 overflow-hidden">
        <img src={pileDriver} alt="" loading="lazy" decoding="async" className={photo} />
      </div>
      <div className="col-span-2 col-start-2 row-start-2 min-h-0 overflow-hidden">
        <img src={groundPv} alt="" loading="lazy" decoding="async" className={photo} />
      </div>
      <div className="col-start-2 row-start-3 grid min-h-0 place-items-center overflow-hidden bg-white p-3 sm:p-5">
        <img
          src={logoSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full min-h-0 w-full object-contain"
        />
      </div>
      <div className="col-start-3 row-span-2 row-start-3 min-h-0 overflow-hidden">
        <img src={solarInstallation} alt="" loading="lazy" decoding="async" className={photo} />
      </div>
      <div className="col-span-2 col-start-1 row-start-4 min-h-0 overflow-hidden">
        <img src={parkAerial} alt="" loading="lazy" decoding="async" className={photo} />
      </div>
    </figure>
  );
}
