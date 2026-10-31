import { $$, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { backgroundBehind, colorContrast, withChecked } from "./_helpers";

const html = `<div class="reservas">
  <article class="cristal">
    <h2>Amatista</h2>
    <p>Violeta, nacida en las grietas frías del cráter.</p>
    <label><input type="checkbox" name="amatista"> Reservar</label>
  </article>
  <article class="cristal">
    <h2>Cuarzo de fuego</h2>
    <p>Atrapa el brillo de la lava dentro de la piedra.</p>
    <label><input type="checkbox" name="cuarzo"> Reservar</label>
  </article>
  <article class="cristal">
    <h2>Ópalo</h2>
    <p>Cambia de color según la luz de la mañana.</p>
    <label><input type="checkbox" name="opalo"> Reservar</label>
  </article>
</div>
`;

const base = `.reservas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.cristal {
  padding: 16px;
  border: 4px solid #EADCF5;
  border-radius: 16px;
  background-color: #FFFFFF;
}

.cristal h2 {
  margin: 0 0 8px;
  font-size: 1.25rem;
}

.cristal label {
  font-weight: bold;
}

.cristal input {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
`;

const solutionCss = `${base}
.cristal:has(input:checked) {
  border-color: #6B2FA3;
}
`;

const cristales = (ctx: CheckContext) => $$(ctx, ".reservas .cristal");
const box = (card: Element) => card.querySelector<HTMLInputElement>('input[type="checkbox"]');
const border = (ctx: CheckContext, el: Element) => style(ctx, el, "border-top-color");

export const has: Level = {
  id: "cssa-02-has",
  worldId: "css-advanced",
  title: "Cristales reservados",
  npc: { name: "Doctora Prisma", avatar: "prisma" },
  story:
    "Si alguien marca «Reservar», el borde de ESE cristal debe volverse violeta oscuro. Y sin tocar el HTML.",
  concept: ":has(): el padre que mira a sus hijos",
  lesson:
    ".cristal:has(input:checked) elige la tarjeta que contiene una casilla marcada: por fin un selector que mira hacia dentro.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  // Ghost with one crystal reserved, so the goal state is visible.
  target: { html: html.replace('name="cuarzo">', 'name="cuarzo" checked>'), css: solutionCss },
  checks: [
    {
      id: "checked-border",
      kind: "required",
      label: "Al marcar «Reservar», cambia el borde de su tarjeta",
      explain:
        "La casilla está dentro de .cristal. Elige la tarjeta que la contiene marcada: .cristal:has(input:checked).",
      test: (ctx) => {
        const list = cristales(ctx);
        return (
          list.length === 3 &&
          list.every((card) => {
            const input = box(card);
            if (!input) return false;
            const off = withChecked(input, false, () => border(ctx, card));
            const on = withChecked(input, true, () => border(ctx, card));
            return off !== on;
          })
        );
      },
    },
    {
      id: "only-that-card",
      kind: "required",
      label: "Las demás tarjetas no cambian",
      explain:
        "Si el :has() está en el contenedor .reservas, se pintan todas. Ponlo en .cristal para elegir solo una.",
      test: (ctx) => {
        const [first, ...others] = cristales(ctx);
        const input = first && box(first);
        if (!input || others.length !== 2) return false;
        const before = others.map((c) => border(ctx, c));
        const after = withChecked(input, true, () => others.map((c) => border(ctx, c)));
        return before.every((b, i) => b === after[i]);
      },
    },
    {
      id: "border-contrast",
      kind: "a11y",
      label: "El borde de reserva contrasta con el fondo (3:1)",
      explain:
        "Un borde pálido apenas se ve. Para que sirva de señal, debe contrastar al menos 3:1 con lo que lo rodea.",
      test: (ctx) => {
        const card = cristales(ctx)[0];
        const input = card && box(card);
        if (!card?.parentElement || !input) return false;
        const color = withChecked(input, true, () => border(ctx, card));
        return colorContrast(ctx, color, backgroundBehind(ctx, card.parentElement)) >= 3;
      },
    },
  ],
  hints: [
    ":has() elige un elemento según lo que contiene. :checked es una casilla marcada.",
    ".cristal:has(input:checked) {\n  border-color: #6B2FA3;\n}",
    "Lee :has() y :checked en MDN.",
  ],
  mdn: [
    {
      label: "MDN: :has()",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:has",
    },
    {
      label: "MDN: :checked",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:checked",
    },
  ],
  cards: ["cssa-has"],
};
