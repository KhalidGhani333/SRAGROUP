import { FilterableProjectGrid } from "@/components/site/ProjectGrid";
import { CTA, PageHero, SectionIntro, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

export function ProjectsPage() {
  const { t } = useT();
  return (
    <>
      <PageHero
        eyebrow={t("projects.hero.eyebrow")}
        title={t("projects.hero.title")}
        text={t("projects.hero.text")}
        image={images.projects}
        breadcrumb={[{ label: t("nav.projects") }]}
      />
      <section className="site-container py-24">
        <SectionIntro eyebrow={t("projects.list.eyebrow")} title={t("projects.list.title")} />
        <div className="mt-12">
          <FilterableProjectGrid />
        </div>
      </section>
      <CTA title={t("home.cta")} />
    </>
  );
}
