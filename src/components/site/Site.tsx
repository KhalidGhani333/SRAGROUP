import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Building2, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import constructionHero from "@/assets/construction-hero.jpg";
import solarHero from "@/assets/solar-hero.jpg";

export const images = { constructionHero, solarHero };

const nav = [
  ["/", "Home"], ["/chi-siamo", "Chi Siamo"], ["/costruzioni", "Costruzioni"],
  ["/fotovoltaico", "Fotovoltaico"], ["/progetti", "Progetti"], ["/contatti", "Contatti"],
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`flex items-center gap-2.5 font-display text-xl font-bold ${light ? "text-offwhite" : "text-foreground"}`} aria-label="SRAGROUP home"><span className="grid size-9 place-items-center border border-current"><Building2 className="size-5" /></span><span>SRA<span className="font-normal text-muted-foreground">GROUP</span></span></Link>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
    <div className="site-container grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
      <Logo />
      <nav className="hidden items-center justify-center gap-7 lg:flex">{nav.map(([to,label]) => <Link key={to} to={to} className={`text-xs font-semibold uppercase tracking-[.12em] transition-colors hover:text-foreground ${pathname===to ? "text-foreground" : "text-muted-foreground"}`}>{label}</Link>)}</nav>
      <Button asChild className="hidden rounded-none lg:inline-flex"><Link to="/contatti">Richiedi un preventivo <ArrowRight /></Link></Button>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Apri menu">{open ? <X/> : <Menu/>}</Button>
    </div>
    {open && <nav className="border-t border-border bg-background px-5 py-5 lg:hidden">{nav.map(([to,label]) => <Link key={to} to={to} onClick={()=>setOpen(false)} className="block border-b border-border py-3 font-display text-lg">{label}</Link>)}<Button asChild className="mt-5 w-full rounded-none"><Link to="/contatti" onClick={()=>setOpen(false)}>Richiedi un preventivo</Link></Button></nav>}
  </header>;
}

export function SiteFooter() {
  return <footer className="bg-charcoal text-offwhite"><div className="site-container grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1.4fr]">
    <div><Logo light/><p className="mt-5 max-w-xs text-sm leading-6 text-offwhite/60">Costruiamo spazi e produciamo energia per imprese che guardano avanti.</p></div>
    <div><p className="eyebrow text-offwhite/45">Navigazione</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm">{nav.slice(1).map(([to,label])=><Link key={to} to={to} className="text-offwhite/70 hover:text-offwhite">{label}</Link>)}</div></div>
    <div><p className="eyebrow text-offwhite/45">Contatti diretti</p><div className="mt-5 grid gap-3 text-sm text-offwhite/70"><p>Direzione · direzione@sragroup.it</p><p>Costruzioni · costruzioni@sragroup.it</p><p>Fotovoltaico · energia@sragroup.it</p></div></div>
  </div><div className="border-t border-offwhite/10"><div className="site-container flex flex-col gap-3 py-6 text-xs text-offwhite/45 sm:flex-row sm:justify-between"><p>© 2026 SRAGROUP · P.IVA 00000000000</p><p><a href="#">Privacy Policy</a> · <a href="#">Cookie Policy</a></p></div></div></footer>;
}

export function PageHero({ eyebrow, title, text, image, tone="neutral" }: { eyebrow:string; title:string; text:string; image:string; tone?:"construction"|"solar"|"neutral" }) {
  return <section className="relative isolate min-h-[64vh] overflow-hidden bg-charcoal text-offwhite"><img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" width={1600} height={1008}/><div className="absolute inset-0 -z-10 bg-charcoal/65"/><div className="site-container flex min-h-[64vh] items-end py-16 md:py-24"><div className="max-w-3xl"><p className={`eyebrow ${tone==="construction"?"text-construction":tone==="solar"?"text-solar":"text-offwhite/65"}`}>{eyebrow}</p><h1 className="mt-5 text-5xl font-semibold leading-[.95] sm:text-6xl md:text-8xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-offwhite/75">{text}</p></div></div></section>;
}

export function SectionIntro({ eyebrow, title, text, tone="neutral" }: { eyebrow:string; title:string; text?:string; tone?:"construction"|"solar"|"neutral" }) {
 return <div className="grid gap-5 md:grid-cols-[.55fr_1.45fr]"><p className={`eyebrow pt-2 ${tone==="construction"?"text-construction":tone==="solar"?"text-solar":"text-muted-foreground"}`}>{eyebrow}</p><div><h2 className="text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>{text&&<p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{text}</p>}</div></div>
}

export function CTA({ title="Parliamo del vostro prossimo progetto.", tone="neutral" }: { title?:string; tone?:"construction"|"solar"|"neutral" }) { return <section className={`py-16 ${tone==="construction"?"bg-construction":tone==="solar"?"bg-solar":"bg-foreground"}`}><div className="site-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><h2 className={`max-w-3xl text-3xl font-semibold sm:text-5xl ${tone==="neutral"?"text-background":"text-charcoal"}`}>{title}</h2><Button asChild variant={tone==="neutral"?"secondary":"default"} className="h-12 shrink-0 rounded-none px-6"><Link to="/contatti">Richiedi un preventivo <ArrowRight/></Link></Button></div></section> }

export function NumberedSteps({ items }: { items: {title:string; text:string}[] }) { return <div className="grid border-y border-border md:grid-cols-5">{items.map((item,i)=><div key={item.title} className="border-b border-border py-7 md:border-b-0 md:border-r md:px-6 first:pl-0 last:border-r-0"><span className="font-display text-sm text-muted-foreground">0{i+1}</span><h3 className="mt-8 text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p></div>)}</div> }

export function ContactDetails() { return <div className="space-y-3 text-sm"><p className="flex items-center gap-3"><MapPin className="size-4"/> Milano, Lombardia</p><p className="flex items-center gap-3"><Phone className="size-4"/> +39 02 0000 0000</p><p className="flex items-center gap-3"><Mail className="size-4"/> info@sragroup.it</p></div> }

export function AppLayout({ children }: { children:ReactNode }) { return <><SiteHeader/><main>{children}</main><SiteFooter/></> }
