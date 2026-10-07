import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getProjects, localize, type Division, type Project } from "@/data/projects";
import { divisionParam, parseDivisionParam } from "@/i18n/routes";
import { useT } from "@/i18n/useT";
import { accent } from "./accent";
import { LocalizedLink } from "./LocalizedLink";

export function ProjectCard({
  project,
  eager = false,
  size = "default",
}: {
  project: Project;
  eager?: boolean;
  size?: "default" | "large";
}) {
  const { t, lang } = useT();
  const title = localize(project.title, lang);
  const chip = project.division === "construction" ? "bg-construction" : "bg-solar";
  return (
    <LocalizedLink
      slug={project.slug}
      className={`group relative isolate block h-full overflow-hidden bg-charcoal text-offwhite focus-visible:outline-offset-4 ${size === "large" ? "min-h-[28rem] lg:min-h-full" : "aspect-[4/5] sm:aspect-[4/4.6]"}`}
    >
      <img
        src={project.coverImage}
        alt=""
        width={1600}
        height={1067}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/5 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span
            className={`px-3 py-1.5 text-[.68rem] font-bold tracking-[.16em] text-charcoal uppercase ${chip}`}
          >
            {t(`common.divisions.${project.division}`)}
          </span>
          <span className="grid size-12 place-items-center rounded-full border border-offwhite/30 backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-offwhite group-hover:text-charcoal">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>
        <div>
          <p className="text-[.68rem] font-semibold tracking-[.18em] text-offwhite/65 uppercase">
            {project.location} · {project.year}
          </p>
          <h3
            className={`mt-3 font-semibold tracking-tight ${size === "large" ? "text-2xl md:text-4xl" : "text-2xl"}`}
          >
            {title}
          </h3>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-offwhite/15 pt-4">
            <p className="font-display text-lg font-semibold">{localize(project.metric, lang)}</p>
            <p className="translate-y-2 text-xs font-semibold tracking-[.14em] uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {t("common.viewProject")}
            </p>
          </div>
        </div>
      </div>
      <span
        className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full ${chip}`}
        aria-hidden
      />
    </LocalizedLink>
  );
}

type Filter = "all" | Division;
const filters: Filter[] = ["all", "construction", "solar"];

/** Featured selection: the first project spans two rows (bento layout). */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
      {projects.map((p, i) => (
        <li key={p.id} className={i === 0 ? "md:col-span-2 lg:row-span-2" : ""}>
          <ProjectCard project={p} eager={i < 3} size={i === 0 ? "large" : "default"} />
        </li>
      ))}
    </ul>
  );
}

/** Full portfolio with division filter kept in the ?division= query string. */
export function FilterableProjectGrid() {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const search = location.search as Record<string, unknown>;
  const parsed = parseDivisionParam(search["division"]);
  const active: Filter = parsed === "construction" || parsed === "solar" ? parsed : "all";
  const visible = getProjects(active === "all" ? undefined : active);

  const select = (filter: Filter) => {
    const options = {
      to: location.pathname,
      search: filter === "all" ? {} : { division: divisionParam(filter, lang) },
      replace: true,
      resetScroll: false,
    };
    void navigate(options as unknown as Parameters<typeof navigate>[0]);
  };

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label={t("projects.filterLabel")}
          className="flex gap-1 overflow-x-auto border border-border bg-card p-1"
        >
          {filters.map((f) => {
            const pressed = active === f;
            const tone = f === "all" ? "neutral" : f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={pressed}
                onClick={() => select(f)}
                className={`flex h-11 shrink-0 items-center gap-2.5 px-5 text-sm font-semibold transition-colors ${
                  pressed
                    ? f === "all"
                      ? "bg-foreground text-background"
                      : `${accent[tone].bg} text-charcoal`
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t(`projects.filters.${f}`)}
                <span
                  className={`grid min-w-6 place-items-center px-1.5 py-0.5 text-[.7rem] tabular-nums ${pressed ? "bg-black/15" : "bg-muted"}`}
                >
                  {getProjects(f === "all" ? undefined : f).length}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t("projects.count", { count: visible.length })}
        </p>
      </div>
      <motion.ul layout={!reduce} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.li
              key={p.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} eager={i < 3} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
