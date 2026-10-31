import type { World } from "@/lib/levels/types";
import { acordeon } from "./01-acordeon";
import { popover } from "./02-popover";

export const htmlAdvanced: World = {
  id: "html-advanced",
  title: "Isla Faro",
  subtitle: "HTML avanzado",
  accent: "#7CC4FF",
  levels: [acordeon, popover],
};
