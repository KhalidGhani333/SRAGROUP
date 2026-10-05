import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, SectionIntro, images } from "@/components/site/Site";
import { ProjectGrid } from "@/components/site/ProjectGrid";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SRAGROUP — Costruzioni e Fotovoltaico" },
    { name: "description", content: "Soluzioni integrate per costruzioni e impianti fotovoltaici in Italia." },
    { property: "og:title", content: "SRAGROUP — Costruzioni e Fotovoltaico" },
    { property: "og:description", content: "Competenza tecnica per edifici ed energia." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <>
      <section className="grid min-h-[calc(100vh-5rem)] md:grid-cols-2">
        <HeroHalf image={images.constructionHero} tone="construction" eyebrow="Costruzioni" title="Spazi solidi. Valore duraturo." text="General contractor per interventi industriali, commerciali e residenziali." to="/costruzioni" />
        <HeroHalf image={images.solarHero} tone="solar" eyebrow="Fotovoltaico" title="Energia che genera futuro." text="Impianti ad alte prestazioni per imprese e grandi superfici." to="/fotovoltaico" />
      </section>
      <section className="bg-charcoal text-offwhite"><div className="site-container grid grid-cols-2 py-8 md:grid-cols-4">{[["25+","anni di esperienza"],["180+","progetti completati"],["85 MWp","potenza installata"],["98%","consegne puntuali"]].map(([n,l])=><div key={l} className="border-l border-offwhite/15 px-4 md:px-8"><strong className="font-display text-3xl md:text-4xl">{n}</strong><p className="mt-1 text-xs text-offwhite/55">{l}</p></div>)}</div></section>
      <section className="site-container py-24"><SectionIntro eyebrow="Un unico gruppo" title="Dalla materia all’energia, una visione integrata." text="Due divisioni specialistiche, una sola cultura del progetto: competenza, responsabilità e controllo diretto di ogni fase."/></section>
      <section className="grid md:grid-cols-2"><Division image={images.constructionHero} title="Costruzioni" text="Edifici industriali, direzionali e residenziali realizzati con rigore esecutivo." to="/costruzioni" tone="construction"/><Division image={images.solarHero} title="Fotovoltaico" text="Soluzioni energetiche complete, dalla progettazione alla gestione dell’impianto." to="/fotovoltaico" tone="solar"/></section>
      <section className="site-container py-24"><SectionIntro eyebrow="Selezione lavori" title="Progetti che misurano la nostra competenza."/><div className="mt-12"><ProjectGrid limit={3}/></div></section>
      <section className="border-y border-border"><div className="site-container grid grid-cols-2 gap-px bg-border md:grid-cols-4">{["ISO 9001","ISO 14001","ISO 45001","SOA"].map(x=><div key={x} className="bg-background py-10 text-center font-display text-xl font-semibold">{x}</div>)}</div></section>
      <CTA />
    </>
  );
}

function HeroHalf({image,tone,eyebrow,title,text,to}:{image:string;tone:"construction"|"solar";eyebrow:string;title:string;text:string;to:"/costruzioni"|"/fotovoltaico"}) { return <div className="group relative isolate flex min-h-[52vh] items-end overflow-hidden p-6 sm:p-10 md:min-h-full md:p-14"><img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width={1600} height={1008}/><div className="absolute inset-0 -z-10 bg-charcoal/55"/><div className="max-w-lg text-offwhite"><p className={`eyebrow ${tone==="construction"?"text-construction":"text-solar"}`}>{eyebrow}</p><h1 className="mt-4 text-4xl font-semibold leading-[1] sm:text-6xl">{title}</h1><p className="mt-5 max-w-md text-sm leading-6 text-offwhite/70">{text}</p><Button asChild className={`mt-7 rounded-none ${tone==="construction"?"bg-construction":"bg-solar"} text-charcoal hover:opacity-90`}><Link to={to}>Scopri la divisione <ArrowRight/></Link></Button></div></div> }
function Division({image,title,text,to,tone}:{image:string;title:string;text:string;to:"/costruzioni"|"/fotovoltaico";tone:"construction"|"solar"}) { return <article className="relative isolate min-h-[540px] overflow-hidden p-8 md:p-14"><img src={image} alt="" loading="lazy" width={1600} height={1008} className="absolute inset-0 -z-20 h-full w-full object-cover"/><div className="absolute inset-0 -z-10 bg-charcoal/60"/><div className="flex h-full flex-col justify-end text-offwhite"><p className={`eyebrow ${tone==="construction"?"text-construction":"text-solar"}`}>Divisione</p><h2 className="mt-3 text-4xl font-semibold">{title}</h2><p className="mt-4 max-w-md text-offwhite/70">{text}</p><Link to={to} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">Approfondisci <ArrowRight className="size-4"/></Link></div></article> }
