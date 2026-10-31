import { $, rect } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { adjacent, textContrast } from "./_helpers";

const html = `<div class="estante">
  <button class="frasco" type="button" popovertarget="receta">Fórmula del fuego</button>
  <div id="receta" class="receta" popover>Azufre, ceniza y una gota de lava. Remover sin prisa.</div>
</div>
`;

const base = `.estante {
  padding: 140px 16px 24px;
  text-align: center;
}

.frasco {
  font: inherit;
  font-weight: bold;
  padding: 10px 18px;
  border: 3px solid #2B1B17;
  border-radius: 12px;
  background-color: #FFE1C2;
  color: #2B1B17;
  cursor: pointer;
}
`;

const starterCss = `${base}
.receta {
  max-width: 220px;
  padding: 8px 12px;
  border: 2px solid #2B1B17;
  border-radius: 10px;
  background-color: #FF8A3D;
  color: #FFFFFF;
}
`;

const solutionCss = `${base}
.frasco {
  anchor-name: --frasco;
}

.receta {
  position-anchor: --frasco;
  position-area: top;
  margin: 0 0 8px;
  max-width: 220px;
  padding: 8px 12px;
  border: 2px solid #2B1B17;
  border-radius: 10px;
  background-color: #8A2B06;
  color: #FFFFFF;
}
`;

type Parts = { btn: HTMLButtonElement; tip: HTMLElement };

const parts = (ctx: CheckContext): Parts | null => {
  const btn = $(ctx, ".frasco") as HTMLButtonElement | null;
  const tip = $(ctx, "#receta");
  return btn && tip ? { btn, tip } : null;
};

/**
 * Open the recipe the way a player does (clicking its button), measure, close.
 * All synchronous: layout is forced by the measurement and nothing is painted,
 * so the live checklist never makes the popover blink.
 */
function whileOpen<T>(ctx: CheckContext, fn: (p: Parts) => T): T | false {
  const p = parts(ctx);
  if (!p) return false;
  try {
    if (p.tip.matches(":popover-open")) p.tip.hidePopover();
    p.btn.click();
    if (!p.tip.matches(":popover-open")) return false;
    return fn(p);
  } finally {
    if (p.tip.matches(":popover-open")) p.tip.hidePopover();
  }
}

export const ancla: Level = {
  id: "cssa-08-ancla",
  worldId: "css-advanced",
  title: "La fórmula flotante",
  npc: { name: "Magma, la alquimista", avatar: "magma" },
  story:
    "Al pulsar «Fórmula del fuego», la receta sale en mitad de la pantalla. Que flote justo encima del botón.",
  concept: "Posicionamiento con anclas: anchor-name y position-area",
  lesson:
    "anchor-name marca el botón como ancla y position-area: top coloca la receta pegada encima, vaya donde vaya el botón.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  // The ghost can't click: show the recipe open so the player sees where it goes.
  target: { html, css: `${solutionCss}\n.receta {\n  display: block;\n}\n` },
  checks: [
    {
      id: "next-to-button",
      kind: "required",
      label: "Al abrirla, la receta queda pegada al botón",
      explain:
        "Un popover sale centrado en la pantalla. Ánclalo: anchor-name en .frasco y position-anchor en .receta.",
      test: (ctx) => whileOpen(ctx, ({ btn, tip }) => adjacent(btn, tip, 16)),
    },
    {
      id: "follows",
      kind: "required",
      label: "Si el botón se mueve, la receta lo sigue",
      explain:
        "Con top y left fijos, la receta no sigue al botón. Con position-area, el navegador la recoloca.",
      test: (ctx) => {
        const p = parts(ctx);
        if (!p) return false;
        const prev = p.btn.style.cssText;
        p.btn.style.position = "relative";
        p.btn.style.left = "90px";
        p.btn.style.top = "40px";
        try {
          return whileOpen(ctx, ({ btn, tip }) => adjacent(btn, tip, 16));
        } finally {
          p.btn.style.cssText = prev;
        }
      },
    },
    {
      id: "visible",
      kind: "required",
      label: "La receta se ve entera, sin salirse de la página",
      explain:
        "Si la receta se corta en un borde, elige otro lado en position-area (top, bottom…).",
      test: (ctx) =>
        whileOpen(ctx, ({ tip }) => {
          const r = rect(tip);
          const root = ctx.doc.documentElement;
          return r.top >= 0 && r.left >= 0 && r.right <= root.clientWidth && r.bottom <= ctx.win.innerHeight;
        }),
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto de la receta se lee bien (4.5:1)",
      explain: "Blanco sobre naranja claro no llega a 4.5:1. Oscurece el fondo, como #8A2B06.",
      test: (ctx) => whileOpen(ctx, ({ tip }) => textContrast(ctx, tip) >= 4.5),
    },
  ],
  hints: [
    "Dale un nombre al botón con anchor-name y úsalo en la receta con position-anchor.",
    ".frasco { anchor-name: --frasco; }\n.receta {\n  position-anchor: --frasco;\n  position-area: top;\n  margin: 0 0 8px;\n}",
    "Lee anchor-name y position-area en MDN (en inglés).",
  ],
  mdn: [
    {
      label: "MDN: Posicionamiento con anclas (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using",
    },
    {
      label: "MDN: position-area (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area",
    },
  ],
  cards: ["cssa-anchor", "cssa-position-area"],
};
