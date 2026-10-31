import { svgDataUri } from "@/content/css-basics/_helpers";

/** Small volcano with a lava plume, for sensor readings. Decorative (alt=""). */
export const VOLCANO_SRC = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#FFE1C2"/>
  <path d="M8 56 L26 24 H38 L56 56 Z" fill="#5C3A2E" stroke="#2B1B17" stroke-width="3" stroke-linejoin="round"/>
  <path d="M26 24 Q32 32 38 24" fill="#E8590C"/>
  <path d="M29 24 Q27 14 32 8 Q37 14 35 24 Z" fill="#E8590C" stroke="#2B1B17" stroke-width="2"/>
  <path d="M30 30 L28 40 M35 30 L37 44" stroke="#E8590C" stroke-width="3" stroke-linecap="round"/>
</svg>`);
