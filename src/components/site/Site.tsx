import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logoSrc from "@/assets/sra-logo.png";
import { Button } from "@/components/ui/button";
import { company, departments, telHref, socialLinks, siteCredit } from "@/data/company";
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
 * The official logo (src/assets/sra-logo.png, 908×664, transparent) is a stacked lockup:
 * mark, "SRA GROUP SRL" wordmark and tagline. It is shown as designed; the header only leaves
 * out the tagline, which is unreadable at header size. Boxes are in source pixels.
 */
const LOGO_W = 908;
const LOGO_H = 664;
const logoBoxes = {
  mark: { x: 277, y: 0, w: 344, h: 350 },
  wordmark: { x: 0, y: 376, w: 908, h: 196 },
  tagline: { x: 0, y: 616, w: 908, h: 48 },
  lockup: { x: 0, y: 0, w: 908, h: 574 },
  full: { x: 0, y: 0, w: 908, h: 664 },
  // Everything below the mark, for the white version on dark surfaces.
  lockupText: { x: 0, y: 362, w: 908, h: 212 },
  fullText: { x: 0, y: 362, w: 908, h: 302 },
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

/**
 * The original stacked logo (transparent PNG). On dark surfaces the mark keeps its brand blue and
 * the navy lettering is rendered white; `tagline` shows the complete artwork (footer).
 */
export function Logo({ light = false, tagline = false }: { light?: boolean; tagline?: boolean }) {
  const box = tagline ? "full" : "lockup";
  const size = tagline ? "h-32 sm:h-36" : "h-14 sm:h-16";
  const { w, h } = logoBoxes[box];
  const mark = logoBoxes.mark;
  const text = logoBoxes[tagline ? "fullText" : "lockupText"];
  return (
    <LocalizedLink
      page="home"
      className="inline-flex w-fit shrink-0 justify-self-start"
      aria-label="SRA GROUP SRL - Home"
    >
      {light ? (
        // Same artwork split in two non-overlapping parts: blue mark + white lettering.
        <span className={`relative block ${size}`} style={{ aspectRatio: `${w} / ${h}` }}>
          <span
            className="absolute top-0"
            style={{ left: `${(mark.x / w) * 100}%`, width: `${(mark.w / w) * 100}%` }}
          >
            <LogoCrop box="mark" className="w-full" />
          </span>
          <span className="absolute inset-x-0" style={{ top: `${(text.y / h) * 100}%` }}>
            <LogoCrop
              box={tagline ? "fullText" : "lockupText"}
              className="w-full"
              imgClassName="brightness-0 invert"
            />
          </span>
        </span>
      ) : (
        <LogoCrop box={box} className={size} />
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
              className={`inline-flex min-h-8 min-w-8 items-center justify-center px-1.5 tracking-[.14em] uppercase transition-opacity ${active ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
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
        className={`site-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 transition-[height] duration-500 lg:grid-cols-[auto_1fr_auto] ${solid ? "h-20" : "h-24"}`}
      >
        <Logo light={!solid} />
        <nav
          aria-label={t("common.mainNav")}
          className="hidden items-center justify-center gap-5 lg:flex xl:gap-8"
        >
          {navPages.map((page) => (
            <LocalizedLink
              key={page}
              page={page}
              aria-current={isActive(page) ? "page" : undefined}
              className={`group relative py-2 text-[.7rem] font-semibold tracking-[.16em] whitespace-nowrap uppercase transition-opacity ${isActive(page) ? "opacity-100" : "opacity-65 hover:opacity-100"}`}
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
            className={`group hidden h-11 rounded-none px-5 xl:inline-flex ${solid ? "" : "bg-offwhite text-charcoal hover:bg-offwhite/90"}`}
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
        <div className="grid gap-12 pt-20 pb-16 md:grid-cols-2 xl:grid-cols-[1fr_.6fr_2fr]">
          <div>
            <Logo light tagline />
            <p className="mt-6 max-w-xs text-sm leading-6 text-offwhite/60">
              {t("footer.tagline")}
            </p>
            <SocialLinks />
          </div>
          <div>
            <p className="eyebrow text-offwhite/40">{t("footer.navigation")}</p>
            <ul className="mt-5 grid gap-1 text-sm">
              {navPages.slice(1).map((page) => (
                <li key={page}>
                  <LocalizedLink
                    page={page}
                    className="group inline-flex items-center gap-1.5 py-1 text-offwhite/70 transition-colors hover:text-offwhite"
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
          <div className="md:col-span-2 xl:col-span-1">
            <p className="eyebrow text-offwhite/40">{t("footer.contacts")}</p>
            <ul className="mt-6 grid gap-6 text-sm sm:grid-cols-3">
              {(["general", "construction", "solar"] as const).map((d) => (
                <li key={d} className="border-l border-offwhite/10 pl-4">
                  <p
                    className={`font-semibold ${d === "general" ? "text-offwhite" : accent[d].textOnDark}`}
                  >
                    {t(`footer.departments.${d}`)}
                  </p>
                  <a
                    href={`mailto:${departments[d].email}`}
                    className="mt-2 flex items-center gap-2 py-1 break-all text-offwhite/65 transition-colors hover:text-offwhite"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden /> {departments[d].email}
                  </a>
                  <a
                    href={telHref(departments[d].phone)}
                    className="flex items-center gap-2 py-1 text-offwhite/65 transition-colors hover:text-offwhite"
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden /> {departments[d].phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="relative border-t border-offwhite/10 bg-charcoal">
        <div className="site-container flex flex-col gap-3 py-6 text-xs text-offwhite/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.legalName} · {t("footer.rights")}
          </p>
          <p>
            {t("footer.createdBy")} <span className="text-offwhite/75">{siteCredit}</span>
          </p>
          <nav aria-label={t("footer.legal")} className="flex flex-wrap gap-x-6 gap-y-2">
            <LocalizedLink page="privacy" className="inline-block py-1 hover:text-offwhite">
              {t("footer.privacy")}
            </LocalizedLink>
            <LocalizedLink page="cookies" className="inline-block py-1 hover:text-offwhite">
              {t("footer.cookies")}
            </LocalizedLink>
            <button
              type="button"
              onClick={openPreferences}
              className="py-1 text-left hover:text-offwhite"
            >
              {t("footer.cookiePreferences")}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}

const socialLabels: Record<keyof typeof socialLinks, string> = {
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

/** Brand glyphs (simple-icons paths, 24×24), drawn in currentColor. */
const socialIcons: Record<keyof typeof socialLinks, string> = {
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

/** Footer icon links to the company's WhatsApp and social profiles. */
function SocialLinks() {
  const { t } = useT();
  const keys = Object.keys(socialLinks) as (keyof typeof socialLinks)[];
  return (
    <nav aria-label={t("footer.follow")} className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <li key={k}>
            <a
              {...(socialLinks[k]
                ? { href: socialLinks[k], target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={socialLabels[k]}
              title={socialLabels[k]}
              className="grid size-10 place-items-center border border-offwhite/15 text-offwhite/70 transition-colors hover:border-offwhite/40 hover:text-offwhite"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d={socialIcons[k]} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
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
                className={`inline-block py-1 ${onDark ? "hover:text-offwhite" : "hover:text-foreground"}`}
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
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </p>
  );
}

export function ScrollCue({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-3 text-[.7rem] font-semibold tracking-[.2em] uppercase text-offwhite/60">
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
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image: string;
  division?: Tone;
  breadcrumb: Crumb[];
  /** Kept for existing callers; every hero is now one full screen tall. */
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
    <section className="noise relative isolate overflow-hidden bg-charcoal text-offwhite">
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
        // Every page hero fills exactly one screen (svh = visible height, also on mobile).
        className="site-container relative flex min-h-svh flex-col justify-between gap-10 pt-28 pb-8 md:pt-32"
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
            className="mt-6 text-[clamp(2.125rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
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
          <p className="hidden text-[.7rem] font-semibold tracking-[.2em] uppercase text-offwhite/45 sm:block">
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
          className="text-[clamp(1.75rem,3.2vw,2.875rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
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
        ? images.solarCta
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
            className="mt-6 text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
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
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
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
    division === "construction"
      ? "bg-construction"
      : division === "solar"
        ? "bg-solar"
        : "bg-foreground";
  return (
    <ol className="relative grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <span className="absolute top-3 right-0 left-0 hidden h-px bg-border xl:block" aria-hidden />
      {items.map((item, i) => (
        <li key={item.title} className="group relative">
          <Reveal delay={i * 0.08}>
            <span className="relative z-10 grid size-6 place-items-center rounded-full border border-border bg-background transition-colors group-hover:border-foreground">
              <span
                className={`size-2 rounded-full ${dot} transition-transform group-hover:scale-150`}
              />
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
