import { Building2, Mail, MapPin, MessageSquare, Phone, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Motion";
import { QuoteForm } from "@/components/site/QuoteForm";
import { PageHero, SectionIntro, images } from "@/components/site/Site";
import { company, departments, telHref } from "@/data/company";
import { useConsent } from "@/lib/consent";
import { useT } from "@/i18n/useT";
import type { LeadDivision } from "@/i18n/routes";
import { useState } from "react";

const order: LeadDivision[] = ["general", "construction", "solar"];

export function ContactPage() {
  const { t } = useT();
  return (
    <>
      <PageHero
        eyebrow={t("contact.hero.eyebrow")}
        title={t("contact.hero.title")}
        text={t("contact.hero.text")}
        image={images.contact}
        breadcrumb={[{ label: t("nav.contact") }]}
        compact
      />

      <section className="site-container py-28 md:py-32">
        <SectionIntro
          eyebrow={t("contact.departments.eyebrow")}
          title={t("contact.departments.title")}
        />
        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {order.map((d, i) => {
            return (
              <li key={d}>
                <Reveal delay={i * 0.06} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-foreground hover:shadow-[0_24px_60px_-30px_rgba(15,17,21,.35)] md:p-10">
                  <span
                    className={`absolute top-0 left-0 h-1 w-full origin-left scale-x-25 transition-transform duration-700 group-hover:scale-x-100 ${d === "general" ? "bg-foreground" : d === "construction" ? "bg-construction" : "bg-solar"}`}
                    aria-hidden
                  />
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid size-14 place-items-center ${d === "general" ? "bg-foreground text-background" : d === "construction" ? "bg-construction text-charcoal" : "bg-solar text-charcoal"}`}
                    >
                      {d === "general" ? (
                        <MessageSquare className="size-6" strokeWidth={1.5} aria-hidden />
                      ) : d === "construction" ? (
                        <Building2 className="size-6" strokeWidth={1.5} aria-hidden />
                      ) : (
                        <Sun className="size-6" strokeWidth={1.5} aria-hidden />
                      )}
                    </span>
                    <span className="font-display text-sm font-semibold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-10 text-3xl font-semibold tracking-tight">
                    {t(`contact.departments.${d}`)}
                  </h3>
                                    <p className="mt-3 mb-8 text-sm leading-6 text-muted-foreground">
                    {t(`contact.departments.${d}Text`)}
                  </p>
                  <dl className="mt-auto grid gap-3 border-t border-border pt-6 text-sm [&_a]:break-all">
                    <div className="flex items-center gap-3">
                      <dt>
                        <Mail className="size-4" aria-hidden />
                        <span className="sr-only">{t("contact.departments.email")}</span>
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${departments[d].email}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {departments[d].email}
                        </a>
                      </dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <dt>
                        <Phone className="size-4" aria-hidden />
                        <span className="sr-only">{t("contact.departments.phone")}</span>
                      </dt>
                      <dd>
                        <a
                          href={telHref(departments[d].phone)}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {departments[d].phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid border-t border-border lg:grid-cols-[1fr_1.15fr]">
        <MapPanel />
        <div className="bg-card p-6 sm:p-10 lg:p-14" id="preventivo">
          <SectionIntro eyebrow={t("contact.form.eyebrow")} title={t("contact.form.title")} />
          <QuoteForm />
        </div>
      </section>
    </>
  );
}

/** Google Maps loads only with marketing consent or an explicit click (it sets third-party cookies). */
function MapPanel() {
  const { t } = useT();
  const { marketing } = useConsent();
  const [requested, setRequested] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&output=embed`;
  return (
    <div className="relative min-h-[420px] bg-charcoal text-offwhite lg:min-h-full">
      {marketing || requested ? (
        <iframe
          title={t("contact.map.title")}
          className="absolute inset-0 h-full w-full grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      ) : (
        <div className="grid-lines absolute inset-0 flex flex-col items-start justify-end gap-5 p-8 text-offwhite sm:p-12">
          <p className="eyebrow text-steel">{t("contact.map.eyebrow")}</p>
          <p className="flex items-start gap-3 font-display text-2xl font-semibold">
            <MapPin className="mt-1 size-6 shrink-0" aria-hidden /> {company.address}
          </p>
          <p className="max-w-sm text-sm text-offwhite/60">{t("contact.map.consentText")}</p>
          <Button
            variant="outline"
            className="rounded-none border-offwhite/30 bg-transparent text-offwhite hover:bg-offwhite/10 hover:text-offwhite"
            onClick={() => setRequested(true)}
          >
            {t("contact.map.load")}
          </Button>
        </div>
      )}
    </div>
  );
}
