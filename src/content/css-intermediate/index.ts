import type { World } from "@/lib/levels/types";
import { estante } from "./01-estante";
import { banco } from "./02-banco";

export const cssIntermediate: World = {
  id: "css-intermediate",
  title: "Isla Taller",
  subtitle: "CSS intermedio",
  accent: "#8B5CF6",
  levels: [estante, banco],
};
