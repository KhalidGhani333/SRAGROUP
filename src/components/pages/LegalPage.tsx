import { PageHero, images } from "@/components/site/Site";
import { company } from "@/data/company";
import { useT } from "@/i18n/useT";

type Section = { title: string; body: string[] };

/** Company details come from src/data/company.ts so the texts update with the registered data. */
const fill = (text: string) =>
  text.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in company ? String(company[key as keyof typeof company]) : match,
  );

// Update when the legal texts are approved.
const LAST_UPDATED = new Date("2026-10-07");

export function LegalPage({ kind }: { kind: "privacy" | "cookies" }) {
  const { t, lang, list } = useT();
  const sections = list<Section>(`legal.${kind}.sections`);
  const date = new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    dateStyle: "long",
  }).format(LAST_UPDATED);
  const anchor = (i: number) => `${kind}-${i + 1}`;

  return (
    <>
      <PageHero
        eyebrow={t(`legal.${kind}.eyebrow`)}
        title={t(`legal.${kind}.title`)}
        text={t("legal.updated", { date })}
        image={images.legal}
        breadcrumb={[{ label: t(`legal.${kind}.title`) }]}
        compact
      />
      <div className="site-container grid gap-12 py-20 lg:grid-cols-[.55fr_1.45fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-muted-foreground">{t("legal.toc")}</p>
          <ol className="mt-5 grid gap-0.5 text-sm">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a
                  href={`#${anchor(i)}`}
                  className="inline-block py-1 text-muted-foreground hover:text-foreground"
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>
        <article className="max-w-3xl">
          {sections.map((s, i) => (
            <section
              key={s.title}
              id={anchor(i)}
              className="scroll-mt-28 border-b border-border py-10 last:border-b-0"
            >
              <h2 className="text-2xl font-semibold">
                {i + 1}. {s.title}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-4 leading-7 text-muted-foreground">
                  {fill(p)}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
