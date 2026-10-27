import type { Division } from "@/i18n/routes";
import { useT } from "@/i18n/useT";
import { Reveal } from "./Motion";
import { accent } from "./accent";

export type OperationalStat = {
  value: string;
  detail?: string;
  label: string;
  text: string;
  division?: Division;
};

export function OperationalStats({
  stats,
  division = "construction",
}: {
  stats: OperationalStat[];
  division?: Division;
}) {
  const { t } = useT();
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
      {stats.map((stat, i) => {
        const tone = stat.division ?? division;
        return (
          <Reveal
            key={stat.label}
            delay={i * 0.06}
            className="@container min-w-0 border-b border-offwhite/20 pb-8"
          >
            <dt
              className={`text-xs font-semibold tracking-widest uppercase ${accent[tone].textOnDark}`}
            >
              {stat.division && t(`common.divisions.${stat.division}`)}
              <span className="sr-only">{stat.label}</span>
            </dt>
            <dd>
              <p
                className={`mt-3 flex flex-wrap items-baseline gap-x-1 font-display text-[clamp(1.75rem,20cqw,4rem)] leading-none font-semibold tracking-tight ${accent[tone].textOnDark}`}
              >
                {stat.value.endsWith("MWp") ? (
                  <>
                    <span>{stat.value.replace(/\s*MWp$/, "")}</span>{" "}
                    <span className="text-[.5em] tracking-normal">MWp</span>
                  </>
                ) : (
                  stat.value
                )}
              </p>
              {stat.detail && (
                <p className={`mt-2 text-sm font-medium ${accent[tone].textOnDark}`}>
                  {stat.detail}
                </p>
              )}
              <p aria-hidden className="mt-5 text-xl leading-snug font-semibold sm:text-2xl">
                {stat.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-offwhite/65">{stat.text}</p>
            </dd>
          </Reveal>
        );
      })}
    </dl>
  );
}
