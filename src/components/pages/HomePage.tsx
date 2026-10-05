import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  Check,
  DraftingCompass,
  KeyRound,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accent } from "@/components/site/accent";
import { LocalizedLink } from "@/components/site/LocalizedLink";
import { CountUp, Marquee, Reveal, RevealText } from "@/components/site/Motion";
import { ProjectList } from "@/components/site/ProjectGrid";
import { CTA, Eyebrow, LogoMark, ScrollCue, SectionIntro, images } from "@/components/site/Site";
import { getFeaturedProjects, type Division } from "@/data/projects";
import { useT } from "@/i18n/useT";

type Stat = { value: number; decimals: number; suffix: string; label: string };
type Card = { title: string; text: string };
type Cert = { code: string; name: string };

const whyIcons: LucideIcon[] = [
  ShieldCheck,
  BadgeCheck,
  KeyRound,
  DraftingCompass,
  CalendarCheck,
  Leaf,
];

export function HomePage() {
  const { t, lang, list } = useT();
  return (
    <>
      <h1 className="sr-only">{t("home.srTitle")}</h1>

      {/* Split hero: each half grows on hover (desktop), stacked 70vh halves on mobile. */}
      <section className="relative flex flex-col bg-charcoal md:h-[100svh] md:min-h-[640px] md:flex-row">
        <HeroHalf division="construction" image={images.constructionHero} index="01" />
        <HeroHalf division="solar" image={images.solarHero} index="02" />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          aria-hidden
        >
          <div className="grid size-20 place-items-center rounded-full border border-offwhite/25 bg-charcoal/60 backdrop-blur-md">
            <LogoMark light className="h-10" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <ScrollCue label={t("common.scroll")} />
        </div>
      </section>

      <section className="border-y border-offwhite/10 bg-charcoal py-6 text-offwhite">
        <Marquee>
          {list<string>("home.marquee").map((item, i) => (
            <span
              key={item}
              className="flex items-center gap-8 pr-8 font-display text-2xl font-semibold tracking-tight whitespace-nowrap md:text-4xl"
            >
              {item}
              <span
                className={`size-2.5 rotate-45 ${i % 2 === 0 ? "bg-construction" : "bg-solar"}`}
                aria-hidden
              />
            </span>
          ))}
        </Marquee>
      </section>

      <section className="site-container py-28 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <Reveal>
              <Eyebrow className="text-muted-foreground">{t("home.intro.eyebrow")}</Eyebrow>
            </Reveal>
            <RevealText
              as="h2"
              immediate={false}
              text={t("home.intro.title")}
              className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-semibold tracking-[-0.035em]"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
                {t("home.intro.text")}
              </p>
              <LocalizedLink
                page="about"
                className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold"
              >
                <span className="grid size-11 place-items-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-5" aria-hidden />
                </span>
                {t("home.intro.cta")}
              </LocalizedLink>
            </Reveal>
          </div>
          <dl
            aria-label={t("home.statsLabel")}
            className="grid grid-cols-2 gap-px self-end border border-border bg-border"
          >
            {list<Stat>("home.stats").map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-background">
                <div className="flex h-full flex-col-reverse justify-end p-6 sm:p-8 md:p-10">
                  <dt className="mt-3 text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="font-display text-4xl leading-none font-semibold tracking-tight whitespace-nowrap sm:text-5xl xl:text-6xl">
                    <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} lang={lang} />
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="grid gap-px bg-charcoal md:grid-cols-2">
        <DivisionPanel division="construction" image={images.constructionDivision} index="01" />
        <DivisionPanel division="solar" image={images.solarDivision} index="02" />
      </section>

      <section className="noise relative overflow-hidden bg-charcoal py-28 text-offwhite md:py-36">
        <div className="grid-blueprint absolute inset-0 text-offwhite" aria-hidden />
        <div
          className="absolute top-0 left-1/3 size-[40rem] -translate-y-1/2 rounded-full bg-brand/25 blur-3xl"
          aria-hidden
        />
        <div className="site-container relative">
          <SectionIntro
            eyebrow={t("home.why.eyebrow")}
            title={t("home.why.title")}
            text={t("home.why.text")}
            onDark
          />
          <ul className="mt-16 grid gap-px border border-offwhite/10 bg-offwhite/10 sm:grid-cols-2 lg:grid-cols-3">
            {list<Card>("home.why.items").map((item, i) => {
              const Icon = whyIcons[i] ?? ShieldCheck;
              const line = i % 2 === 0 ? "bg-construction" : "bg-solar";
              return (
                <li key={item.title} className="group relative bg-charcoal transition-colors duration-500 hover:bg-slate">
                  <span
                    className={`absolute top-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${line}`}
                    aria-hidden
                  />
                  <Reveal delay={(i % 3) * 0.08} className="flex h-full flex-col p-8 md:p-10">
                    <div className="flex items-start justify-between">
                      <span className="grid size-14 place-items-center border border-offwhite/15 transition-colors duration-500 group-hover:border-offwhite/40">
                        <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="font-display text-sm font-semibold text-offwhite/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-14 text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-offwhite/60">{item.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="site-container py-28 md:py-36">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="lg:flex-1">
            <SectionIntro eyebrow={t("home.featured.eyebrow")} title={t("home.featured.title")} />
          </div>
          <Reveal>
            <Button asChild variant="outline" className="group h-12 rounded-none px-6">
              <LocalizedLink page="projects">
                {t("home.featured.cta")}
                <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
              </LocalizedLink>
            </Button>
          </Reveal>
        </div>
        <div className="mt-14">
          <ProjectList projects={getFeaturedProjects(3)} />
        </div>
      </section>

      <section className="border-y border-border bg-card" aria-label={t("home.certifications.label")}>
        <div className="site-container grid lg:grid-cols-[.8fr_2fr]">
          <div className="flex items-center border-b border-border py-8 lg:border-r lg:border-b-0 lg:pr-10">
            <Eyebrow className="text-muted-foreground">{t("home.certifications.label")}</Eyebrow>
          </div>
          <ul className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
            {list<Cert>("home.certifications.items").map((c) => (
              <li
                key={c.code}
                className="group flex items-center gap-4 bg-card px-5 py-8 transition-colors hover:bg-background md:px-8"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:border-foreground">
                  <Award className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-lg leading-tight font-semibold">
                    {c.code}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{c.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTA title={t("home.cta")} />
    </>
  );
}

function HeroHalf({
  division,
  image,
  index,
}: {
  division: Division;
  image: string;
  index: string;
}) {
  const { t } = useT();
  return (
    <div className="group relative isolate flex min-h-[70vh] flex-1 overflow-hidden transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:min-h-0 md:hover:flex-[1.35]">
      <img
        src={image}
        alt=""
        className="animate-ken-burns absolute inset-0 -z-20 h-full w-full object-cover"
        width={1600}
        height={1008}
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/30 transition-opacity duration-700 group-hover:opacity-80" />
      <div className="grid-lines absolute inset-0 -z-10 text-offwhite opacity-50" aria-hidden />
      <div className="flex w-full flex-col justify-between p-6 pt-28 text-offwhite sm:p-10 sm:pt-32 md:p-14 md:pt-36">
        <Reveal immediate delay={division === "construction" ? 0.1 : 0.25}>
          <p className="text-outline font-display text-7xl leading-none font-bold text-offwhite md:text-8xl">
            {index}
          </p>
        </Reveal>
        <div className="max-w-xl">
          <Reveal immediate delay={division === "construction" ? 0.2 : 0.35}>
            <Eyebrow className={accent[division].textOnDark}>
              {t(`home.hero.${division}.eyebrow`)}
            </Eyebrow>
          </Reveal>
          <RevealText
            as="h2"
            text={t(`home.hero.${division}.title`)}
            delay={division === "construction" ? 0.3 : 0.45}
            className="mt-5 text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[.98] font-semibold tracking-[-0.035em]"
          />
          <Reveal immediate delay={division === "construction" ? 0.6 : 0.75}>
            <p className="mt-5 max-w-md text-base leading-7 text-offwhite/75">
              {t(`home.hero.${division}.text`)}
            </p>
            <Button asChild className={`group/btn mt-8 h-12 rounded-none px-6 ${accent[division].button}`}>
              <LocalizedLink page={division}>
                {t("common.discoverDivision")}
                <ArrowRight
                  className="transition-transform group-hover/btn:translate-x-1"
                  aria-hidden
                />
              </LocalizedLink>
            </Button>
          </Reveal>
        </div>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 ${accent[division].bg}`}
        aria-hidden
      />
    </div>
  );
}

function DivisionPanel({
  division,
  image,
  index,
}: {
  division: Division;
  image: string;
  index: string;
}) {
  const { t, list } = useT();
  const services = list<Card>(`${division}.services.items`).slice(0, 4);
  return (
    <article className="group relative isolate flex min-h-[680px] overflow-hidden p-8 text-offwhite md:p-14">
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        width={1600}
        height={1067}
        className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/35" />
      <div className={`absolute inset-x-0 top-0 h-1 ${accent[division].bg}`} aria-hidden />
      <div className="flex w-full flex-col justify-between gap-10">
        <div className="flex items-start justify-between">
          <Eyebrow className={accent[division].textOnDark}>
            {t("home.divisions.eyebrow")} {index}
          </Eyebrow>
          <span className="text-outline font-display text-8xl leading-none font-bold text-offwhite">
            {index}
          </span>
        </div>
        <Reveal>
          <h2 className="text-5xl font-semibold tracking-[-0.035em] md:text-7xl">
            {t(`home.divisions.${division}.title`)}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-offwhite/75">
            {t(`home.divisions.${division}.text`)}
          </p>
          <p className="mt-10 text-[.65rem] font-semibold tracking-[.2em] text-offwhite/50 uppercase">
            {t("home.divisions.services")}
          </p>
          <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
            {services.map((s) => (
              <li
                key={s.title}
                className="flex items-center gap-3 border-b border-offwhite/10 py-3 text-sm"
              >
                <Check className={`size-4 shrink-0 ${accent[division].textOnDark}`} aria-hidden />
                {s.title}
              </li>
            ))}
          </ul>
          <LocalizedLink
            page={division}
            className="group/link mt-10 inline-flex items-center gap-4 text-sm font-semibold"
          >
            <span
              className={`grid size-14 place-items-center rounded-full text-charcoal transition-transform duration-500 group-hover/link:rotate-45 ${accent[division].bg}`}
            >
              <ArrowUpRight className="size-6" aria-hidden />
            </span>
            {t("common.learnMore")}
          </LocalizedLink>
        </Reveal>
      </div>
    </article>
  );
}
