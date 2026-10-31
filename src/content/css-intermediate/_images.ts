import { svgDataUri } from "@/content/css-basics/_helpers";

/**
 * Flat tool illustrations for Isla Taller level pages. Previews render in an
 * iframe without the app's theme, so colours are hex: ink #1B1F3B, wood
 * #C98B4E, dark wood #6B3E1F, steel #B8C2D6, grape #8B5CF6, sand #FFD66B.
 */

const INK = "#1B1F3B";
const tool = (body: string) =>
  svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`,
  );

export const HAMMER_SRC = tool(
  `<path d="M30 24 L40 24 L40 58 Q35 61 30 58 Z" fill="#C98B4E"/><path d="M14 10 H44 L52 16 L44 22 H14 Q10 16 14 10 Z" fill="#B8C2D6"/><path d="M44 10 V22"/>`,
);

export const SAW_SRC = tool(
  `<path d="M8 38 L44 20 L52 36 L16 54 Z" fill="#B8C2D6"/><path d="M16 54 l2 -5 l3 3 l2 -5 l3 3 l2 -5 l3 3 l2 -5 l3 3 l2 -5 l3 3 l2 -5 l3 3 l2 -5" stroke-width="1.8"/><path d="M44 20 L54 14 Q62 18 60 28 L52 36 Z" fill="#C98B4E"/><circle cx="54" cy="24" r="2.5" fill="#fff"/>`,
);

export const WRENCH_SRC = tool(
  `<path d="M44 6 a12 12 0 0 0 -10 17 L10 47 a5 5 0 0 0 7 7 L41 30 a12 12 0 0 0 17 -10 l-7 5 l-7 -2 l-2 -7 Z" fill="#B8C2D6"/><circle cx="14" cy="50" r="2" fill="${INK}"/>`,
);

export const SCREWDRIVER_SRC = tool(
  `<path d="M36 28 L52 12 Q56 10 56 14 L40 32" fill="#B8C2D6"/><path d="M52 12 l4 -4" stroke-width="3"/><path d="M14 54 Q8 50 12 44 L30 26 L40 36 L22 54 Q18 58 14 54 Z" fill="#8B5CF6"/><path d="M20 42 L28 50 M25 37 L33 45" stroke-width="2"/>`,
);

export const PLIERS_SRC = tool(
  `<path d="M28 30 L22 6 Q26 4 30 6 L34 28 Z M36 30 L42 6 Q38 4 34 6 L30 28 Z" fill="#B8C2D6"/><path d="M28 30 Q16 44 18 60 L24 60 Q24 46 32 36 Z" fill="#FF5D73"/><path d="M36 30 Q48 44 46 60 L40 60 Q40 46 32 36 Z" fill="#FF5D73"/><circle cx="32" cy="31" r="3.5" fill="#FFD66B"/>`,
);

export const TAPE_SRC = tool(
  `<rect x="8" y="14" width="38" height="38" rx="10" fill="#FFD66B"/><circle cx="27" cy="33" r="9" fill="#fff"/><circle cx="27" cy="33" r="3" fill="${INK}"/><path d="M46 44 H58 V50 H46" fill="#FFF4D6"/><path d="M50 44 v3 M54 44 v3" stroke-width="1.8"/>`,
);

export const GEAR_SRC = tool(
  `<path d="M28 4 h8 l1 7 l6 3 l6 -4 l6 6 l-4 6 l3 6 l7 1 v8 l-7 1 l-3 6 l4 6 l-6 6 l-6 -4 l-6 3 l-1 7 h-8 l-1 -7 l-6 -3 l-6 4 l-6 -6 l4 -6 l-3 -6 l-7 -1 v-8 l7 -1 l3 -6 l-4 -6 l6 -6 l6 4 l6 -3 Z" fill="#FFD66B"/><circle cx="32" cy="32" r="9" fill="#fff"/>`,
);

/** Tool name and image, in catalogue order. */
export const TOOLS = [
  { name: "Martillo", src: HAMMER_SRC },
  { name: "Serrucho", src: SAW_SRC },
  { name: "Llave inglesa", src: WRENCH_SRC },
  { name: "Destornillador", src: SCREWDRIVER_SRC },
  { name: "Alicates", src: PLIERS_SRC },
  { name: "Metro", src: TAPE_SRC },
] as const;
