import { $$ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { isUsefulAlt } from "@/content/html-basics/_helpers";
import { HERO_RATIO, HERO_SRC, LANTERN_SRC, PHOTO_RATIO, ROCKS_SRC, STAIRS_SRC } from "./_images";

const PHOTOS = [
  [LANTERN_SRC, "La linterna encendida, con su lámpara amarilla"],
  [STAIRS_SRC, "La escalera de caracol que sube a la linterna"],
  [ROCKS_SRC, "Olas rompiendo contra las rocas al pie del faro"],
] as const;

const page = (hero: string, photo: (src: string, alt: string) => string) => `<h1>Galería del faro</h1>
${hero}
<p>El faro se construyó en 1892 con piedra de la propia isla. Su luz se ve a 20 millas.</p>
<p>Cada noche gira una vez cada 10 segundos: esa es su firma, la que reconocen los barcos.</p>
<p>Lumi y Faustino lo cuidan por turnos. Aquí van algunas fotos de su día a día.</p>

<h2>Fotos de la torre</h2>
${PHOTOS.map(([src, alt]) => photo(src, alt)).join("\n")}
`;

const hero = (ctx: CheckContext) => $$(ctx, "img").find((i) => i.getAttribute("src")?.includes("faro-hero")) as HTMLImageElement | undefined;
const photos = (ctx: CheckContext) =>
  $$(ctx, "img").filter((i) => /linterna|escalera|rocas/.test(i.getAttribute("src") ?? "")) as HTMLImageElement[];

/** width/height written as attributes, in the picture's own aspect ratio. */
const sized = (img: HTMLImageElement | undefined, ratio: number) => {
  if (!img) return false;
  const w = Number(img.getAttribute("width"));
  const h = Number(img.getAttribute("height"));
  return w > 0 && h > 0 && Math.abs(w / h - ratio) / ratio < 0.03;
};

export const imagenes: Level = {
  id: "htmla-07-imagenes",
  worldId: "html-advanced",
  title: "La galería que tarda",
  npc: { name: "Faustino, el farero", avatar: "faustino" },
  story:
    "Mi galería tarda y el texto salta al llegar cada foto. Que la del faro llegue primero y las de abajo, después.",
  concept: "loading=\"lazy\", fetchpriority y width/height",
  lesson:
    "La foto principal pide prioridad y nunca es lazy; las de abajo esperan con loading=\"lazy\". Con width y height, el texto ya no salta.",
  mode: "code",
  starter: {
    html: page(
      `<img src="${HERO_SRC}" alt="El faro al atardecer lanzando su haz sobre el mar" loading="lazy">`,
      (src, alt) => `<img src="${src}" alt="${alt}">`,
    ),
  },
  editable: ["html"],
  solution: {
    html: page(
      `<img src="${HERO_SRC}" alt="El faro al atardecer lanzando su haz sobre el mar" width="640" height="360" fetchpriority="high">`,
      (src, alt) => `<img src="${src}" alt="${alt}" width="320" height="240" loading="lazy" decoding="async">`,
    ),
  },
  checks: [
    {
      id: "hero-eager",
      kind: "required",
      label: "La foto del faro no es lazy",
      explain:
        "La primera foto se ve al entrar: si es lazy, el navegador la pide tarde. Quítale loading=\"lazy\".",
      test: (ctx) => !!hero(ctx) && hero(ctx)!.loading !== "lazy",
    },
    {
      id: "hero-priority",
      kind: "required",
      label: "La foto del faro se pide primero (fetchpriority)",
      explain:
        "Es la imagen más grande de arriba: dale fetchpriority=\"high\" para que llegue antes.",
      test: (ctx) => hero(ctx)?.fetchPriority === "high",
    },
    {
      id: "photos-lazy",
      kind: "required",
      label: "Las 3 fotos de abajo cargan al acercarse (lazy)",
      explain:
        "Nadie las ve al entrar. Con loading=\"lazy\" esperan a que bajes y no frenan la primera foto.",
      test: (ctx) => photos(ctx).length === 3 && photos(ctx).every((i) => i.loading === "lazy"),
    },
    {
      id: "photos-async",
      kind: "required",
      label: "Las fotos de abajo se decodifican aparte (async)",
      explain:
        "decoding=\"async\" deja que el texto se pinte mientras la foto se prepara. Añádelo a las 3.",
      test: (ctx) => photos(ctx).length === 3 && photos(ctx).every((i) => i.decoding === "async"),
    },
    {
      id: "sizes",
      kind: "required",
      label: "Todas las fotos tienen width y height en su proporción",
      explain:
        "Con width y height el hueco se reserva antes de cargar. Faro: 640x360; las demás, 320x240.",
      test: (ctx) => sized(hero(ctx), HERO_RATIO) && photos(ctx).length === 3 && photos(ctx).every((i) => sized(i, PHOTO_RATIO)),
    },
    {
      id: "alts",
      kind: "a11y",
      label: "Cada foto conserva un alt que la describe",
      explain:
        "Los atributos nuevos no sustituyen al alt: quien no ve la foto sigue necesitándolo.",
      test: (ctx) => !!hero(ctx) && [hero(ctx)!, ...photos(ctx)].every((i) => isUsefulAlt(i.getAttribute("alt"))),
    },
  ],
  hints: [
    "La de arriba: fetchpriority alto y sin lazy. Las de abajo: lazy y async. Todas: width y height.",
    "<img src=\"…\" alt=\"…\" width=\"640\" height=\"360\" fetchpriority=\"high\">\n<img src=\"…\" alt=\"…\" width=\"320\" height=\"240\" loading=\"lazy\" decoding=\"async\">",
    "Mira <img> y «Lazy loading» en MDN.",
  ],
  mdn: [
    { label: "MDN: <img>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/img" },
    {
      label: "MDN: Lazy loading",
      url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading",
    },
    {
      label: "MDN: fetchpriority",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority",
    },
  ],
  cards: ["htmla-loading-lazy", "htmla-fetchpriority", "htmla-img-size"],
};
