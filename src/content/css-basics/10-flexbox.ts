import { $, $$, rect, sameRow } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { CACTUS_SRC, PALM_SRC, SUNFLOWER_SRC } from "./_images";

const html = `<section class="jardin" aria-label="Jardín de Tula">
  <div class="maceta"><img src="${CACTUS_SRC}" alt="Cactus" width="72" height="72"></div>
  <div class="maceta"><img src="${SUNFLOWER_SRC}" alt="Girasol" width="72" height="72"></div>
  <div class="maceta"><img src="${PALM_SRC}" alt="Palmera" width="72" height="72"></div>
</section>
`;

const base = `.jardin {
  padding: 24px;
  border-radius: 16px;
  background-color: #E8F7DA;
}

.maceta {
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFD66B;
}
`;

const solutionCss = `.jardin {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  background-color: #E8F7DA;
}

.maceta {
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFD66B;
}
`;

const macetas = (ctx: CheckContext) => $$(ctx, ".maceta");

export const flexbox: Level = {
  id: "css-10-flexbox",
  worldId: "css-basics",
  title: "Macetas en fila",
  npc: { name: "Tula la tortuga jardinera", avatar: "tula" },
  story:
    "Mis tres macetas están apiladas como una torre a punto de caerse. Ponlas en fila, en el centro del jardín, con 16px de aire entre cada una.",
  concept: "Flexbox: display: flex, justify-content y gap",
  lesson:
    "display: flex coloca a los hijos en fila. justify-content: center los agrupa en el centro y gap pone el mismo espacio entre ellos sin márgenes que se sumen en los bordes.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "row",
      kind: "required",
      label: "Las tres macetas están en la misma fila",
      explain:
        "Los <div> son block y se apilan. Pon display: flex en el contenedor (.jardin) para que sus hijos se coloquen en fila.",
      test: (ctx) => {
        const list = macetas(ctx);
        return list.length === 3 && sameRow(list, 1);
      },
    },
    {
      id: "gap",
      kind: "required",
      label: "Entre maceta y maceta hay 16px",
      explain:
        "gap: 16px; en el contenedor separa a los hijos exactamente 16px. Con margin tendrías que cuidar que no se sumen ni sobren en los extremos.",
      test: (ctx) => {
        const list = macetas(ctx);
        if (list.length !== 3) return false;
        return list
          .slice(1)
          .every((el, i) => Math.abs(rect(el).left - rect(list[i]).right - 16) <= 1);
      },
    },
    {
      id: "centered",
      kind: "required",
      label: "El grupo de macetas está centrado en el jardín",
      explain:
        "justify-content: center; reparte el espacio sobrante a ambos lados, así el grupo queda en el medio del contenedor.",
      test: (ctx) => {
        const jardin = $(ctx, ".jardin");
        const list = macetas(ctx);
        if (!jardin || list.length !== 3) return false;
        const j = rect(jardin);
        const left = Math.min(...list.map((el) => rect(el).left));
        const right = Math.max(...list.map((el) => rect(el).right));
        return Math.abs((left + right) / 2 - (j.left + j.width / 2)) <= 2;
      },
    },
    {
      id: "dom-order",
      kind: "a11y",
      label: "Se ven en el mismo orden que en el HTML",
      explain:
        "Los lectores de pantalla y el teclado siguen el orden del HTML. Si lo inviertes con row-reverse u order, lo que se ve y lo que se oye no coinciden.",
      test: (ctx) => {
        const list = macetas(ctx);
        return (
          list.length === 3 &&
          list.slice(1).every((el, i) => rect(el).left > rect(list[i]).left)
        );
      },
    },
  ],
  hints: [
    "Flexbox se activa en el padre: display: flex en .jardin. Luego centra con justify-content y separa con gap.",
    ".jardin {\n  display: flex;\n  justify-content: center;\n  gap: 16px;\n}",
    "Lee «Flexbox» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Flexbox",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Flexbox",
    },
    {
      label: "MDN: gap",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/gap",
    },
    {
      label: "MDN: justify-content",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/justify-content",
    },
  ],
  cards: ["css-flex", "css-justify-content", "css-gap"],
};
