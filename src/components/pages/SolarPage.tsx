import {
  Activity,
  BatteryCharging,
  Cable,
  FileCheck2,
  Gauge,
  Leaf,
  Sun,
  SunMedium,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/Motion";
import { ProjectCarousel } from "@/components/site/ProjectCarousel";
import { CTA, NumberedSteps, PageHero, SectionIntro, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

type Card = { title: string; text: string };
type Stat = { value: string; label: string };

const serviceIcons: LucideIcon[] = [Sun, SunMedium, Leaf, Wrench, BatteryCharging];
const capabilityIcons: LucideIcon[] = [Gauge, FileCheck2, Cable, Activity];

export function SolarPage() {
  const { t, list } = useT();
  return (
    <>
      <PageHero
        eyebrow={t("solar.hero.eyebrow")}
        title={t("solar.hero.title")}
        text={t("solar.hero.text")}
        image={images.solarHero}
        division="solar"
        breadcrumb={[{ label: t("nav.solar") }]}
      />

      <section className="site-container py-24">
        <SectionIntro
          eyebrow={t("solar.services.eyebrow")}
          title={t("solar.services.title")}
          division="solar"
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {list<Card>("solar.services.items").map((item, i) => {
            const Icon = serviceIcons[i] ?? Sun;
            if (i === 0) {
              return (
                <li key={item.title} className="sm:col-span-2 lg:row-span-2">
                  <Reveal className="h-full">
                    <article className="group relative isolate flex h-full min-h-[26rem] flex-col justify-end overflow-hidden bg-charcoal p-8 text-offwhite md:p-10">
                      <img
                        src={images.solarRoof}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={1600}
                        height={1067}
                        className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/55 to-transparent" />
                      <span className="absolute top-8 left-8 grid size-14 place-items-center bg-solar text-charcoal md:top-10 md:left-10">
                        <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                      </span>
                      <h3 className="max-w-md text-2xl font-semibold tracking-tight md:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-md leading-7 text-offwhite/75">{item.text}</p>
                    </article>
                  </Reveal>
                </li>
              );
            }
            return (
              <li key={item.title}>
                <Reveal delay={i * 0.06} className="h-full">
                  <article className="group relative flex h-full flex-col border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-solar hover:shadow-[0_24px_60px_-30px_rgba(15,17,21,.35)]">
                    <div className="flex items-start justify-between">
                      <span className="grid size-12 place-items-center bg-solar/12 text-solar-ink transition-colors duration-500 group-hover:bg-solar group-hover:text-charcoal">
                        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="font-display text-sm font-semibold text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-10 text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
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
            eyebrow={t("solar.capabilities.eyebrow")}
            title={t("solar.capabilities.title")}
            text={t("solar.capabilities.text")}
            division="solar"
            onDark
          />
          <dl className="mt-14 grid grid-cols-2 gap-px bg-offwhite/10 lg:grid-cols-4">
            {list<Stat>("solar.capabilities.stats").map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-charcoal p-5 sm:p-7 xl:p-10">
                <dt className="mt-2 text-xs text-offwhite/60">{s.label}</dt>
                <dd className="font-display text-[clamp(1.75rem,8.5vw,2.25rem)] font-semibold tracking-tight whitespace-nowrap text-solar sm:text-5xl lg:text-[clamp(2.5rem,4vw,3.75rem)]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-px grid gap-px bg-offwhite/10 sm:grid-cols-2 lg:grid-cols-4">
            {list<Card>("solar.capabilities.items").map((item, i) => {
              const Icon = capabilityIcons[i] ?? Gauge;
              return (
                <li key={item.title} className="bg-charcoal">
                  <Reveal delay={i * 0.06} className="h-full p-7">
                    <Icon className="size-6 text-solar" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-8 text-lg font-semibold">{item.title}</h3>
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
          eyebrow={t("solar.process.eyebrow")}
          title={t("solar.process.title")}
          division="solar"
        />
        <div className="mt-12">
          <NumberedSteps items={list<Card>("solar.process.items")} division="solar" />
        </div>
      </section>

      <div className="border-t border-border">
        <ProjectCarousel
          division="solar"
          eyebrow={t("solar.projects.eyebrow")}
          title={t("solar.projects.title")}
        />
      </div>

      <CTA title={t("solar.cta")} division="solar" />
    </>
  );
}
