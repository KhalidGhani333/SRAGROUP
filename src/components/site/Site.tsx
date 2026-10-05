import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logoSrc from "@/assets/sra-logo.png";
import { Button } from "@/components/ui/button";
import { company, departments, telHref } from "@/data/company";
import { useConsent } from "@/lib/consent";
import { useT } from "@/i18n/useT";
import {
  alternatePath,
  alternateSearch,
  divisionParam,
  languages,
  localizedPath,
  type LeadDivision,
  type PageKey,
} from "@/i18n/routes";
import { accent, type Tone } from "./accent";
import { CookieConsent } from "./CookieConsent";
import { images } from "./images";
import { LocalizedLink } from "./LocalizedLink";
import { Reveal, RevealText } from "./Motion";

export { images } from "./images";

const navPages = ["home", "about", "construction", "solar", "projects", "contact"] as const;

/*
 * The official logo (src/assets/sra-logo.png, 882×708, transparent) is a stacked lockup:
 * mark, "SRA GROUP SRL" wordmark and tagline. Regions are cropped with CSS so they can be
 * arranged horizontally in the header. Boxes are in source pixels.
 */
const LOGO_W = 882;
const LOGO_H = 708;
const logoBoxes = {
  mark: { x: 270, y: 0, w: 342, h: 341 },
  wordmark: { x: 22, y: 389, w: 840, h: 207 },
  tagline: { x: 15, y: 653, w: 858, h: 50 },
};

