import { Award, CheckCircle2, Handshake, Ruler, ShieldCheck, Truck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import cCranes from "@/assets/c-cranes.webp";
import { Reveal } from "@/components/site/Motion";
import { CTA, Eyebrow, PageHero, SectionIntro, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

type Milestone = { year: string; title: string; text: string };
type Value = { title: string; text: string };
type OperationalCard = Value & { points: string[] };

const valueIcons: LucideIcon[] = [Ruler, ShieldCheck, Award, Handshake];
const operationalIcons: LucideIcon[] = [Users, Truck];

export function AboutPage() {
  const { t, list } = useT();
  const milestones = list<Milestone>("about.history.items");
  return (
    <>
      <PageHero
        eyebrow={t("about.hero.eyebrow")}
        title={t("about.hero.title")}
        text={t("about.hero.text")}
        image={images.about}
        breadcrumb={[{ label: t("nav.about") }]}
      />

      {/* History: sticky photo beside an oversized-year timeline. */}
      <section className="site-container py-28 md:py-36">
        <SectionIntro eyebrow={t("about.history.eyebrow")} title={t("about.history.title")} />
        <div className="mt-16 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              <img
                src={cCranes}
                alt=""
                loading="lazy"
                decoding="async"
                width={1600}
                height={1067}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-0 left-0 h-1 w-1/3 bg-construction" aria-hidden />
              <span className="absolute top-0 left-1/3 h-1 w-1/3 bg-solar" aria-hidden />
            </div>
          </Reveal>
          <ol className="relative border-l border-border">
            {milestones.map((m, i) => (
              <li key={m.year} className="group relative pb-14 pl-10 last:pb-0 md:pl-14">
                <span
                  className={`absolute top-3 -left-[7px] size-[13px] rotate-45 border-2 transition-colors duration-500 ${
                    i === milestones.length - 1
                      ? "border-construction bg-construction"
                      : "border-foreground bg-background group-hover:bg-foreground"
                  }`}
                  aria-hidden
                />
                <Reveal>
                  <p className="text-outline font-display text-6xl leading-none font-bold tracking-tighter text-foreground transition-colors duration-500 group-hover:[-webkit-text-fill-color:currentColor] md:text-7xl">
                    {m.year}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">{m.title}</h3>
                  <p className="mt-2 max-w-lg leading-7 text-muted-foreground">{m.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="noise relative overflow-hidden bg-charcoal py-28 text-offwhite md:py-36">
        <div className="grid-blueprint absolute inset-0 text-offwhite" aria-hidden />
        <div
          className="absolute -right-40 -bottom-40 size-[36rem] rounded-full bg-brand/30 blur-3xl"
          aria-hidden
        />
        <div className="site-container relative">
          <SectionIntro
            eyebrow={t("about.mission.eyebrow")}
            title={t("about.mission.title")}
            onDark
          />
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {(["mission", "vision"] as const).map((k, i) => (
              <Reveal
                key={k}
                delay={i * 0.1}
                className="relative border border-offwhite/10 bg-offwhite/[.03] p-8 backdrop-blur-sm md:p-12"
              >
                <span
                  className={`absolute top-0 left-0 h-1 w-24 ${k === "mission" ? "bg-construction" : "bg-solar"}`}
                  aria-hidden
                />
                <Eyebrow className="text-steel">{t(`about.mission.${k}Label`)}</Eyebrow>
                <h3 className="mt-8 font-display text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
                  {t(`about.mission.${k}Title`)}
                </h3>
                <p className="mt-5 text-base leading-8 text-offwhite/70 md:text-lg">
                  {t(`about.mission.${k}`)}
                </p>
              </Reveal>
            ))}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {list<Value>("about.mission.values").map((value, i) => {
              const Icon = valueIcons[i] ?? Ruler;
              return (
                <li
                  key={value.title}
                  className="group border border-offwhite/10 p-5 transition-colors duration-500 hover:bg-offwhite/[.06] md:p-6"
                >
                  <span className="grid size-12 shrink-0 place-items-center bg-offwhite text-charcoal transition-transform duration-500 group-hover:rotate-6">
                    <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-offwhite/65">{value.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-y border-border bg-card py-28 md:py-36">
        <div className="site-container">
          <SectionIntro eyebrow={t("about.standards.eyebrow")} title={t("about.standards.title")} />
          <div className="mt-16 grid gap-4 lg:grid-cols-2">
            {list<OperationalCard>("about.standards.cards").map((card, i) => {
              const Icon = operationalIcons[i] ?? Users;
              return (
                <Reveal
                  key={card.title}
                  delay={i * 0.1}
                  className="border border-border bg-background p-8 md:p-12"
                >
                  <span className="grid size-14 place-items-center bg-brand/10 text-brand">
                    <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-8 text-3xl font-semibold tracking-tight">{card.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{card.text}</p>
                  <ul className="mt-8 border-t border-border">
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 border-b border-border py-4 text-sm last:border-b-0"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-solar-ink"
                          aria-hidden
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTA title={t("about.cta")} text={t("about.ctaText")} />
    </>
  );
}
