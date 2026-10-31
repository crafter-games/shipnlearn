import { svgUri } from "@/content/html-basics/_helpers";

/**
 * Inline illustrations for Isla Faro. Each SVG root carries an id so checks
 * can tell the images apart by their `src`, and a fixed intrinsic size so
 * checks know the right aspect ratio.
 */

/** Hero: the lighthouse at dusk, 640 x 360 (16:9). */
export const HERO_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="faro-hero" width="640" height="360" viewBox="0 0 640 360">
<rect width="640" height="360" fill="#4C6FFF"/>
<rect y="200" width="640" height="160" fill="#1E90FF"/>
<path d="M300 300 L312 120 H328 L340 300 Z" fill="#FF5D73"/>
<rect x="310" y="160" width="20" height="18" fill="#F4F7FF"/>
<rect x="310" y="220" width="20" height="18" fill="#F4F7FF"/>
<rect x="304" y="96" width="32" height="26" fill="#1B1F3B"/>
<circle cx="320" cy="108" r="9" fill="#FFD66B"/>
<path d="M330 104 L640 40 V170 Z" fill="#FFD66B" opacity="0.5"/>
<path d="M240 300 H400 L380 330 H260 Z" fill="#1B1F3B"/>
</svg>`);

/** Lantern room, 320 x 240 (4:3). */
export const LANTERN_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="linterna" width="320" height="240" viewBox="0 0 320 240">
<rect width="320" height="240" fill="#1B1F3B"/>
<rect x="110" y="70" width="100" height="110" rx="10" fill="#8EDBFF"/>
<circle cx="160" cy="125" r="34" fill="#FFD66B"/>
<path d="M100 70 L160 30 L220 70 Z" fill="#FF5D73"/>
<rect x="90" y="180" width="140" height="16" fill="#FF5D73"/>
</svg>`);

/** Spiral stairs, 320 x 240 (4:3). */
export const STAIRS_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="escalera" width="320" height="240" viewBox="0 0 320 240">
<rect width="320" height="240" fill="#FFF4E0"/>
<path d="M60 210 H120 V180 H160 V150 H200 V120 H240 V90 H280 V240 H60 Z" fill="#FF8A3D"/>
<rect x="150" y="20" width="20" height="200" fill="#1B1F3B"/>
</svg>`);

/** Rocks and waves at the foot of the lighthouse, 320 x 240 (4:3). */
export const ROCKS_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="rocas" width="320" height="240" viewBox="0 0 320 240">
<rect width="320" height="240" fill="#8EDBFF"/>
<path d="M0 170 L60 120 L110 160 L170 100 L240 150 L320 130 V240 H0 Z" fill="#6B7280"/>
<path d="M0 200 Q40 180 80 200 T160 200 T240 200 T320 200 V240 H0 Z" fill="#1E90FF"/>
</svg>`);

/** Hero ratio and the ratio shared by every gallery photo. */
export const HERO_RATIO = 640 / 360;
export const PHOTO_RATIO = 320 / 240;

/** 16 x 16 favicon: the lamp of the lighthouse. */
export const FAVICON_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<rect width="16" height="16" rx="3" fill="#1B1F3B"/>
<path d="M6 14 L7 5 H9 L10 14 Z" fill="#FF5D73"/>
<circle cx="8" cy="4" r="2" fill="#FFD66B"/>
</svg>`);