function LogoCrop({
  box,
  className,
  imgClassName = "",
}: {
  box: keyof typeof logoBoxes;
  className: string;
  imgClassName?: string;
}) {
  const { x, y, w, h } = logoBoxes[box];
  return (
    <span
      className={`block shrink-0 overflow-hidden ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
      aria-hidden
    >
      <img
        src={logoSrc}
        alt=""
        width={LOGO_W}
        height={LOGO_H}
        className={`block max-w-none ${imgClassName}`}
        style={{
          width: `${(LOGO_W / w) * 100}%`,
          marginLeft: `${(-x / w) * 100}%`,
          // Percentage margins resolve against the container width, so y scales with w too.
          marginTop: `${(-y / w) * 100}%`,
        }}
      />
    </span>
  );
}

/** The SRA GROUP diamond-and-check mark on its own (keeps its brand blue on any background). */
export function LogoMark({ className = "h-9" }: { light?: boolean; className?: string }) {
  return <LogoCrop box="mark" className={className} />;
}

/** Horizontal lockup. On dark surfaces the navy wordmark is rendered white. */
export function Logo({ light = false, tagline = false }: { light?: boolean; tagline?: boolean }) {
  const onDark = light ? "brightness-0 invert" : "";
  return (
    <LocalizedLink page="home" className="inline-flex flex-col gap-3" aria-label="SRA GROUP SRL — Home">
      <span className="flex items-center gap-3">
        <LogoMark className="h-10 md:h-11" />
        <LogoCrop box="wordmark" className="h-9 md:h-10" imgClassName={onDark} />
      </span>
      {tagline && (
        <LogoCrop
          box="tagline"
          className="h-3.5 opacity-60"
          imgClassName={light ? "brightness-0 invert" : ""}
        />
      )}
    </LocalizedLink>
  );
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { t, lang } = useT();
  const location = useRouterState({ select: (s) => s.location });
  return (
    <div
      className={`flex items-center text-xs font-semibold ${className}`}
      role="group"
      aria-label={t("common.language")}
    >
      {languages.map((target, i) => {
        const active = target === lang;
        const linkProps = {
          to: alternatePath(location.pathname, target),
          search: alternateSearch(location.search as Record<string, unknown>, target),
        } as unknown as LinkProps;
        return (
          <span key={target} className="flex items-center">
            {i > 0 && (
              <span className="px-1 opacity-30" aria-hidden>
                /
              </span>
            )}
            <Link
              {...linkProps}
              hrefLang={target}
              lang={target}
              aria-current={active ? "true" : undefined}
              aria-label={active ? undefined : t("common.switchTo", { lng: target })}
              className={`px-1 py-2 tracking-[.14em] uppercase transition-opacity ${active ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
            >
              {target}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export function SiteHeader() {
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (page: PageKey) => {
    const path = localizedPath(page, lang);
    return page === "home"
      ? pathname === path
      : pathname === path || pathname.startsWith(`${path}/`);
  };
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,height] duration-500 ${
        solid
          ? "bg-background/85 text-foreground shadow-[0_1px_0_var(--color-border)] backdrop-blur-xl"
          : "bg-gradient-to-b from-charcoal/70 via-charcoal/30 to-transparent text-offwhite"
      }`}
    >
      <div
        className={`site-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 transition-[height] duration-500 lg:grid-cols-[auto_1fr_auto] ${solid ? "h-[4.5rem]" : "h-24"}`}
      >
        <Logo light={!solid} />
        <nav
          aria-label={t("common.mainNav")}
          className="hidden items-center justify-center gap-8 lg:flex"
        >
          {navPages.map((page) => (
            <LocalizedLink
              key={page}
              page={page}
              aria-current={isActive(page) ? "page" : undefined}
              className={`group relative py-2 text-[.7rem] font-semibold tracking-[.16em] uppercase transition-opacity ${isActive(page) ? "opacity-100" : "opacity-65 hover:opacity-100"}`}
            >
              {t(`nav.${page}`)}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-300 ${isActive(page) ? "w-full" : "w-0 group-hover:w-full"}`}
                aria-hidden
              />
            </LocalizedLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 lg:gap-6">
          <LanguageSwitcher />
          <Button
            asChild
            className={`group hidden h-11 rounded-none px-5 lg:inline-flex ${solid ? "" : "bg-offwhite text-charcoal hover:bg-offwhite/90"}`}
          >
            <LocalizedLink page="contact">
              {t("common.requestQuote")}
              <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
            </LocalizedLink>
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("common.menuClose") : t("common.menuOpen")}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label={t("common.mainNav")}
          className="h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-border bg-background px-5 pt-4 pb-10 lg:hidden"
        >
          {navPages.map((page, i) => (
            <LocalizedLink
              key={page}
              page={page}
              aria-current={isActive(page) ? "page" : undefined}
              className="flex items-baseline gap-4 border-b border-border py-4 font-display text-3xl font-semibold tracking-tight aria-[current=page]:text-construction-ink"
            >
              <span className="font-sans text-xs font-semibold text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t(`nav.${page}`)}
            </LocalizedLink>
          ))}
          <Button asChild className="mt-8 h-12 w-full rounded-none">
            <LocalizedLink page="contact">
              {t("common.requestQuote")} <ArrowRight aria-hidden />
            </LocalizedLink>
          </Button>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useT();
  const { openPreferences } = useConsent();
  const year = 2026;
  return (
    <footer className="noise relative overflow-hidden bg-charcoal text-offwhite">
      <div className="site-container relative">
        <div className="grid gap-12 pt-20 pb-16 md:grid-cols-2 lg:grid-cols-[1.1fr_.8fr_1.6fr]">
          <div>
            <Logo light tagline />
            <p className="mt-6 max-w-xs text-sm leading-6 text-offwhite/60">{t("footer.tagline")}</p>
            <p className="mt-6 text-sm leading-6 text-offwhite/50">
              {company.legalName}
              <br />
              {company.address}
              <br />
              {t("footer.vat")} {company.vatNumber}
            </p>
          </div>
          <div>
            <p className="eyebrow text-offwhite/40">{t("footer.navigation")}</p>
            <ul className="mt-6 grid gap-3 text-sm">
              {navPages.slice(1).map((page) => (
                <li key={page}>
                  <LocalizedLink
                    page={page}
                    className="group inline-flex items-center gap-1.5 text-offwhite/70 transition-colors hover:text-offwhite"
                  >
                    {t(`nav.${page}`)}
                    <ArrowUpRight
                      className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-offwhite/40">{t("footer.contacts")}</p>
            <ul className="mt-6 grid gap-6 text-sm sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {(["general", "construction", "solar"] as const).map((d) => (
                <li key={d} className="border-l border-offwhite/10 pl-4">
                  <p
                    className={`font-semibold ${d === "general" ? "text-offwhite" : accent[d].textOnDark}`}
                  >
                    {t(`footer.departments.${d}`)}
                  </p>
                  <a
                    href={`mailto:${departments[d].email}`}
                    className="mt-3 flex items-center gap-2 text-offwhite/65 transition-colors hover:text-offwhite"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden /> {departments[d].email}
                  </a>
                  <a
                    href={telHref(departments[d].phone)}
                    className="mt-1.5 flex items-center gap-2 text-offwhite/65 transition-colors hover:text-offwhite"
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden /> {departments[d].phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="text-outline pointer-events-none -mb-[0.18em] font-display text-[19vw] leading-none font-bold tracking-tighter text-offwhite select-none 2xl:text-[17rem]"
          aria-hidden
        >
          SRAGROUP
        </p>
      </div>
      <div className="relative border-t border-offwhite/10 bg-charcoal">
        <div className="site-container flex flex-col gap-3 py-6 text-xs text-offwhite/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.legalName} · {t("footer.vat")} {company.vatNumber} ·{" "}
            {t("footer.rights")}
          </p>
          <nav aria-label={t("footer.legal")} className="flex flex-wrap gap-x-6 gap-y-2">
            <LocalizedLink page="privacy" className="hover:text-offwhite">
              {t("footer.privacy")}
            </LocalizedLink>
            <LocalizedLink page="cookies" className="hover:text-offwhite">
              {t("footer.cookies")}
            </LocalizedLink>
            <button type="button" onClick={openPreferences} className="text-left hover:text-offwhite">
              {t("footer.cookiePreferences")}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export type Crumb = { label: string; page?: PageKey };

export function Breadcrumb({ items, onDark = true }: { items: Crumb[]; onDark?: boolean }) {
  const { t } = useT();
  const all: Crumb[] = [{ label: t("common.home"), page: "home" }, ...items];
  return (
    <nav aria-label={t("common.breadcrumb")}>
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-xs ${onDark ? "text-offwhite/55" : "text-muted-foreground"}`}
      >
        {all.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3" aria-hidden />}
            {c.page && i < all.length - 1 ? (
              <LocalizedLink
                page={c.page}
                className={onDark ? "hover:text-offwhite" : "hover:text-foreground"}
              >
                {c.label}
              </LocalizedLink>
            ) : (
              <span
                aria-current={i === all.length - 1 ? "page" : undefined}
                className={onDark ? "text-offwhite/90" : "text-foreground"}
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Eyebrow label with a leading rule, used across sections. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </p>
  );
}

export function ScrollCue({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-3 text-[.65rem] font-semibold tracking-[.2em] uppercase text-offwhite/60">
      <span className="relative h-10 w-px overflow-hidden bg-offwhite/20" aria-hidden>
        <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-offwhite" />
      </span>
      {label}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  division = "neutral",
  breadcrumb,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image: string;
  division?: Tone;
  breadcrumb: Crumb[];
  compact?: boolean;
}) {
  const { t } = useT();
  const glow =
    division === "construction"
      ? "bg-construction/25"
      : division === "solar"
        ? "bg-solar/25"
        : "bg-offwhite/10";
  return (
    <section
      className={`noise relative isolate overflow-hidden bg-charcoal text-offwhite ${compact ? "min-h-[68vh]" : "min-h-[88vh]"}`}
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src={image}
          alt=""
          className="animate-ken-burns h-full w-full object-cover"
          width={1600}
          height={1067}
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/80 via-charcoal/20 to-transparent" />
      <div className="grid-lines absolute inset-0 -z-10 text-offwhite opacity-60" aria-hidden />
      <div
        className={`absolute -bottom-40 -left-40 -z-10 size-[36rem] rounded-full blur-3xl ${glow}`}
        aria-hidden
      />

      <div
        className={`site-container relative flex flex-col justify-between gap-14 pt-32 pb-10 md:pt-36 ${compact ? "min-h-[68vh]" : "min-h-[88vh]"}`}
      >
        <Reveal immediate>
          <Breadcrumb items={breadcrumb} />
        </Reveal>
        <div className="max-w-5xl">
          {eyebrow && (
            <Reveal immediate delay={0.1}>
              <Eyebrow className={accent[division].textOnDark}>{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <RevealText
            text={title}
            delay={0.15}
            className="mt-6 text-[clamp(2.75rem,7.5vw,7.5rem)] leading-[.95] font-semibold tracking-[-0.035em]"
          />
          {text && (
            <Reveal immediate delay={0.45}>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-offwhite/75 md:text-xl md:leading-9">
                {text}
              </p>
            </Reveal>
          )}
        </div>
        <div className="flex items-end justify-between border-t border-offwhite/10 pt-6">
          <ScrollCue label={t("common.scroll")} />
          <p className="hidden text-[.65rem] font-semibold tracking-[.2em] uppercase text-offwhite/45 sm:block">
            SRA GROUP · {company.city}
          </p>
        </div>
      </div>
      {division !== "neutral" && (
        <div className={`absolute inset-x-0 bottom-0 h-1 ${accent[division].bg}`} aria-hidden />
      )}
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  text,
  division = "neutral",
  onDark = false,
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  division?: Tone;
  onDark?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[.55fr_1.45fr]">
      <Reveal>
        <Eyebrow className={`pt-3 ${onDark ? accent[division].textOnDark : accent[division].text}`}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <div>
        <RevealText
          as={as}
          text={title}
          immediate={false}
          className="text-[clamp(2rem,4.6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
        />
        {text && (
          <Reveal delay={0.15}>
            <p
              className={`mt-6 max-w-2xl text-base leading-7 md:text-lg md:leading-8 ${onDark ? "text-offwhite/65" : "text-muted-foreground"}`}
            >
              {text}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function CTA({ title, division = "neutral" }: { title: string; division?: Tone }) {
  const { t, lang } = useT();
  const lead: LeadDivision | undefined = division === "neutral" ? undefined : division;
  const image =
    division === "construction"
      ? images.constructionDivision
      : division === "solar"
        ? images.solarDivision
        : images.contact;
  const glow =
    division === "construction"
      ? "bg-construction/35"
      : division === "solar"
        ? "bg-solar/35"
        : "bg-brand/40";
  const phone = departments[lead ?? "general"].phone;
  return (
    <section className="noise relative isolate overflow-hidden bg-charcoal text-offwhite">
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25 grayscale"
        width={1600}
        height={1067}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/50" />
      <div className="grid-blueprint absolute inset-0 -z-10 text-offwhite" aria-hidden />
      <div
        className={`absolute -top-32 right-0 -z-10 size-[32rem] rounded-full blur-3xl ${glow}`}
        aria-hidden
      />
      <div className="site-container grid gap-12 py-28 md:py-36 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <Reveal>
            <Eyebrow className={accent[division].textOnDark}>{t("cta.eyebrow")}</Eyebrow>
          </Reveal>
          <RevealText
            as="h2"
            text={title}
            immediate={false}
            className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[.98] font-semibold tracking-[-0.035em]"
          />
        </div>
        <Reveal delay={0.2} className="lg:pb-3">
          <p className="max-w-md text-lg leading-8 text-offwhite/70">{t("cta.text")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className={`group h-14 rounded-none px-7 text-base ${division === "neutral" ? "bg-offwhite text-charcoal hover:bg-offwhite/90" : accent[division].button}`}
            >
              <LocalizedLink
                page="contact"
                {...(lead ? { search: { division: divisionParam(lead, lang) } } : {})}
              >
                {t("common.requestQuote")}
                <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
              </LocalizedLink>
            </Button>
            <a
              href={telHref(phone)}
              className="inline-flex h-14 items-center gap-2 border border-offwhite/25 px-7 font-medium transition-colors hover:bg-offwhite/10"
            >
              <Phone className="size-4" aria-hidden /> {t("cta.call")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function NumberedSteps({
  items,
  division = "neutral",
}: {
  items: { title: string; text: string }[];
  division?: Tone;
}) {
  const dot =
    division === "construction" ? "bg-construction" : division === "solar" ? "bg-solar" : "bg-foreground";
  return (
    <ol className="relative grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <span className="absolute top-3 right-0 left-0 hidden h-px bg-border xl:block" aria-hidden />
      {items.map((item, i) => (
        <li key={item.title} className="group relative">
          <Reveal delay={i * 0.08}>
            <span className="relative z-10 grid size-6 place-items-center rounded-full border border-border bg-background transition-colors group-hover:border-foreground">
              <span className={`size-2 rounded-full ${dot} transition-transform group-hover:scale-150`} />
            </span>
            <p className="text-outline mt-6 font-display text-6xl leading-none font-bold text-foreground transition-colors">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useT();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] bg-foreground px-4 py-3 text-sm font-semibold text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t("common.skipToContent")}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <CookieConsent />
    </>
  );
}
