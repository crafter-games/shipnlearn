/**
 * Media for the Isla Mercado levels and cards, served from
 * public/levels/mercado/. The preview is a same-origin srcdoc iframe, so
 * short absolute paths resolve and the player's code stays readable.
 * The jingle and the 3 s advert were synthesised for this project (no
 * third-party audio or footage).
 */
const DIR = "/levels/mercado";

/** The market banner in two widths (same picture) and a square crop for phones. */
export const BANNER_480 = `${DIR}/banner-480.svg`;
export const BANNER_960 = `${DIR}/banner-960.svg`;
export const BANNER_SQUARE = `${DIR}/banner-cuadrado.svg`;

/** The mango advert: video, its poster frame and its captions. */
export const MANGO_VIDEO = `${DIR}/anuncio.mp4`;
export const MANGO_POSTER = `${DIR}/anuncio.svg`;
export const MANGO_CAPTIONS = `${DIR}/subtitulos.vtt`;

/** The stall's jingle. */
export const STALL_SONG = `${DIR}/cancion.mp3`;

/** A fruit basket for the order page (320 × 200). */
export const BASKET_SRC = `${DIR}/cesta.svg`;
