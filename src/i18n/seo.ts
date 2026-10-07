import i18n from "./index";
import { projectPath, routeMap, type Lang, type PageKey } from "./routes";
import { company, departments, socialLinks } from "@/data/company";
import { getProjectBySlug, localize } from "@/data/projects";

/** Production origin used for canonical and hreflang URLs. Update when the domain is final. */
export const SITE_URL = "https://www.sragroup.it";

const url = (path: string) => (path.startsWith("/") ? `${SITE_URL}${path}` : path);

/** 1200×630 JPEG share images in public/og (JPEG for the widest social-network support). */
const OG_IMAGES: Partial<Record<PageKey, string>> = {
  construction: "/og/construction.jpg",
  solar: "/og/solar.jpg",
};
const DEFAULT_OG_IMAGE = "/og/default.jpg";

type Crumb = { name: string; path: string };

type HeadInput = {
  title: string;
  description: string;
  lang: Lang;
  paths: Record<Lang, string>;
  image?: string | undefined;
  crumbs?: Crumb[];
  structuredData?: Record<string, unknown>[];
};

function buildHead({
  title,
  description,
  lang,
  paths,
  image,
  crumbs,
  structuredData = [],
}: HeadInput) {
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url(paths[lang]) },
    { property: "og:locale", content: lang === "it" ? "it_IT" : "en_GB" },
    { property: "og:locale:alternate", content: lang === "it" ? "en_GB" : "it_IT" },
    { property: "og:image", content: url(ogImage) },
    { name: "twitter:image", content: url(ogImage) },
  ];
  if (ogImage.startsWith("/og/")) {
    meta.push(
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    );
  }

  const data = [...structuredData];
  if (crumbs && crumbs.length > 1) {
    data.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: url(c.path),
      })),
    });
  }

  return {
    meta,
    links: [
      { rel: "canonical", href: url(paths[lang]) },
      { rel: "alternate", hrefLang: "it", href: url(paths.it) },
      { rel: "alternate", hrefLang: "en", href: url(paths.en) },
      { rel: "alternate", hrefLang: "x-default", href: url(paths.it) },
    ],
    scripts: data.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  };
}

/** Company details for search engines (rich results, knowledge panel), from src/data/company.ts. */
function organizationData(lang: Lang) {
  const t = i18n.getFixedT(lang);
  const contactTypes = { general: "customer service", construction: "sales", solar: "sales" };
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#organization`,
    name: "SRAGROUP",
    legalName: company.legalName,
    url: SITE_URL,
    logo: url("/logo.png"),
    image: url(DEFAULT_OG_IMAGE),
    description: t("meta.home.description"),
    vatID: company.vatNumber,
    email: departments.general.email,
    telephone: departments.general.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: company.city,
      addressCountry: "IT",
    },
    areaServed: { "@type": "Country", name: "Italia" },
    sameAs: Object.values(socialLinks).filter(Boolean),
    knowsAbout: [t("nav.construction"), t("nav.solar")],
    contactPoint: (Object.keys(departments) as (keyof typeof departments)[]).map((d) => ({
      "@type": "ContactPoint",
      name: t(`common.divisions.${d}`),
      contactType: contactTypes[d],
      email: departments[d].email,
      telephone: departments[d].phone,
      areaServed: "IT",
      availableLanguage: ["Italian", "English"],
    })),
  };
}

function pageName(page: PageKey, lang: Lang): string {
  const t = i18n.getFixedT(lang);
  return page === "privacy" || page === "cookies" ? t(`legal.${page}.title`) : t(`nav.${page}`);
}

export function pageHead(page: PageKey, lang: Lang) {
  const t = i18n.getFixedT(lang);
  const home = { name: pageName("home", lang), path: routeMap.home[lang] };
  return buildHead({
    title: t(`meta.${page}.title`),
    description: t(`meta.${page}.description`),
    lang,
    paths: routeMap[page],
    image: OG_IMAGES[page],
    crumbs:
      page === "home" ? [home] : [home, { name: pageName(page, lang), path: routeMap[page][lang] }],
    structuredData: page === "home" ? [organizationData(lang)] : [],
  });
}

export function projectHead(slug: string, lang: Lang) {
  const t = i18n.getFixedT(lang);
  const project = getProjectBySlug(slug);
  if (!project) {
    return { meta: [{ title: t("meta.notFound.title") }, { name: "robots", content: "noindex" }] };
  }
  const name = localize(project.title, lang);
  return buildHead({
    title: t("meta.project.title", { name }),
    description: localize(project.summary, lang),
    lang,
    paths: { it: projectPath(slug, "it"), en: projectPath(slug, "en") },
    image: project.coverImage,
    crumbs: [
      { name: pageName("home", lang), path: routeMap.home[lang] },
      { name: pageName("projects", lang), path: routeMap.projects[lang] },
      { name, path: projectPath(slug, lang) },
    ],
  });
}
