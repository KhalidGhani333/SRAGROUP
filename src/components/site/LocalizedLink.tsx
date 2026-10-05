import { Link, type LinkProps } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useLang } from "@/i18n/useT";
import { localizedPath, projectPath, type Lang, type PageKey } from "@/i18n/routes";

type Target = { page: PageKey; slug?: never } | { page?: never; slug: string };

type Props = Target & {
  lang?: Lang;
  search?: Record<string, string>;
  /** Optional so the link can be used as a <Trans> component slot. */
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

/** Internal link that resolves to the page's URL in the current (or given) language. */
export function LocalizedLink({ page, slug, lang, search, children, ...rest }: Props) {
  const current = useLang();
  const target = lang ?? current;
  const to = slug !== undefined ? projectPath(slug, target) : localizedPath(page, target);
  // Paths come from the route map, so they always match a registered route at runtime.
  const linkProps = { to, ...(search ? { search } : {}), ...rest } as unknown as LinkProps;
  return <Link {...linkProps}>{children}</Link>;
}
