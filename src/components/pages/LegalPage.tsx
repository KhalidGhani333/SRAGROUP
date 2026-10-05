import { Info } from "lucide-react";
import { PageHero, images } from "@/components/site/Site";
import { useT } from "@/i18n/useT";

type Section = { title: string; body: string[] };

// Update when the legal texts are approved.
const LAST_UPDATED = new Date("2026-10-06");

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
          <ol className="mt-5 grid gap-2 text-sm">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#${anchor(i)}`} className="text-muted-foreground hover:text-foreground">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>
        <article className="max-w-3xl">
          <p className="flex gap-3 border-l-2 border-construction bg-construction/10 p-4 text-sm leading-6">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            {t("legal.placeholderNote")}
          </p>
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
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
