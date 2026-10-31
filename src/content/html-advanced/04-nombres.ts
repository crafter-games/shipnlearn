import { $, $$, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { accName, referenced } from "./_helpers";

const LUPA = `<svg class="icono-lupa" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12.5 12.5 L18 18" stroke="currentColor" stroke-width="2.5"/></svg>`;
const PAPELERA = `<svg class="icono-papelera" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="M3 5 H17 M8 5 V3 H12 V5 M5 5 L6 18 H14 L15 5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`;

const STYLE = `<style>
  .barra { display: flex; gap: 8px; }
  .boton { display: inline-block; padding: 6px 12px; border: 2px solid #1B1F3B; border-radius: 8px; background: #FFD66B; }
</style>`;

const page = (search: string, trash: string, help: string, save: string) => `${STYLE}

<h1>Bitácora del farero</h1>

<div class="barra">
  ${search}
  ${trash}
</div>

<label for="rumbo">Rumbo del último barco</label>
<input id="rumbo" type="number" min="0" max="359"${help}>
<p id="rumbo-ayuda">En grados, de 0 a 359. El norte es 0.</p>

${save}
`;

const iconButton = (ctx: CheckContext, icon: string) =>
  $(ctx, `svg.${icon}`)?.closest<HTMLElement>("button, [role='button']") ?? null;

const field = (ctx: CheckContext) =>
  $$(ctx, "input").find((i) => /rumbo/i.test(accName(i))) ?? null;

export const nombres: Level = {
  id: "htmla-04-nombres",
  worldId: "html-advanced",
  title: "Botones sin nombre",
  npc: { name: "Doña Llave, guardiana de las puertas", avatar: "llave" },
  story:
    "El lector de Faustino dice «botón, botón» y no sabe cuál borra. Ponles nombre y usa botones de verdad.",
  concept: "Nombres accesibles y la primera regla de ARIA",
  lesson:
    "Un icono solo necesita aria-label; una ayuda, aria-describedby. Y la primera regla de ARIA: si <button> sirve, no inventes un div con role.",
  mode: "code",
  starter: {
    html: page(
      `<button type="button">${LUPA}</button>`,
      `<button type="button">${PAPELERA}</button>`,
      "",
      `<div class="boton" role="button" tabindex="0">Guardar entrada</div>`,
    ),
  },
  editable: ["html"],
  solution: {
    html: page(
      `<button type="button" aria-label="Buscar en la bitácora">${LUPA}</button>`,
      `<button type="button" aria-label="Borrar entrada">${PAPELERA}</button>`,
      ` aria-describedby="rumbo-ayuda"`,
      `<button type="button" class="boton">Guardar entrada</button>`,
    ),
  },
  checks: [
    {
      id: "search-name",
      kind: "required",
      label: "El botón de la lupa se llama «Buscar…»",
      explain:
        "Un icono no tiene texto que leer. Dale al <button> aria-label=\"Buscar en la bitácora\".",
      test: (ctx) => /busca/i.test(accName(iconButton(ctx, "icono-lupa"))),
    },
    {
      id: "trash-name",
      kind: "required",
      label: "El botón de la papelera se llama «Borrar…»",
      explain:
        "Si solo se oye «botón», nadie sabe que borra. Ponle aria-label=\"Borrar entrada\" al <button>.",
      test: (ctx) => /borra|elimina/i.test(accName(iconButton(ctx, "icono-papelera"))),
    },
    {
      id: "save-button",
      kind: "required",
      label: "«Guardar entrada» es un <button> de verdad",
      explain:
        "Un <div> con role no se activa con Enter ni Espacio sin JavaScript. Cámbialo por <button>.",
      test: (ctx) => {
        const el = $$(ctx, "button, input, [role='button']").find((b) => /guardar/i.test(accName(b)));
        return !!el && (el.tagName === "BUTTON" || el.tagName === "INPUT");
      },
    },
    {
      id: "help",
      kind: "a11y",
      label: "El campo Rumbo anuncia su ayuda (aria-describedby)",
      explain:
        "El lector lee el label, no el párrafo de debajo. Une campo y ayuda con aria-describedby=\"rumbo-ayuda\".",
      test: (ctx) => /grados/i.test(referenced(field(ctx) ?? ctx.doc.body, "aria-describedby").map(text).join(" ")),
    },
    {
      id: "no-fake-buttons",
      kind: "a11y",
      label: "Ningún elemento finge ser botón con role=\"button\"",
      explain:
        "Primera regla de ARIA: si hay una etiqueta nativa, úsala. Quita el role y usa <button>.",
      test: (ctx) => $$(ctx, "[role='button']").every((el) => el.tagName === "BUTTON"),
    },
    {
      id: "action-names",
      kind: "a11y",
      label: "Los nombres dicen qué hace el botón, no el dibujo",
      explain:
        "«Lupa» o «icono» describen el dibujo. Quien escucha necesita la acción: «Buscar», «Borrar».",
      test: (ctx) =>
        ["icono-lupa", "icono-papelera"].every((icon) => {
          const name = accName(iconButton(ctx, icon));
          return name.length > 0 && !/lupa|papelera|icono|svg/i.test(name);
        }),
    },
  ],
  hints: [
    "Los iconos necesitan aria-label; el campo, aria-describedby con el id de la ayuda; el div, ser <button>.",
    "<button aria-label=\"Buscar en la bitácora\">…</button>\n<input id=\"rumbo\" aria-describedby=\"rumbo-ayuda\">\n<button>Guardar entrada</button>",
    "Mira aria-label, aria-describedby y la guía de ARIA en MDN.",
  ],
  mdn: [
    { label: "MDN: ARIA", url: "https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA" },
    {
      label: "MDN: aria-label",
      url: "https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
    },
    {
      label: "MDN: aria-describedby",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
    },
  ],
  cards: ["htmla-aria-primera-regla", "htmla-aria-label", "htmla-aria-describedby"],
};
