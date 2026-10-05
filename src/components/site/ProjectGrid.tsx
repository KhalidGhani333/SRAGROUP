import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects, type Division } from "@/data/projects";

export function ProjectGrid({ limit }: { limit?:number }) {
 const [filter,setFilter]=useState<"Tutti"|Division>("Tutti");
 const filtered=projects.filter(p=>filter==="Tutti"||p.division===filter).slice(0,limit);
 return <><div className="mb-10 flex gap-2 overflow-x-auto">{(["Tutti","Costruzioni","Fotovoltaico"] as const).map(x=><Button key={x} variant={filter===x?"default":"outline"} className="rounded-none" onClick={()=>setFilter(x)}>{x}</Button>)}</div><div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">{filtered.map((p,i)=><article key={p.title} className="group"><div className="aspect-[4/3] overflow-hidden bg-muted"><img src={p.image} alt={p.title} width={1408} height={912} loading={i<3?"eager":"lazy"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"/></div><div className="flex items-start justify-between border-b border-border py-5"><div><p className={`eyebrow ${p.division==="Costruzioni"?"text-construction":"text-solar"}`}>{p.division} · {p.year}</p><h3 className="mt-2 text-xl font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.location} · {p.metric}</p></div><ArrowUpRight className="mt-1 size-5 text-muted-foreground"/></div></article>)}</div></>
}
