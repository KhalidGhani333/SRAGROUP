import type { Division } from "@/i18n/routes";
import { accent } from "./accent";
import { Reveal } from "./Motion";
import { SectionIntro } from "./Site";

export type TeamMember = { name: string; role: string };

export function TeamSection({
  division,
  eyebrow,
  title,
  members,
  emptyText,
}: {
  division: Division;
  eyebrow: string;
  title: string;
  members: TeamMember[];
  emptyText?: string;
}) {
  return (
    <section className="border-t border-border">
      <div className="site-container py-24">
        <SectionIntro eyebrow={eyebrow} title={title} division={division} />
        {members.length > 0 ? (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, i) => (
              <li key={member.name}>
                <Reveal delay={i * 0.06} className="h-full">
                  <article className="group relative h-full overflow-hidden border border-border bg-card p-7">
                    <span
                      className={`absolute top-0 left-0 h-1 w-12 transition-all duration-500 group-hover:w-full ${accent[division].bg}`}
                      aria-hidden
                    />
                    <h3 className="text-xl font-semibold tracking-tight">{member.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          emptyText && <p className="mt-12 text-muted-foreground">{emptyText}</p>
        )}
      </div>
    </section>
  );
}
