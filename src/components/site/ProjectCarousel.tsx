import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getProjects, type Division } from "@/data/projects";
import { useT } from "@/i18n/useT";
import { ProjectCard } from "./ProjectGrid";
import { SectionIntro } from "./Site";

/** Related-projects carousel for a division page. */
export function ProjectCarousel({
  division,
  eyebrow,
  title,
}: {
  division: Division;
  eyebrow: string;
  title: string;
}) {
  const { t } = useT();
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const items = getProjects(division);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api]);

  const hover = division === "construction" ? "hover:bg-construction" : "hover:bg-solar";
  const navButton = `grid size-11 place-items-center border border-border transition-colors ${hover} hover:border-transparent hover:text-charcoal disabled:pointer-events-none disabled:opacity-35`;

  return (
    <section
      className="site-container py-24"
      aria-roledescription="carousel"
      aria-label={t("projects.carouselLabel")}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="md:flex-1">
          <SectionIntro eyebrow={eyebrow} title={title} division={division} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={navButton}
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            aria-label={t("common.previous")}
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            className={navButton}
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            aria-label={t("common.next")}
          >
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <Carousel setApi={setApi} opts={{ align: "start" }} className="mt-12">
        <CarouselContent className="-ml-6">
          {items.map((p) => (
            <CarouselItem key={p.id} className="basis-[85%] pl-6 sm:basis-1/2 lg:basis-1/3">
              <ProjectCard project={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
