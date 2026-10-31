import { $$, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { holding, reachable, shown } from "./_helpers";

const page = (header: string, main: string, notice: string) => `<style>
  .panel { margin-top: 16px; padding: 12px; border: 3px solid #1B1F3B; border-radius: 12px; background: #F4F7FF; }
  nav a { margin-right: 12px; }
</style>

<header${header}>
  <nav aria-label="Principal">
    <a href="#luz">Luz</a>
    <a href="#turnos">Turnos</a>
  </nav>
</header>

<main${main}>
  <h1>Sala de control</h1>
  <button type="button">Encender la luz</button>
</main>

<section class="panel" aria-labelledby="panel-titulo">
  <h2 id="panel-titulo">Bitácora abierta</h2>
  <p>Escribe la entrada de hoy antes de volver a la sala.</p>
  <p class="aviso"${notice}>Aviso de ayer: niebla en el puerto.</p>
  <button type="button">Cerrar la bitácora</button>
</section>
`;

const byText = (ctx: CheckContext, selector: string, re: RegExp) => $$(ctx, selector).find((el) => re.test(text(el))) ?? null;
const lightButton = (ctx: CheckContext) => byText(ctx, "button", /encender/i);
const closeButton = (ctx: CheckContext) => byText(ctx, "button", /cerrar/i);
const notice = (ctx: CheckContext) => holding(ctx, "niebla");

export const inerte: Level = {
  id: "htmla-08-inerte",
  worldId: "html-advanced",
  title: "La puerta cerrada",
  npc: { name: "Doña Llave, guardiana de las puertas", avatar: "llave" },
  story:
    "Con la bitácora abierta, alguien enciende la luz de la sala. Cierra esa puerta y guarda el aviso viejo.",
  concept: "inert y hidden",
  lesson:
    "inert deja una zona visible pero sin clics, foco ni lector. hidden la quita de la vista y del lector; con opacity: 0 solo dejaba de verse.",
  mode: "code",
  starter: { html: page("", "", "") },
  editable: ["html"],
  solution: { html: page(" inert", " inert", " hidden") },
  checks: [
    {
      id: "background-inert",
      kind: "required",
      label: "«Encender la luz» no responde con la bitácora abierta",
      explain:
        "Pon inert en el <main>: el botón se sigue viendo, pero no recibe clics ni foco.",
      test: (ctx) => !!lightButton(ctx) && !reachable(ctx, lightButton(ctx)),
    },
    {
      id: "panel-alive",
      kind: "required",
      label: "El panel de la bitácora sigue funcionando",
      explain:
        "inert apaga todo lo que hay dentro. Si lo pones en <body>, también apagas el panel: ponlo solo en el fondo.",
      test: (ctx) => {
        const b = closeButton(ctx);
        return !!b && !b.closest("[inert]") && reachable(ctx, b);
      },
    },
    {
      id: "notice-gone",
      kind: "required",
      label: "El aviso de ayer ya no se ve (pero sigue en el código)",
      explain:
        "No lo borres, que mañana puede volver: escóndelo con el atributo hidden.",
      test: (ctx) => !!notice(ctx) && !shown(notice(ctx)),
    },
    {
      id: "notice-silent",
      kind: "a11y",
      label: "El lector tampoco lee el aviso de ayer",
      explain:
        "opacity: 0 lo esconde a la vista, pero el lector lo sigue leyendo. hidden lo quita para todos.",
      test: (ctx) => {
        const n = notice(ctx);
        return !!n && !n.checkVisibility({ visibilityProperty: true });
      },
    },
    {
      id: "menu-inert",
      kind: "a11y",
      label: "El menú de arriba también queda fuera de alcance",
      explain:
        "Con el teclado se llega al menú y se sale del panel. Pon inert también en el <header>.",
      test: (ctx) => {
        const links = $$(ctx, "nav a");
        return links.length >= 2 && links.every((a) => !reachable(ctx, a));
      },
    },
  ],
  hints: [
    "inert va en lo que queda detrás del panel (cabecera y contenido); hidden, en el aviso de ayer.",
    "<header inert>…</header>\n<main inert>…</main>\n<p class=\"aviso\" hidden>…</p>",
    "Mira los atributos inert y hidden en MDN.",
  ],
  mdn: [
    {
      label: "MDN: atributo inert",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert",
    },
    {
      label: "MDN: atributo hidden",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Global_attributes/hidden",
    },
  ],
  cards: ["htmla-inert", "htmla-hidden"],
};
