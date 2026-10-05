import { Award, CheckCircle2, HardHat, ShieldCheck, Target, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import cCranes from "@/assets/c-cranes.jpg";
import { Reveal } from "@/components/site/Motion";
import { CTA, Eyebrow, PageHero, SectionIntro, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

type Milestone = { year: string; title: string; text: string };
type Cert = { code: string; name: string; text: string };
type Leader = { name: string; role: string };

const valueIcons: LucideIcon[] = [Target, ShieldCheck, Award, HardHat];

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
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 flex items-end justify-between text-offwhite md:right-8 md:bottom-8 md:left-8">
                <p className="font-display text-7xl leading-none font-bold tracking-tighter md:text-8xl">
                  {milestones[0]?.year}
                </p>
                <p className="max-w-[10rem] text-right text-xs leading-5 text-offwhite/70">
                  {milestones[0]?.title}
                </p>
              </div>
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
          <SectionIntro eyebrow={t("about.mission.eyebrow")} title={t("about.mission.title")} onDark />
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
                <p className="mt-8 font-display text-2xl leading-snug font-medium tracking-tight md:text-3xl">
                  {t(`about.mission.${k}`)}
                </p>
              </Reveal>
            ))}
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {list<string>("about.mission.values").map((label, i) => {
              const Icon = valueIcons[i] ?? Target;
              return (
                <li
                  key={label}
                  className="group flex items-center gap-4 border border-offwhite/10 p-5 transition-colors duration-500 hover:bg-offwhite/[.06] md:p-6"
                >
                  <span className="grid size-12 shrink-0 place-items-center bg-offwhite text-charcoal transition-transform duration-500 group-hover:rotate-6">
                    <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <p className="font-display text-lg font-semibold">{label}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="site-container py-28 md:py-36">
        <SectionIntro
          eyebrow={t("about.certifications.eyebrow")}
          title={t("about.certifications.title")}
          text={t("about.certifications.text")}
        />
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list<Cert>("about.certifications.items").map((c, i) => (
            <li key={c.code}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-foreground hover:shadow-[0_24px_60px_-30px_rgba(15,17,21,.35)] md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-full border border-border transition-colors duration-500 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                      <Award className="size-6" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="text-[.6rem] font-bold tracking-[.18em] text-muted-foreground uppercase">
                      {t("about.certifications.eyebrow")}
                    </span>
                  </div>
                  <p className="mt-12 font-display text-4xl font-bold tracking-tight">{c.code}</p>
                  <h3 className="mt-3 font-semibold">{c.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{c.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card py-28 md:py-36">
        <div className="site-container">
          <SectionIntro eyebrow={t("about.standards.eyebrow")} title={t("about.standards.title")} />
          <div className="mt-16 grid gap-4 lg:grid-cols-2">
            <Reveal className="border border-border bg-background p-8 md:p-12">
              <span className="grid size-14 place-items-center bg-solar text-charcoal">
                <ShieldCheck className="size-6" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="mt-8 text-3xl font-semibold tracking-tight">
                {t("about.standards.hse.title")}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">{t("about.standards.hse.text")}</p>
              <ul className="mt-8 border-t border-border">
                {list<string>("about.standards.hse.points").map((p) => (
                  <li key={p} className="flex gap-3 border-b border-border py-4 text-sm last:border-b-0">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-solar-ink" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="border border-border bg-background p-8 md:p-12">
              <span className="grid size-14 place-items-center bg-construction text-charcoal">
                <Award className="size-6" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="mt-8 text-3xl font-semibold tracking-tight">
                {t("about.standards.quality.title")}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {t("about.standards.quality.text")}
              </p>
              <ol className="mt-8 border-t border-border">
                {list<string>("about.standards.quality.steps").map((s, i) => (
                  <li key={s} className="flex gap-4 border-b border-border py-4 text-sm last:border-b-0">
                    <span className="font-display font-semibold text-construction-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="site-container py-28 md:py-36">
        <SectionIntro
          eyebrow={t("about.leadership.eyebrow")}
          title={t("about.leadership.title")}
          text={t("about.leadership.text")}
        />
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list<Leader>("about.leadership.items").map((p, i) => (
            <li key={p.role}>
              <Reveal delay={i * 0.08}>
                <article className="group">
                  <div className="noise relative grid aspect-[4/5] place-items-center overflow-hidden bg-gradient-to-br from-slate to-charcoal text-offwhite">
                    <div className="grid-lines absolute inset-0 text-offwhite" aria-hidden />
                    <UserRound
                      className="size-24 text-offwhite/25 transition-transform duration-700 group-hover:scale-110"
                      strokeWidth={0.75}
                      aria-hidden
                    />
                    <p className="absolute bottom-5 left-5 text-[.6rem] font-semibold tracking-[.18em] text-offwhite/45 uppercase">
                      {t("about.leadership.photoPlaceholder")}
                    </p>
                    <span
                      className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full ${i % 2 === 0 ? "bg-construction" : "bg-solar"}`}
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.role}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <CTA title={t("about.cta")} />
    </>
  );
}
