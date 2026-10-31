import type { World } from "@/lib/levels/types";
import { anidado } from "./01-anidado";
import { has } from "./02-has";
import { capas } from "./03-capas";
import { contenedor } from "./04-contenedor";

export const cssAdvanced: World = {
  id: "css-advanced",
  title: "Isla Volcán",
  subtitle: "CSS avanzado",
  accent: "#E8590C",
  levels: [anidado, has, capas, contenedor],
};
