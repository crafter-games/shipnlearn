import type { World } from "@/lib/levels/types";
import { acordeon } from "./01-acordeon";
import { popover } from "./02-popover";
import { dialogo } from "./03-dialogo";
import { nombres } from "./04-nombres";

export const htmlAdvanced: World = {
  id: "html-advanced",
  title: "Isla Faro",
  subtitle: "HTML avanzado",
  accent: "#7CC4FF",
  levels: [acordeon, popover, dialogo, nombres],
};
