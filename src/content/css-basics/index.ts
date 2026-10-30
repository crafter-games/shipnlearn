import type { World } from "@/lib/levels/types";
import { color } from "./01-color";
import { clases } from "./02-clases";

export const cssBasics: World = {
  id: "css-basics",
  title: "Isla Estilo",
  subtitle: "CSS fundamental",
  accent: "#FF5D73",
  levels: [
    color,
    clases,
  ],
};
