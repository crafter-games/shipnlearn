import { $$, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { holding, liveRoot, liveness, referenced, shown } from "./_helpers";

const STATUS = "Viento del norte a 40 nudos. Tormenta en 2 horas.";

const page = (status: string, button: string, panelOpen = "<div id=\"prevision\" hidden>") => `<h1>Estación meteorológica</h1>
<p>Datos del anemómetro del faro, cada 10 minutos.</p>

${status}

${button}
${panelOpen}
  <p>Mañana: calma chicha y sol hasta la tarde.</p>
</div>
`;

const report = (ctx: CheckContext) => holding(ctx, "nudos");
const forecast = (ctx: CheckContext) => holding(ctx, "calma chicha");
const toggle = (ctx: CheckContext) =>
  $$(ctx, "button, [role='button']").find((b) => /previsi[oó]n/i.test(text(b))) ?? null;

export const avisos: Level = {
  id: "htmla-05-avisos",
  worldId: "html-advanced",
  title: "El loro del tiempo",
  npc: { name: "Eco, el loro que anuncia", avatar: "eco" },
  story:
    "¡Tormenta, tormenta! Que el lector anuncie el parte sin cortar a nadie, y que el botón diga si está abierto.",
  concept: "aria-live, aria-expanded y aria-controls",
  lesson:
    "aria-live=\"polite\" anuncia el parte sin interrumpir. aria-expanded y aria-controls dicen qué abre el botón; en una app, JS los cambia.",
  mode: "code",
  starter: {
    html: page(
      `<p class="parte">${STATUS}</p>`,
      `<button type="button">Ver previsión de mañana</button>`,
    ),
  },
  editable: ["html"],
  solution: {
    html: page(
      `<p class="parte" aria-live="polite">${STATUS}</p>`,
      `<button type="button" aria-expanded="false" aria-controls="prevision">Ver previsión de mañana</button>`,
    ),
  },
  checks: [
    {
      id: "live",
      kind: "required",
      label: "El parte del tiempo está en una región viva",
      explain:
        "El lector no vigila los cambios por su cuenta. Pon aria-live=\"polite\" en el elemento del parte.",
      test: (ctx) => liveness(report(ctx)) !== null,
    },
    {
      id: "expanded",
      kind: "required",
      label: "El botón dice si la previsión está abierta",
      explain:
        "aria-expanded=\"false\" si la previsión está oculta, \"true\" si se ve. Debe decir la verdad.",
      test: (ctx) => {
        const b = toggle(ctx);
        const v = b?.getAttribute("aria-expanded");
        return (v === "true" || v === "false") && v === String(shown(forecast(ctx)));
      },
    },
    {
      id: "controls",
      kind: "required",
      label: "El botón apunta a la previsión (aria-controls)",
      explain:
        "aria-controls lleva el id de lo que el botón abre: aria-controls=\"prevision\".",
      test: (ctx) => {
        const b = toggle(ctx);
        const f = forecast(ctx);
        return !!b && !!f && referenced(b, "aria-controls").some((el) => el.contains(f));
      },
    },
    {
      id: "polite",
      kind: "a11y",
      label: "El parte avisa sin interrumpir (polite)",
      explain:
        "assertive o role=\"alert\" cortan lo que el lector esté diciendo. Para el parte basta con polite.",
      test: (ctx) => liveness(report(ctx)) === "polite",
    },
    {
      id: "small-region",
      kind: "a11y",
      label: "La región viva envuelve solo el mensaje",
      explain:
        "Si toda la página es viva, cada cambio se lee entero. Pon aria-live solo en el parte.",
      test: (ctx) => {
        const root = liveRoot(report(ctx));
        return !!root && text(root).length <= 120 && !root.querySelector("h1, h2, button");
      },
    },
    {
      id: "real-button",
      kind: "a11y",
      label: "El que abre la previsión es un <button>",
      explain: "aria-expanded va en el <button> que abre y cierra, no en el panel ni en un <div>.",
      test: (ctx) => toggle(ctx)?.tagName === "BUTTON",
    },
  ],
  hints: [
    "La región viva va en el párrafo del parte; los estados, en el botón que abre la previsión.",
    "<p aria-live=\"polite\">Viento…</p>\n<button aria-expanded=\"false\" aria-controls=\"prevision\">…</button>",
    "Mira «ARIA live regions» y aria-expanded en MDN.",
  ],
  mdn: [
    {
      label: "MDN: ARIA live regions",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
    },
    {
      label: "MDN: aria-expanded",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded",
    },
    {
      label: "MDN: aria-controls",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-controls",
    },
  ],
  cards: ["htmla-aria-live", "htmla-aria-expanded"],
};
