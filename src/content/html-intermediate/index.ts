import type { World } from "@/lib/levels/types";
import { formulario } from "./01-formulario";
import { tipos } from "./02-tipos";
import { validacion } from "./03-validacion";
import { opciones } from "./04-opciones";

export const htmlIntermediate: World = {
  id: "html-intermediate",
  title: "Isla Mercado",
  subtitle: "HTML intermedio",
  accent: "#7ED957",
  levels: [formulario, tipos, validacion, opciones],
};
