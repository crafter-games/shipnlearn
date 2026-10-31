import type { World } from "@/lib/levels/types";
import { formulario } from "./01-formulario";
import { tipos } from "./02-tipos";
import { validacion } from "./03-validacion";
import { opciones } from "./04-opciones";
import { tabla } from "./05-tabla";
import { cuentas } from "./06-cuentas";
import { media } from "./07-media";
import { responsive } from "./08-responsive";
import { pedido } from "./09-pedido";

export const htmlIntermediate: World = {
  id: "html-intermediate",
  title: "Isla Mercado",
  subtitle: "HTML intermedio",
  accent: "#7ED957",
  levels: [formulario, tipos, validacion, opciones, tabla, cuentas, media, responsive, pedido],
};
