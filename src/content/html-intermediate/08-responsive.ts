import { $, $$ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { isUsefulAlt, MARKET_CSS, settle, srcsetCandidates } from "./_helpers";
import { BANNER_480, BANNER_960, BANNER_SQUARE } from "./_images";

const ALT = "Puesto de fruta con toldo de rayas y tres frutas";

const starter = `<h2>Cartel del mercado</h2>
<!-- Salen las tres versiones. -->
<img src="${BANNER_480}"
  alt="${ALT}">
<img src="${BANNER_960}"
  alt="${ALT}">
<img src="${BANNER_SQUARE}"
  alt="${ALT}">
`;

const solution = `<h2>Cartel del mercado</h2>
<picture>
  <source media="(max-width: 500px)"
    srcset="${BANNER_SQUARE}">
  <img src="${BANNER_960}"
    srcset="${BANNER_480} 480w,
            ${BANNER_960} 960w"
    sizes="(max-width: 700px) 100vw, 700px"
    alt="${ALT}">
</picture>
`;

const banner = (ctx: CheckContext) => $(ctx, "img") as HTMLImageElement | null;

/** Resize the preview and wait (a few frames at most) for the image to pick a file. */
async function chosenAt(ctx: CheckContext, width: number): Promise<string> {
  await ctx.setViewport(width);
  for (let i = 0; i < 6; i++) {
    await settle(ctx.win);
    const src = banner(ctx)?.currentSrc ?? "";
    if (src) return src;
  }
  return banner(ctx)?.currentSrc ?? "";
}

export const responsive: Level = {
  id: "htmli-08-responsive",
  worldId: "html-intermediate",
  title: "El cartel que se adapta",
  npc: { name: "Marisol, la frutera", avatar: "marisol" },
  story:
    "Mi cartel viene en tres tamaños y salen los tres. Quiero uno: el cuadrado en el móvil y el ancho en lo demás.",
  concept: "srcset, sizes y <picture>",
  lesson:
    "srcset y sizes dejan al navegador bajar la versión justa. <picture> con <source media> cambia de recorte según la pantalla.",
  mode: "code",
  starter: { html: starter, css: MARKET_CSS },
  editable: ["html"],
  solution: { html: solution, css: MARKET_CSS },
  checks: [
    {
      id: "one-image",
      kind: "required",
      label: "Solo hay un <img> para el cartel",
      explain:
        "Tres <img> descargan tres archivos. Deja un solo <img> y pon las versiones en srcset y <source>.",
      test: (ctx) => $$(ctx, "img").length === 1,
    },
    {
      id: "srcset",
      kind: "required",
      label: "srcset ofrece las versiones de 480 y 960 con su ancho",
      explain:
        "Cada versión va con su ancho real: srcset=\"…480… 480w, …960… 960w\". La w es de width.",
      test: (ctx) => {
        const list = srcsetCandidates(banner(ctx)?.getAttribute("srcset") ?? null);
        const has = (file: string, w: string) => list.some((c) => c.url.endsWith(file) && c.descriptor === w);
        return has("banner-480.svg", "480w") && has("banner-960.svg", "960w");
      },
    },
    {
      id: "sizes",
      kind: "required",
      label: "sizes dice cuánto ocupa el cartel",
      explain:
        "Sin sizes, el navegador cree que ocupa toda la pantalla. Prueba sizes=\"(max-width: 700px) 100vw, 700px\".",
      test: (ctx) => (banner(ctx)?.sizes ?? "").trim().length > 0,
    },
    {
      id: "art-direction",
      kind: "required",
      label: "En pantallas estrechas se ve el recorte cuadrado",
      explain:
        "Mete el <img> en <picture> y ponle delante <source media=\"(max-width: 500px)\" srcset=\"…cuadrado.svg\">.",
      test: async (ctx) => {
        if (!banner(ctx)?.closest("picture")) return false;
        const narrow = await chosenAt(ctx, 360);
        const wide = await chosenAt(ctx, 1000);
        return narrow.endsWith("/banner-cuadrado.svg") && /\/banner-(480|960)\.svg$/.test(wide);
      },
    },
    {
      id: "alt",
      kind: "a11y",
      label: "El <img> conserva un alt que describe el puesto",
      explain:
        "El alt va en el <img>, no en <source>, y sirve para todas las versiones. Describe lo que se ve.",
      test: (ctx) => isUsefulAlt(banner(ctx)?.getAttribute("alt") ?? null),
    },
  ],
  hints: [
    "Un solo <img> con srcset y sizes, dentro de <picture>. El <source media> va antes, con el cuadrado.",
    '<picture>\n  <source media="(max-width: 500px)" srcset="…cuadrado…">\n  <img src="…960…" srcset="…480… 480w, …960… 960w" sizes="…" alt="…">\n</picture>',
    "Mira «Imágenes responsivas» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Imágenes responsivas",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Guides/Responsive_images",
    },
    { label: "MDN: <picture>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/picture" },
  ],
  cards: ["htmli-srcset-sizes", "htmli-picture"],
};
