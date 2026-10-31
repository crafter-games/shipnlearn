import { $ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { hasVisibleFocus } from "@/content/css-basics/_helpers";
import { keyframeNames, respectsReducedMotion, seconds, transitionsOnHover } from "./_helpers";
import { GEAR_SRC } from "./_images";

const html = `<section class="maquina" aria-label="Sierra del taller">
  <img class="engranaje" src="${GEAR_SRC}" alt="" width="96" height="96">
  <h2>La sierra está en marcha</h2>
  <button class="boton" type="button">Fabricar</button>
</section>
`;

const base = `.maquina {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #EDE4FF;
}

.maquina h2 {
  margin: 0;
}

.boton {
  font: inherit;
  padding: 10px 24px;
  border: 3px solid #1B1F3B;
  border-radius: 999px;
  background-color: #5B21B6;
  color: white;
  cursor: pointer;
}

.boton:hover,
.boton:focus-visible {
  background-color: #2E1065;
}
`;

const solutionCss = `${base}
.boton {
  transition: background-color 0.2s ease;
}

.engranaje {
  animation: girar 4s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .engranaje {
    animation: none;
  }
}
`;

const button = (ctx: CheckContext) => $(ctx, ".boton");
const gear = (ctx: CheckContext) => $(ctx, ".engranaje");

export const engranaje: Level = {
  id: "cssi-08-engranaje",
  worldId: "css-intermediate",
  title: "El engranaje que gira",
  npc: { name: "Pixel", avatar: "pixel" },
  story:
    "El botón cambia de golpe y el engranaje no gira. ¡Dale suavidad y movimiento, y calma para quien pida menos!",
  concept: "transition, @keyframes, animation y prefers-reduced-motion",
  lesson:
    "transition suavizó el cambio del botón, @keyframes y animation hicieron girar el engranaje, y reduced-motion lo detiene.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "transition",
      kind: "required",
      label: "El fondo del botón cambia suave (1s como mucho)",
      explain:
        "Sin transition el cambio es instantáneo. transition: background-color 0.2s en .boton lo suaviza.",
      test: (ctx) => {
        const el = button(ctx);
        return !!el && transitionsOnHover(ctx, el);
      },
    },
    {
      id: "spin",
      kind: "required",
      label: "El engranaje tiene una animación con @keyframes",
      explain:
        "animation necesita un @keyframes con el mismo nombre y una duración, como animation: girar 4s.",
      test: (ctx) => {
        const el = gear(ctx);
        if (!el) return false;
        const s = ctx.win.getComputedStyle(el);
        const names = s.animationName.split(",").map((n) => n.trim());
        const known = keyframeNames(ctx);
        return names.some((n) => n !== "none" && known.includes(n)) && seconds(s.animationDuration) > 0;
      },
    },
    {
      id: "forever",
      kind: "required",
      label: "El engranaje gira sin parar",
      explain: "Por defecto, una animación se repite una vez. animation-iteration-count: infinite la repite siempre.",
      test: (ctx) => {
        const el = gear(ctx);
        return !!el && ctx.win.getComputedStyle(el).animationIterationCount.includes("infinite");
      },
    },
    {
      id: "reduced-motion",
      kind: "a11y",
      label: "Con «reducir movimiento» activado, el engranaje para",
      explain:
        "El movimiento marea a algunas personas. En @media (prefers-reduced-motion: reduce) pon animation: none.",
      test: (ctx) => {
        const el = gear(ctx);
        return !!el && respectsReducedMotion(ctx, el, "animation");
      },
    },
    {
      id: "focus",
      kind: "a11y",
      label: "El botón muestra contorno al enfocarlo con Tab",
      explain: "Quien usa teclado necesita ver el foco. No quites el outline sin poner otro indicador.",
      test: (ctx) => {
        const el = button(ctx);
        return !!el && hasVisibleFocus(ctx, el);
      },
    },
  ],
  hints: [
    "transition suaviza cambios de estado. animation repite un @keyframes. prefers-reduced-motion pide calma.",
    ".boton { transition: background-color 0.2s; }\n.engranaje { animation: girar 4s linear infinite; }\n@keyframes girar { to { transform: rotate(360deg); } }",
    "Lee transition, @keyframes y prefers-reduced-motion en MDN.",
  ],
  mdn: [
    {
      label: "MDN: transition",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/transition",
    },
    {
      label: "MDN: @keyframes",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/At-rules/@keyframes",
    },
    {
      label: "MDN: prefers-reduced-motion (en inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion",
    },
  ],
  cards: ["cssi-transition", "cssi-keyframes", "cssi-reduced-motion"],
};
