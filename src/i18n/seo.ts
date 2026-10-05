import i18n from "./index";
import { projectPath, routeMap, type Lang, type PageKey } from "./routes";
import { getProjectBySlug, localize } from "@/data/projects";

/** Production origin used for canonical and hreflang URLs. Update when the domain is final. */
export const SITE_URL = "https://www.sragroup.it";

type HeadInput = {
  title: string;
  description: string;
  lang: Lang;
  paths: Record<Lang, string>;
  image?: string;
};

function buildHead({ title, description, lang, paths, image }: HeadInput) {
  const url = (path: string) => `${SITE_URL}${path}`;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url(paths[lang]) },
    { property: "og:locale", content: lang === "it" ? "it_IT" : "en_GB" },
    { property: "og:locale:alternate", content: lang === "it" ? "en_GB" : "it_IT" },
  ];
  if (image)
    meta.push({ property: "og:image", content: image.startsWith("/") ? url(image) : image });
  return {
    meta,
    links: [
      { rel: "canonical", href: url(paths[lang]) },
      { rel: "alternate", hrefLang: "it", href: url(paths.it) },
      { rel: "alternate", hrefLang: "en", href: url(paths.en) },
      { rel: "alternate", hrefLang: "x-default", href: url(paths.it) },
    ],
  };
}

export function pageHead(page: PageKey, lang: Lang) {
  const t = i18n.getFixedT(lang);
  return buildHead({
    title: t(`meta.${page}.title`),
    description: t(`meta.${page}.description`),
    lang,
    paths: routeMap[page],
  });
}

export function projectHead(slug: string, lang: Lang) {
  const t = i18n.getFixedT(lang);
  const project = getProjectBySlug(slug);
  if (!project) {
    return { meta: [{ title: t("meta.notFound.title") }, { name: "robots", content: "noindex" }] };
  }
  return buildHead({
    title: t("meta.project.title", { name: localize(project.title, lang) }),
    description: localize(project.summary, lang),
    lang,
    paths: { it: projectPath(slug, "it"), en: projectPath(slug, "en") },
    image: project.coverImage,
  });
}
