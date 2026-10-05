import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/site/LocalizedLink";
import { useT } from "@/i18n/useT";

export function NotFoundPage() {
  const { t } = useT();
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-offwhite">
      <div className="grid-lines absolute inset-0 -z-10 text-offwhite" aria-hidden />
      <div className="site-container flex min-h-[calc(100vh-5rem)] flex-col justify-center py-24">
        <p className="eyebrow text-construction">{t("notFound.eyebrow")}</p>
        <p
          className="mt-6 font-display text-[clamp(6rem,22vw,16rem)] font-bold leading-none text-offwhite/10"
          aria-hidden
        >
          404
        </p>
        <h1 className="-mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          {t("notFound.title")}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-offwhite/70">{t("notFound.text")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            asChild
            className="h-12 rounded-none bg-offwhite px-6 text-charcoal hover:bg-offwhite/90"
          >
            <LocalizedLink page="home">
              {t("notFound.home")} <ArrowRight aria-hidden />
            </LocalizedLink>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-none border-offwhite/30 bg-transparent px-6 text-offwhite hover:bg-offwhite/10 hover:text-offwhite"
          >
            <LocalizedLink page="projects">{t("notFound.projects")}</LocalizedLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
