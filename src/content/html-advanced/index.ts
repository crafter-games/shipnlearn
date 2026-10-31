import type { World } from "@/lib/levels/types";
import { acordeon } from "./01-acordeon";
import { popover } from "./02-popover";
import { dialogo } from "./03-dialogo";
import { nombres } from "./04-nombres";
import { avisos } from "./05-avisos";
import { metadatos } from "./06-metadatos";
import { imagenes } from "./07-imagenes";
import { inerte } from "./08-inerte";

export const htmlAdvanced: World = {
  id: "html-advanced",
  title: "Isla Faro",
  subtitle: "HTML avanzado",
  accent: "#7CC4FF",
  levels: [acordeon, popover, dialogo, nombres, avisos, metadatos, imagenes, inerte],
};
