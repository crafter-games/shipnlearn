/**
 * Small inline illustrations for the Isla Mercado levels. Each SVG root has
 * an id so checks can tell images apart by their URL.
 *
 * `compact` keeps a data URI free of whitespace (spaces become %20), so it
 * also works inside srcset, where a space separates the URL from its
 * descriptor.
 */
const compact = (svg: string) =>
  `data:image/svg+xml,${svg
    .replace(/>\s+</g, "><")
    .trim()
    .replace(/\s+/g, "%20")
    .replace(/#/g, "%23")
    .replace(/"/g, "'")}`;

/** Striped awning + fruit, drawn at `w`×`h`; `tag` is the version label in the corner. */
const stall = (id: string, w: number, h: number, tag: string) => {
  const stripes = Array.from({ length: 8 }, (_, i) =>
    i % 2 ? "" : `<rect x="${(i * w) / 8}" width="${w / 8}" height="${h * 0.3}" fill="#FF5D73"/>`,
  ).join("");
  const r = Math.min(w * 0.08, h * 0.12);
  const y = h * 0.68;
  return compact(`<svg xmlns="http://www.w3.org/2000/svg" id="${id}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="#FFF4E0"/>
<rect width="${w}" height="${h * 0.3}" fill="#FFFFFF"/>${stripes}
<rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="#C98A4B"/>
<circle cx="${w * 0.3}" cy="${y}" r="${r}" fill="#FFB23F"/>
<circle cx="${w * 0.5}" cy="${y}" r="${r}" fill="#7ED957"/>
<circle cx="${w * 0.7}" cy="${y}" r="${r}" fill="#FF5D73"/>
<rect x="${w - 92}" y="${h - 34}" width="84" height="26" rx="8" fill="#1B1F3B"/>
<text x="${w - 50}" y="${h - 16}" font-family="sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">${tag}</text>
</svg>`);
};

/** The market banner in two widths (same picture) and a square crop for phones. */
export const BANNER_480 = stall("cartel-480", 480, 200, "480 px");
export const BANNER_960 = stall("cartel-960", 960, 400, "960 px");
export const BANNER_SQUARE = stall("cartel-cuadrado", 400, 400, "cuadrado");

/** Poster frame for the mango advert video (320 × 180). */
export const MANGO_POSTER = compact(`<svg xmlns="http://www.w3.org/2000/svg" id="anuncio" viewBox="0 0 320 180">
<rect width="320" height="180" fill="#FFD66B"/>
<ellipse cx="160" cy="100" rx="70" ry="52" fill="#FF9F1C"/>
<path d="M160 48 q20 -26 44 -18 q-18 22 -44 18" fill="#2BB673"/>
<circle cx="160" cy="100" r="22" fill="#1B1F3B" opacity=".8"/>
<path d="M153 89 L172 100 L153 111 Z" fill="#FFFFFF"/>
</svg>`);

/** A fruit basket for the order page (320 × 200). */
export const BASKET_SRC = compact(`<svg xmlns="http://www.w3.org/2000/svg" id="cesta" viewBox="0 0 320 200">
<rect width="320" height="200" fill="#EAF3FF"/>
<circle cx="120" cy="96" r="30" fill="#FF9F1C"/>
<circle cx="168" cy="86" r="30" fill="#7ED957"/>
<circle cx="210" cy="100" r="26" fill="#FF5D73"/>
<path d="M60 110 H260 L240 180 H80 Z" fill="#C98A4B"/>
<path d="M70 130 H250 M76 152 H244" stroke="#8A5A2B" stroke-width="6"/>
</svg>`);
