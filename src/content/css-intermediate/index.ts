import type { World } from "@/lib/levels/types";
import { estante } from "./01-estante";
import { banco } from "./02-banco";
import { catalogo } from "./03-catalogo";
import { areas } from "./04-areas";
import { sellos } from "./05-sellos";
import { avisos } from "./06-avisos";
import { marca } from "./07-marca";
import { engranaje } from "./08-engranaje";

export const cssIntermediate: World = {
  id: "css-intermediate",
  title: "Isla Taller",
  subtitle: "CSS intermedio",
  accent: "#8B5CF6",
  levels: [estante, banco, catalogo, areas, sellos, avisos, marca, engranaje],
};
