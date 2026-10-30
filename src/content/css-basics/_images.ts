import { svgDataUri } from "./_helpers";

/**
 * Small flat illustrations used inside Isla Estilo level pages. Previews render
 * in an iframe without the app's theme, so colours are hex: ink #1B1F3B,
 * sand #FFD66B, coral #FF5D73, lime #7ED957, foam #F4F7FF.
 */

const INK = "#1B1F3B";
const svg = (viewBox: string, body: string, strokeWidth = 2.5) =>
  svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="${INK}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`,
  );

// ---------------------------------------------------------------------------
// css-10: three plants, each in a coral pot
// ---------------------------------------------------------------------------

const POT = `<path d="M18 44 H46 L42 60 H22 Z" fill="#FF5D73"/><rect x="15" y="39" width="34" height="7" rx="2" fill="#FF5D73"/>`;

export const CACTUS_SRC = svg(
  "0 0 64 64",
  `<path d="M26 41 V34 h-4 a6 6 0 0 1 -6 -6 V22 a4 4 0 0 1 8 0 V27 h2 V16 a6 6 0 0 1 12 0 V24 h2 V20 a4 4 0 0 1 8 0 V28 a6 6 0 0 1 -6 6 h-4 V41 Z" fill="#7ED957"/>
<path d="M32 18 v4 M32 28 v4 M20 25 v2 M44 23 v2" stroke-width="2"/>
<circle cx="32" cy="9" r="3.5" fill="#FF5D73"/>${POT}`,
);

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315]
  .map((a) => `<ellipse cx="32" cy="9" rx="4" ry="7" transform="rotate(${a} 32 18)"/>`)
  .join("");

export const SUNFLOWER_SRC = svg(
  "0 0 64 64",
  `<path d="M32 41 V26" stroke="#2E8B3E" stroke-width="4"/><path d="M32 38 q-13 0 -15 -9 q11 0 15 9 Z M32 34 q11 0 13 -7 q-10 0 -13 7 Z" fill="#7ED957"/>
<g fill="#FFB23F" stroke-width="2">${PETALS}</g><circle cx="32" cy="18" r="6.5" fill="#8B5E34"/>${POT}`,
);

export const PALM_SRC = svg(
  "0 0 64 64",
  `<path d="M29 41 Q27 28 32 15 L36 16 Q32 28 35 41 Z" fill="#C98B4E"/><path d="M29.5 34 h5 M29.5 27 h4.5 M31 21 h4" stroke-width="2"/>
<g fill="#7ED957"><path d="M33 14 C20 10 12 20 12 30 C18 22 28 22 33 14 Z"/><path d="M33 14 C46 10 54 20 54 30 C48 22 38 22 33 14 Z"/><path d="M33 14 C25 2 10 4 5 14 C14 12 24 16 33 14 Z"/><path d="M33 14 C41 2 56 4 61 14 C52 12 42 16 33 14 Z"/><path d="M33 14 C30 6 34 1 41 1 C40 7 38 12 33 14 Z"/></g>
<circle cx="31" cy="17" r="2.5" fill="#8B5E34"/><circle cx="36" cy="17.5" r="2.5" fill="#8B5E34"/>${POT}`,
);

// ---------------------------------------------------------------------------
// css-07: one ice-cream scoop per flavour
// ---------------------------------------------------------------------------

const scoop = (fill: string, extra = "") =>
  svg(
    "0 0 32 32",
    `<path d="M9 15 L16 30 L23 15 Z" fill="#E0A458"/><path d="M12.5 19 l5 5 M15 16 l5 5 M19.5 16 l-5 5" stroke-width="1"/>
<path d="M7 15 a9 9 0 0 1 18 0 q-2 3 -4 0 q-2 3 -5 0 q-3 3 -5 0 q-2 3 -4 0 Z" fill="${fill}"/>${extra}`,
    1.8,
  );

export const STRAWBERRY_SRC = scoop(
  "#FF5D73",
  `<path d="M12 10 v1 M17 8 v1 M20 12 v1" stroke="#F4F7FF" stroke-width="1.6"/>`,
);
export const MANGO_SRC = scoop("#FFB23F");
export const COCONUT_SRC = scoop(
  "#F4F7FF",
  `<path d="M12 10 h1.5 M18 8 h1.5 M19 12 h1.5" stroke="#8B5E34" stroke-width="1.6"/>`,
);
