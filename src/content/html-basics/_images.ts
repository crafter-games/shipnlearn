import { svgUri } from "./_helpers";

/**
 * Small inline illustrations used by the Isla Marcado levels. Each SVG root
 * carries an id so checks can tell the images apart by their `src`.
 */

export const LIBRARY_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="biblioteca" viewBox="0 0 320 200">
<rect width="320" height="200" fill="#8EDBFF"/>
<rect y="160" width="320" height="40" fill="#FFD66B"/>
<path d="M60 80 L160 30 L260 80 Z" fill="#FF5D73"/>
<rect x="75" y="80" width="170" height="85" fill="#FFF4E0"/>
<rect x="95" y="100" width="20" height="45" fill="#4C6FFF"/>
<rect x="120" y="105" width="15" height="40" fill="#2BB673"/>
<rect x="140" y="98" width="18" height="47" fill="#FF8A3D"/>
<rect x="190" y="115" width="30" height="50" fill="#1B1F3B"/>
</svg>`);

export const WAVE_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="ola" viewBox="0 0 320 40">
<path d="M0 20 Q40 0 80 20 T160 20 T240 20 T320 20 V40 H0 Z" fill="#4C6FFF"/>
</svg>`);

export const SOUP_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" id="sopa" viewBox="0 0 320 200">
<rect width="320" height="200" fill="#FFF4E0"/>
<path d="M120 50 q10 -20 0 -40 M160 50 q10 -20 0 -40 M200 50 q10 -20 0 -40" stroke="#B9C2D0" stroke-width="6" fill="none"/>
<path d="M50 80 H270 Q260 180 160 180 Q60 180 50 80 Z" fill="#FF5D73"/>
<ellipse cx="160" cy="80" rx="110" ry="18" fill="#FF8A3D"/>
<circle cx="130" cy="80" r="8" fill="#FFF4E0"/>
<circle cx="185" cy="78" r="6" fill="#2BB673"/>
</svg>`);
