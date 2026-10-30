import type { World } from "@/lib/levels/types";
import { color } from "./01-color";
import { clases } from "./02-clases";
import { cartel } from "./03-cartel";
import { tipografia } from "./04-tipografia";
import { caja } from "./05-caja";
import { especificidad } from "./06-especificidad";

export const cssBasics: World = {
  id: "css-basics",
  title: "Isla Estilo",
  subtitle: "CSS fundamental",
  accent: "#FF5D73",
  levels: [
    color,
    clases,
    cartel,
    tipografia,
    caja,
    especificidad,
  ],
};
