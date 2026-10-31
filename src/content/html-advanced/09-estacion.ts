import { $$, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { accName, buttonNamed, headMeta, interact, isAbsoluteHttpUrl, liveness, holding, saveDetails } from "./_helpers";
import { FAVICON_SRC, HERO_SRC, LANTERN_SRC, ROCKS_SRC, STAIRS_SRC } from "./_images";

const BELL = `<svg class="icono-campana" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="M4 15 H16 L14 12 V8 A4 4 0 0 0 6 8 V12 Z M8 17 H12" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`;

const FAQ = [
  ["¿Cuándo hay visitas?", "Los sábados de 10:00 a 13:00."],
  ["¿Hace falta reservar?", "No: llega y sube, de diez en diez."],
  ["¿Se puede llevar perro?", "Sí, si sube en brazos los 117 escalones."],
] as const;
const Q_KEYS = ["visitas", "reservar", "perro"];

const PHOTOS = [
  [LANTERN_SRC, "La linterna encendida, con su lámpara amarilla"],
  [STAIRS_SRC, "La escalera de caracol que sube a la linterna"],
  [ROCKS_SRC, "Olas rompiendo contra las rocas al pie del faro"],
] as const;

type Parts = {
  meta: string;
  menuButton: string;
  menu: string;
  bell: string;
  status: string;
  faq: (q: string, a: string) => string;
  photo: string;
  confirmButton: string;
  confirm: (inner: string) => string;
  cancel: string;
};

const page = (p: Parts) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Estación del faro</title>${p.meta}
  </head>
  <body>
    <header>
      <h1>Estación del faro</h1>
      <button type="button"${p.menuButton}>Menú</button>
      <ul${p.menu}>
        <li><a href="#preguntas">Preguntas</a></li>
        <li><a href="#galeria">Galería</a></li>
        <li><a href="#control">Control de la luz</a></li>
      </ul>
      <button type="button"${p.bell}>${BELL}</button>
    </header>

    <main>
      <p${p.status}>Mar en calma. Próximo barco a las 18:00.</p>
      <img src="${HERO_SRC}" alt="El faro al atardecer lanzando su haz sobre el mar" width="640" height="360">

      <h2 id="preguntas">Preguntas</h2>
${FAQ.map(([q, a]) => p.faq(q, a)).join("\n")}

      <h2 id="galeria">Galería</h2>
${PHOTOS.map(([src, alt]) => `      <img src="${src}" alt="${alt}" width="320" height="240"${p.photo}>`).join("\n")}

      <h2 id="control">Control de la luz</h2>
      <button type="button"${p.confirmButton}>Apagar el faro</button>
${p.confirm(`
        <h3 id="confirmar-titulo">¿Seguro que quieres apagar el faro?</h3>
        <p>Los barcos dejarán de ver la costa.</p>
        <button type="button"${p.cancel}>Cancelar</button>`)}
    </main>
  </body>
</html>
`;

const STARTER: Parts = {
  meta: "",
  menuButton: "",
  menu: "",
  bell: "",
  status: "",
  faq: (q, a) => `      <h3>${q}</h3>\n      <p>${a}</p>`,
  photo: "",
  confirmButton: "",
  confirm: (inner) => `      <div class="confirmar">${inner}\n      </div>`,
  cancel: "",
};

const SOLUTION: Parts = {
  meta: `
    <meta name="description" content="El faro de Isla Faro: horarios de visita, preguntas, fotos y control de la luz.">
    <meta property="og:title" content="Estación del faro">
    <meta property="og:description" content="Visitas, fotos y el estado del mar, desde el faro.">
    <meta property="og:image" content="https://faro.example/img/faro.png">
    <link rel="icon" href="${FAVICON_SRC}">`,
  menuButton: ` popovertarget="menu"`,
  menu: ` id="menu" popover`,
  bell: ` aria-label="Silenciar la alarma"`,
  status: ` aria-live="polite"`,
  faq: (q, a) => `      <details name="faq">\n        <summary>${q}</summary>\n        <p>${a}</p>\n      </details>`,
  photo: ` loading="lazy" decoding="async"`,
  confirmButton: ` command="show-modal" commandfor="confirmar"`,
  confirm: (inner) => `      <dialog id="confirmar" aria-labelledby="confirmar-titulo">${inner}\n      </dialog>`,
  cancel: ` command="close" commandfor="confirmar"`,
};

const faqDetails = (ctx: CheckContext) => {
  const found = Q_KEYS.map(
    (k) =>
      $$(ctx, "details > summary").find((s) => text(s).toLowerCase().includes(k))?.parentElement as
        | HTMLDetailsElement
        | undefined,
  );
  return found.every(Boolean) && new Set(found).size === 3 ? (found as HTMLDetailsElement[]) : null;
};

const menuLinks = (ctx: CheckContext) =>
  $$(ctx, "a[href]").filter((a) => /^(preguntas|galer[ií]a|control de la luz)$/i.test(text(a)));

const confirmDialog = (ctx: CheckContext) =>
  ($$(ctx, "dialog").find((d) => /apagar el faro/i.test(d.textContent ?? "")) as HTMLDialogElement | undefined) ?? null;

const hero = (ctx: CheckContext) => $$(ctx, "img").find((i) => i.getAttribute("src")?.includes("faro-hero")) as HTMLImageElement | undefined;
const photos = (ctx: CheckContext) =>
  $$(ctx, "img").filter((i) => /linterna|escalera|rocas/.test(i.getAttribute("src") ?? "")) as HTMLImageElement[];

export const estacion: Level = {
  id: "htmla-09-estacion",
  worldId: "html-advanced",
  title: "Jefe: la estación del faro",
  npc: { name: "Lumi la farera", avatar: "lumi" },
  story:
    "Mañana se estrena la web de la estación y está a medio hacer. Usa todo lo de la isla para dejarla lista.",
  concept: "Una página interactiva sin JavaScript, accesible y lista para compartir",
  lesson:
    "Acordeón, popover, diálogo, metadatos, imágenes ligeras, región viva y nombres: todo con HTML, sin una línea de JavaScript.",
  mode: "code",
  boss: true,
  starter: { html: page(STARTER) },
  editable: ["html"],
  solution: { html: page(SOLUTION) },
  checks: [
    {
      id: "faq",
      kind: "required",
      label: "Las preguntas son un acordeón: una abierta a la vez",
      explain:
        "Cada pregunta en <summary> dentro de su <details>, y los tres con el mismo name.",
      test: (ctx) => {
        const g = faqDetails(ctx);
        if (!g) return false;
        const restore = saveDetails(ctx);
        try {
          g.forEach((d) => (d.open = false));
          return g.every((d, i) => {
            (d.querySelector(":scope > summary") as HTMLElement).click();
            return g.every((other, j) => other.open === (j === i));
          });
        } finally {
          restore();
        }
      },
    },
    {
      id: "menu",
      kind: "required",
      label: "«Menú» abre y cierra un popover con los enlaces",
      explain:
        "La lista de enlaces lleva popover e id; el botón, popovertarget con ese id.",
      test: (ctx) => {
        const links = menuLinks(ctx);
        const box = links[0]?.closest<HTMLElement>("[popover]");
        const btn = buttonNamed(ctx, /^men[uú]$/i);
        if (links.length < 3 || !box || !btn || !links.every((a) => box.contains(a))) return false;
        return interact(ctx, () => {
          btn.click();
          const opened = box.matches(":popover-open");
          btn.click();
          return opened && !box.matches(":popover-open");
        });
      },
    },
    {
      id: "confirm",
      kind: "required",
      label: "«Apagar el faro» abre un modal que «Cancelar» cierra",
      explain:
        "Usa <dialog>: el botón lo abre con command=\"show-modal\" y «Cancelar» lo cierra con command=\"close\".",
      test: (ctx) => {
        const d = confirmDialog(ctx);
        const open = d && $$(ctx, "button").find((b) => /apagar/i.test(accName(b)) && !d.contains(b));
        const cancel = d && $$(ctx, "button").find((b) => /cancelar/i.test(accName(b)) && d.contains(b));
        if (!d || !open || !cancel) return false;
        return interact(ctx, () => {
          open.click();
          if (!d.matches(":modal")) return false;
          const formDialog = cancel.closest("form")?.getAttribute("method")?.toLowerCase() === "dialog";
          if (formDialog && (cancel as HTMLButtonElement).type === "submit") return true;
          cancel.click();
          return !d.open;
        });
      },
    },
    {
      id: "meta",
      kind: "required",
      label: "El <head> tiene description, og:title y og:image",
      explain:
        "Para que el enlace se vea bien al compartir: meta description, og:title y og:image con URL completa.",
      test: (ctx) =>
        headMeta(ctx, "description").length >= 30 &&
        headMeta(ctx, "og:title").length >= 3 &&
        isAbsoluteHttpUrl(headMeta(ctx, "og:image")),
    },
    {
      id: "lazy",
      kind: "required",
      label: "Las 3 fotos de la galería son lazy; la del faro, no",
      explain:
        "loading=\"lazy\" solo en las de la galería. La del faro se ve al entrar: que cargue ya.",
      test: (ctx) =>
        !!hero(ctx) &&
        hero(ctx)!.loading !== "lazy" &&
        photos(ctx).length === 3 &&
        photos(ctx).every((i) => i.loading === "lazy"),
    },
    {
      id: "status",
      kind: "a11y",
      label: "El estado del mar se anuncia sin interrumpir",
      explain:
        "Cuando cambie, el lector debe enterarse: aria-live=\"polite\" en el párrafo del estado.",
      test: (ctx) => liveness(holding(ctx, "próximo barco")) === "polite",
    },
    {
      id: "bell",
      kind: "a11y",
      label: "El botón de la campana dice qué hace",
      explain:
        "Es solo un icono: dale aria-label=\"Silenciar la alarma\" al <button>.",
      test: (ctx) => {
        const b = $$(ctx, "svg.icono-campana")[0]?.closest("button");
        return /silenci|alarma/i.test(accName(b)) && !/campana|icono/i.test(accName(b));
      },
    },
    {
      id: "dialog-name",
      kind: "a11y",
      label: "El diálogo se llama como su pregunta",
      explain:
        "Apunta aria-labelledby del <dialog> al id del título de la pregunta.",
      test: (ctx) => /apagar/i.test(accName(confirmDialog(ctx))),
    },
  ],
  hints: [
    "Ve por partes: <head>, menú, campana, estado, preguntas, galería y diálogo. Cada una es un nivel de la isla.",
    "<details name=\"faq\"><summary>…</summary>…</details>\n<ul id=\"menu\" popover>…</ul>\n<dialog id=\"confirmar\">…</dialog>",
    "Repasa <details>, popover, <dialog> y la guía de ARIA en MDN.",
  ],
  mdn: [
    { label: "MDN: <details>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/details" },
    { label: "MDN: <dialog>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/dialog" },
    {
      label: "MDN: atributo popover",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover",
    },
  ],
  cards: [],
};
