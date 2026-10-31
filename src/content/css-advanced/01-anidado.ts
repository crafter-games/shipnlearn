import { $$, hasColor, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { pseudoChanges, styleEntries } from "./_helpers";

const html = `<section class="vitrina" aria-label="Minerales del volcán">
  <article class="card">
    <h2>Obsidiana</h2>
    <p>Vidrio negro que nace cuando la lava se enfría de golpe.</p>
    <a href="#">Ver ficha</a>
  </article>
  <article class="card">
    <h2>Piedra pómez</h2>
    <p>Tan llena de burbujas de gas que flota en el agua.</p>
    <a href="#">Ver ficha</a>
  </article>
</section>
`;

const vitrina = `.vitrina {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
`;

const starterCss = `${vitrina}
.card {
  padding: 16px 20px;
  border: 3px solid #5C3A2E;
  border-radius: 16px;
  background-color: #FFF4E8;
}

.card h2 {
  margin: 0 0 8px;
  color: #A3300B;
}

.card p {
  margin: 0 0 12px;
  color: #4A2C22;
}

.card:hover {
  border-color: #D9480F;
}
`;

const solutionCss = `${vitrina}
.card {
  padding: 16px 20px;
  border: 3px solid #5C3A2E;
  border-radius: 16px;
  background-color: #FFF4E8;

  h2 {
    margin: 0 0 8px;
    color: #A3300B;
  }

  p {
    margin: 0 0 12px;
    color: #4A2C22;
  }

  &:hover,
  &:focus-within {
    border-color: #D9480F;
  }
}
`;

const cards = (ctx: CheckContext) => $$(ctx, ".vitrina .card");

/** Some rule nested inside another style rule targets `el` and sets `prop`. */
const nestedRuleSets = (ctx: CheckContext, el: Element, prop: string) =>
  styleEntries(ctx).some((e) => {
    if (!e.nested || !e.style.getPropertyValue(prop)) return false;
    try {
      return el.matches(e.selector);
    } catch {
      return false;
    }
  });

export const anidado: Level = {
  id: "cssa-01-anidado",
  worldId: "css-advanced",
  title: "Fichas de minerales",
  npc: { name: "Magma, la alquimista", avatar: "magma" },
  story:
    "Mi CSS repite .card en cada regla, como un eco. Mete h2, p y :hover dentro de .card sin cambiar el aspecto.",
  concept: "Anidado CSS y el selector &",
  lesson:
    "Escribiste h2, p y &:hover dentro de .card: el CSS ahora tiene la forma del HTML y el resultado es el mismo.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "same-look",
      kind: "required",
      label: "Las fichas se ven igual que antes",
      explain:
        "Al mover las reglas cambió algún estilo. Copia las mismas declaraciones dentro de cada bloque anidado.",
      test: (ctx) => {
        const list = cards(ctx);
        return (
          list.length === 2 &&
          list.every((card) => {
            const h2 = card.querySelector("h2");
            const p = card.querySelector("p");
            return (
              !!h2 &&
              !!p &&
              hasColor(ctx, h2, "color", "#A3300B") &&
              hasColor(ctx, p, "color", "#4A2C22") &&
              style(ctx, h2, "margin-bottom") === "8px" &&
              style(ctx, card, "padding-left") === "20px" &&
              hasColor(ctx, card, "border-top-color", "#5C3A2E")
            );
          })
        );
      },
    },
    {
      id: "nested-children",
      kind: "required",
      label: "Las reglas de h2 y p van dentro de .card",
      explain:
        "Escribe h2 { … } y p { … } entre las llaves de .card. Dentro, h2 significa «un h2 dentro de .card».",
      test: (ctx) => {
        const card = cards(ctx)[0];
        const h2 = card?.querySelector("h2");
        const p = card?.querySelector("p");
        return !!h2 && !!p && nestedRuleSets(ctx, h2, "color") && nestedRuleSets(ctx, p, "color");
      },
    },
    {
      id: "nested-hover",
      kind: "required",
      label: "El :hover también va dentro, con &:hover",
      explain:
        "& es la propia .card. Sin &, «:hover» buscaría hijos con el ratón encima. Escribe &:hover dentro de .card.",
      test: (ctx) => {
        const card = cards(ctx)[0];
        return !!card && pseudoChanges(ctx, card, ":hover", ["border"], { nestedOnly: true });
      },
    },
    {
      id: "no-repeats",
      kind: "required",
      label: "Solo queda una regla suelta con .card",
      explain:
        "Si dejas .card h2 fuera, el CSS sigue repitiendo .card. Borra las reglas sueltas al anidarlas.",
      test: (ctx) =>
        styleEntries(ctx).filter((e) => !e.nested && e.selector.includes(".card")).length === 1,
    },
    {
      id: "focus-within",
      kind: "a11y",
      label: "Con Tab, la ficha se resalta igual que con el ratón",
      explain:
        "Quien usa teclado no puede hacer hover. Añade &:focus-within junto a &:hover, separado por coma.",
      test: (ctx) => {
        const card = cards(ctx)[0];
        return !!card && pseudoChanges(ctx, card, ":focus-within", ["border", "outline", "box-shadow"]);
      },
    },
  ],
  hints: [
    "Dentro de las llaves de .card puedes escribir otras reglas. & es la propia .card: &:hover.",
    ".card {\n  border: 3px solid #5C3A2E;\n  h2 { color: #A3300B; }\n  &:hover, &:focus-within { border-color: #D9480F; }\n}",
    "Lee «Usar el anidado CSS» y el selector & en MDN (en inglés).",
  ],
  mdn: [
    {
      label: "MDN: Anidado CSS (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using",
    },
    {
      label: "MDN: Selector & (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Nesting_selector",
    },
  ],
  cards: ["cssa-anidado", "cssa-ampersand"],
};
