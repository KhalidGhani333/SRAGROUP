import { ArrowLeft, ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/site/LocalizedLink";
import { PageHero } from "@/components/site/Site";
import { localize, type Project } from "@/data/projects";
import { useT } from "@/i18n/useT";

export function ProjectDetailPage({ project }: { project: Project }) {
  const { t, lang } = useT();
  const detail = project.detail;
  if (!detail) return null;
  return (
    <>
      <PageHero
        title={localize(detail.heading, lang)}
        eyebrow={t("common.divisions.construction")}
        {...(detail.intro ? { text: localize(detail.intro, lang) } : {})}
        image={project.coverImage}
        division="construction"
        breadcrumb={[
          { label: t("nav.projects"), page: "projects" },
          { label: localize(project.title, lang) },
        ]}
      />
      <section className="site-container py-16 md:py-24" aria-label={t("projects.detail.facts")}>
        <dl className="grid gap-x-10 gap-y-8 border-b border-border pb-12 sm:grid-cols-2 lg:grid-cols-3">
          {detail.facts.map((fact) => (
            <div key={fact.label.it} className="min-w-0">
              <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {localize(fact.label, lang)}
              </dt>
              <dd className="mt-3 text-xl font-semibold tracking-tight">
                {localize(fact.value, lang)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mx-auto mt-14 max-w-4xl space-y-12">
          {detail.sections.map((section) => (
            <section key={section.title.it}>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {localize(section.title, lang)}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.it}
                  className="mt-5 text-base leading-8 text-muted-foreground md:text-lg"
                >
                  {localize(paragraph, lang)}
                </p>
              ))}
              {section.items && (
                <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-muted-foreground marker:text-construction md:text-lg">
                  {section.items.map((item) => (
                    <li key={item.it}>{localize(item, lang)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {detail.plannedQuantities && (
            <section className="border border-border bg-card p-5 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("projects.detail.plannedTitle")}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {t("projects.detail.plannedNote")}
              </p>
              <table className="mt-6 w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="py-3 pr-4">
                      {t("projects.detail.work")}
                    </th>
                    <th scope="col" className="py-3 text-right">
                      {t("projects.detail.planned")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detail.plannedQuantities.map((item) => (
                    <tr key={item.label.it} className="border-b border-border last:border-0">
                      <th scope="row" className="py-4 pr-4 font-normal">
                        {localize(item.label, lang)}
                      </th>
                      <td className="py-4 text-right">{localize(item.value, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <nav className="flex flex-col gap-5 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
            <LocalizedLink
              page="projects"
              className="inline-flex items-center gap-2 py-3 font-semibold"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {t("projects.detail.back")}
            </LocalizedLink>
            <LocalizedLink
              page="contact"
              search={{ division: lang === "it" ? "costruzioni" : "construction" }}
              className="inline-flex items-center justify-center gap-3 bg-construction px-6 py-4 font-semibold text-charcoal"
            >
              {t("projects.detail.contact")}
              <ArrowRight className="size-4" aria-hidden />
            </LocalizedLink>
          </nav>
        </div>
      </section>
    </>
  );
}
