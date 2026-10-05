import constructionHero from "@/assets/construction-hero.jpg";
import solarHero from "@/assets/solar-hero.jpg";
import projectConstruction from "@/assets/project-construction.jpg";
import projectSolar from "@/assets/project-solar.jpg";
export type Division = "Costruzioni" | "Fotovoltaico";
export const projects = [
 {title:"Hub logistico Nord",location:"Piacenza",year:"2026",division:"Costruzioni" as Division,metric:"42.000 m²",image:projectConstruction},
 {title:"Solar Park Valdichiana",location:"Arezzo",year:"2025",division:"Fotovoltaico" as Division,metric:"18,4 MWp",image:solarHero},
 {title:"Campus direzionale",location:"Milano",year:"2025",division:"Costruzioni" as Division,metric:"16.800 m²",image:constructionHero},
 {title:"Copertura industriale",location:"Bergamo",year:"2025",division:"Fotovoltaico" as Division,metric:"2,8 MWp",image:projectSolar},
 {title:"Residenze Porta Est",location:"Bologna",year:"2024",division:"Costruzioni" as Division,metric:"96 unità",image:projectConstruction},
 {title:"Impianto agrivoltaico",location:"Foggia",year:"2024",division:"Fotovoltaico" as Division,metric:"9,6 MWp",image:solarHero},
];
