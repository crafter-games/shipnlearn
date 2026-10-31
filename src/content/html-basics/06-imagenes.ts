import { $ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { hasPixelAttr, isUsefulAlt } from "./_helpers";
import { LIBRARY_SRC, WAVE_SRC } from "./_images";

const photo = (ctx: CheckContext) => $(ctx, `img[src*="id='biblioteca'"]`) as HTMLImageElement | null;
const wave = (ctx: CheckContext) => $(ctx, `img[src*="id='ola'"]`) as HTMLImageElement | null;

const page = (photoAttrs: string, waveAttrs: string) => `<h2>Club de lectura</h2>
<p>Todos los jueves al atardecer, en la biblioteca de la isla. Trae un libro y una toalla.</p>

<!-- Foto de la biblioteca: mide 320 × 200 -->
<img src="${LIBRARY_SRC}"${photoAttrs}>

<!-- Ola de adorno: solo decora -->
<img src="${WAVE_SRC}"${waveAttrs}>
`;

export const imagenes: Level = {
  id: "html-06-imagenes",
  worldId: "html-basics",
  title: "El póster del club de lectura",
  npc: { name: "Tinta, la bibliotecaria", avatar: "tinta" },
  story:
    "Mi amigo Rober usa lector de pantalla y no ve mi foto. Descríbela, dale tamaño y que la ola no le distraiga.",
  concept: "<img>: alt, width y height",
  lesson:
    "alt describe lo que aporta la imagen; si solo decora, alt=\"\". width y height le guardan el hueco para que nada salte.",
  mode: "code",
  starter: { html: page("", "") },
  editable: ["html"],
  solution: {
    html: page(
      ' alt="Biblioteca de tejado rojo frente a la playa, con libros de colores en la ventana" width="320" height="200"',
      ' alt="" width="320" height="40"',
    ),
  },
  checks: [
    {
      id: "photo-shown",
      kind: "required",
      label: "La foto de la biblioteca sigue en el póster",
      explain:
        "No encuentro la foto de la biblioteca. Conserva el src que ya trae el <img>: es la dirección de la imagen.",
      test: (ctx) => {
        const img = photo(ctx);
        return !!img && img.complete && img.naturalWidth > 0;
      },
    },
    {
      id: "photo-alt",
      kind: "required",
      label: "La foto tiene texto alternativo (alt)",
      explain:
        "Sin alt, quien no ve la imagen no sabe qué hay. Añade alt=\"…\" dentro del <img> con una descripción.",
      test: (ctx) => (photo(ctx)?.getAttribute("alt") ?? "").trim().length > 0,
    },
    {
      id: "photo-size",
      kind: "required",
      label: "La foto declara width y height (320 × 200)",
      explain:
        "width=\"320\" height=\"200\" guardan el hueco antes de que llegue la imagen: así el texto no salta.",
      test: (ctx) => {
        const img = photo(ctx);
        return !!img && hasPixelAttr(img, "width") && hasPixelAttr(img, "height");
      },
    },
    {
      id: "photo-alt-useful",
      kind: "a11y",
      label: "El alt describe lo que se ve (no «imagen» ni «foto»)",
      explain:
        "«Foto» no le cuenta nada a Rober. Di qué aparece: «Biblioteca de tejado rojo junto a la playa».",
      test: (ctx) => isUsefulAlt(photo(ctx)?.getAttribute("alt") ?? null),
    },
    {
      id: "wave-decorative",
      kind: "a11y",
      label: "La ola decorativa tiene alt vacío (alt=\"\")",
      explain:
        "Sin alt, el lector anuncia la dirección del archivo. La ola solo decora: ponle alt=\"\".",
      test: (ctx) => wave(ctx)?.getAttribute("alt") === "",
    },
  ],
  hints: [
    "Todo va en atributos dentro de <img>: alt para la descripción, width y height para el tamaño.",
    "<img src=\"…\" alt=\"Biblioteca de tejado rojo…\" width=\"320\" height=\"200\">  ·  <img src=\"…\" alt=\"\">",
    "Mira «Imágenes en HTML» en MDN, la parte de texto alternativo.",
  ],
  mdn: [
    {
      label: "MDN: Imágenes en HTML",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/HTML_images",
    },
    { label: "MDN: <img>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/img" },
  ],
  cards: ["html-img", "html-alt", "html-width-height"],
};
