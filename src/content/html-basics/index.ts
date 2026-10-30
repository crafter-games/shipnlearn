import type { World } from "@/lib/levels/types";
import { titulo } from "./01-titulo";
import { encabezados } from "./02-encabezados";

export const htmlBasics: World = {
  id: "html-basics",
  title: "Isla Marcado",
  subtitle: "HTML fundamental",
  accent: "#FFD66B",
  levels: [titulo, encabezados],
};
