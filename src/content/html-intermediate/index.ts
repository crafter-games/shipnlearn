import type { World } from "@/lib/levels/types";
import { formulario } from "./01-formulario";
import { tipos } from "./02-tipos";

export const htmlIntermediate: World = {
  id: "html-intermediate",
  title: "Isla Mercado",
  subtitle: "HTML intermedio",
  accent: "#7ED957",
  levels: [formulario, tipos],
};
