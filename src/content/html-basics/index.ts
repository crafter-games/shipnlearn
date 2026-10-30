import type { World } from "@/lib/levels/types";
import { titulo } from "./01-titulo";
import { encabezados } from "./02-encabezados";
import { enfasis } from "./03-enfasis";
import { listas } from "./04-listas";
import { enlaces } from "./05-enlaces";
import { imagenes } from "./06-imagenes";
import { documento } from "./07-documento";
import { estructura } from "./08-estructura";

export const htmlBasics: World = {
  id: "html-basics",
  title: "Isla Marcado",
  subtitle: "HTML fundamental",
  accent: "#FFD66B",
  levels: [titulo, encabezados, enfasis, listas, enlaces, imagenes, documento, estructura],
};
