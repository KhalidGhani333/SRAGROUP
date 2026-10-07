import { ArrowLeft, ArrowRight } from "lucide-react";
import { accent } from "@/components/site/accent";
import { Gallery } from "@/components/site/Lightbox";
import { LocalizedLink } from "@/components/site/LocalizedLink";
import { Reveal } from "@/components/site/Motion";
import { CTA, PageHero } from "@/components/site/Site";
import { getAdjacentProjects, getProjectBySlug, localize } from "@/data/projects";
import { useT } from "@/i18n/useT";
import { NotFoundPage } from "./NotFoundPage";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t, lang } = useT();
  const project = getProjectBySlug(slug);
  const adjacent = getAdjacentProjects(slug);
  if (!project || !adjacent) return <NotFoundPage />;

  const name = localize(project.title, lang);
  const tone = accent[project.division];
  const facts = [
    { label: t("project.division"), value: t(`common.divisions.${project.division}`) },
    { label: t("project.location"), value: project.location },
    { label: t("project.year"), value: String(project.year) },
    { label: t("project.metric"), value: localize(project.metric, lang) },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${t(`common.divisions.${project.division}`)} · ${project.location}`}
        title={name}
        text={localize(project.summary, lang)}
        image={project.coverImage}
        division={project.division}
        breadcrumb={[{ label: t("nav.projects"), page: "projects" }, { label: name }]}
      />

      <section className="border-b border-border">
        <div className="site-container">
          <dl className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse bg-background px-4 py-6 md:px-6">
                <dd className="mt-1 font-display text-lg font-semibold">{f.value}</dd>
                <dt className={`eyebrow ${tone.text}`}>{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="site-container py-28 md:py-36">
        <div className="grid gap-8 lg:grid-cols-[.55fr_1.45fr]">
          <Reveal>
            <p className={`eyebrow flex items-center gap-3 pt-3 ${tone.text}`}>
              <span className="h-px w-8 bg-current" aria-hidden />
              {t("project.overview")}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.2] font-medium tracking-tight">
              {localize(project.summary, lang)}
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-[.55fr_1.45fr]">
          <div aria-hidden className="hidden lg:block" />
          <div className="grid gap-4 md:grid-cols-2">
            {(["challenge", "solution"] as const).map((k, i) => (
              <Reveal key={k} delay={i * 0.08} className="h-full">
                <article className="relative h-full border border-border bg-card p-8 md:p-10">
                  <span className={`absolute top-0 left-0 h-1 w-20 ${tone.bg}`} aria-hidden />
                  <p className="font-display text-sm font-semibold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight">
                    {t(`project.${k}`)}
                  </h2>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {localize(project[k], lang)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="noise relative overflow-hidden bg-charcoal py-24 text-offwhite">
        <div className="grid-blueprint absolute inset-0 text-offwhite" aria-hidden />
        <div className="site-container relative">
          <h2 className={`eyebrow flex items-center gap-3 ${tone.textOnDark}`}>
            <span className="h-px w-8 bg-current" aria-hidden />
            {t("project.keyFigures")}
          </h2>
          <dl className="mt-10 grid grid-cols-2 gap-px bg-offwhite/10 lg:grid-cols-4">
            {project.keyFigures.map((k) => (
              <div
                key={localize(k.label, lang)}
                className="flex flex-col-reverse bg-charcoal p-5 sm:p-6 xl:p-10"
              >
                <dt className="mt-2 text-xs text-offwhite/60">{localize(k.label, lang)}</dt>
                <dd className="font-display text-[clamp(1.375rem,6.5vw,1.875rem)] font-semibold tracking-tight sm:text-3xl sm:whitespace-nowrap md:text-4xl 2xl:text-5xl">
                  {localize(k.value, lang)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="site-container py-24">
        <h2 className={`eyebrow mb-10 flex items-center gap-3 ${tone.text}`}>
          <span className="h-px w-8 bg-current" aria-hidden />
          {t("project.gallery")}
        </h2>
        <Gallery images={[project.coverImage, ...project.gallery]} name={name} />
      </section>

      <nav aria-label={t("nav.projects")} className="border-t border-border">
        <div className="site-container grid sm:grid-cols-2">
          <LocalizedLink
            slug={adjacent.prev.slug}
            className="group flex items-center gap-4 border-b border-border py-8 sm:border-b-0 sm:border-r sm:pr-8"
          >
            <ArrowLeft
              className="size-5 shrink-0 transition-transform group-hover:-translate-x-1"
              aria-hidden
            />
            <span>
              <span className="eyebrow block text-muted-foreground">{t("project.prev")}</span>
              <span className="mt-1 block font-display text-xl font-semibold">
                {localize(adjacent.prev.title, lang)}
              </span>
            </span>
          </LocalizedLink>
          <LocalizedLink
            slug={adjacent.next.slug}
            className="group flex items-center justify-end gap-4 py-8 text-right sm:pl-8"
          >
            <span>
              <span className="eyebrow block text-muted-foreground">{t("project.next")}</span>
              <span className="mt-1 block font-display text-xl font-semibold">
                {localize(adjacent.next.title, lang)}
              </span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </LocalizedLink>
        </div>
      </nav>

      <CTA title={t("project.cta")} division={project.division} />
    </>
  );
}
