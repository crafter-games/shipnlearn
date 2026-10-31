import { $, $$, rect, sameRow, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { hasVisibleFocus, noHorizontalScroll, px, svgDataUri, textContrast } from "./_helpers";

/** 4:3 portrait of Octo: squashing it into a square without object-fit deforms it. */
const AVATAR = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
  <rect width="160" height="120" fill="#1E90FF"/>
  <circle cx="80" cy="56" r="34" fill="#9B5DE5"/>
  <circle cx="68" cy="50" r="7" fill="#fff"/><circle cx="92" cy="50" r="7" fill="#fff"/>
  <circle cx="69" cy="51" r="3.5" fill="#1B1F3B"/><circle cx="93" cy="51" r="3.5" fill="#1B1F3B"/>
  <path d="M70 66 q10 8 20 0" stroke="#1B1F3B" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M50 84 q8 22 16 0 q8 22 14 0 q8 22 14 0 q8 22 16 0" stroke="#9B5DE5" stroke-width="8" fill="none" stroke-linecap="round"/>
</svg>`);

const html = `<article class="perfil">
  <img class="avatar" src="${AVATAR}" alt="Octo, un pulpo morado que sonríe">
  <h2 class="nombre">Octo</h2>
  <p class="bio">Cartero del archipiélago. Reparte webs recién lanzadas por todas las islas.</p>
  <div class="acciones">
    <a class="boton" href="#">Seguir</a>
    <a class="boton" href="#">Mensaje</a>
  </div>
</article>
`;

const starterCss = `.perfil {
  width: 320px;
  padding: 24px;
  border: 3px solid #1B1F3B;
  border-radius: 24px;
  background-color: #FFFFFF;
  text-align: center;
}

.avatar {
  width: 120px;
}

.bio {
  color: #9AA0B4;
}

.boton {
  padding: 10px 18px;
  border-radius: 12px;
  background-color: #1E90FF;
  color: white;
  text-decoration: none;
  outline: none;
}
`;

const solutionCss = `.perfil {
  box-sizing: border-box;
  width: 320px;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  border: 3px solid #1B1F3B;
  border-radius: 24px;
  background-color: #FFFFFF;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #1B1F3B;
}

.nombre {
  margin: 12px 0 4px;
  font-size: 1.5rem;
}

.bio {
  margin: 0 0 16px;
  color: #4A5068;
}

.acciones {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.boton {
  padding: 10px 18px;
  border-radius: 12px;
  background-color: #0B5CAD;
  color: white;
  text-decoration: none;
  outline: none;
}

.boton:focus-visible {
  outline: 3px solid #1B1F3B;
  outline-offset: 3px;
}
`;

const avatar = (ctx: CheckContext) => $(ctx, ".perfil img");
const botones = (ctx: CheckContext) => $$(ctx, ".perfil .boton");
const CORNERS = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

export const perfil: Level = {
  id: "css-11-perfil",
  worldId: "css-basics",
  title: "Jefe: Tarjeta de perfil",
  npc: { name: "Octo", avatar: "octo" },
  story:
    "Mi tarjeta de perfil: 320px justos, foto redonda sin aplastarme, botones en fila ¡y que quepa en un móvil!",
  concept: "Componente completo: caja, imagen, flexbox, foco y responsive",
  lesson:
    "Usaste todo el mundo CSS: border-box, object-fit, border-radius, flexbox, :focus-visible, contraste y max-width.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["html", "css"],
  solution: { html, css: solutionCss },
  boss: true,
  checks: [
    {
      id: "card-width",
      kind: "required",
      label: "La tarjeta mide exactamente 320px de ancho",
      explain:
        "Con content-box, 320px más 48px de padding y 6px de borde dan 374px. Usa box-sizing: border-box.",
      test: (ctx) => {
        const card = $(ctx, ".perfil");
        return !!card && Math.abs(rect(card).width - 320) <= 0.5;
      },
    },
    {
      id: "avatar-square",
      kind: "required",
      label: "El avatar es cuadrado (mismo ancho que alto)",
      explain:
        "La foto original es apaisada (4:3). Para un círculo perfecto, dale el mismo width y height al <img>.",
      test: (ctx) => {
        const img = avatar(ctx);
        if (!img) return false;
        const r = rect(img);
        return r.width >= 64 && Math.abs(r.width - r.height) <= 1;
      },
    },
    {
      id: "avatar-round",
      kind: "required",
      label: "El avatar es redondo",
      explain: "border-radius: 50%; redondea tanto cada esquina que una caja cuadrada se vuelve un círculo.",
      test: (ctx) => {
        const img = avatar(ctx);
        if (!img) return false;
        const half = rect(img).width / 2;
        return CORNERS.every((c) => {
          const value = style(ctx, img, `border-${c}-radius`);
          return value.endsWith("%") ? px(value) >= 50 : px(value) >= half - 1;
        });
      },
    },
    {
      id: "avatar-undistorted",
      kind: "required",
      label: "Octo no sale aplastado",
      explain:
        "Si fuerzas una imagen 4:3 en una caja cuadrada, se estira. object-fit: cover la recorta en vez de deformarla.",
      test: (ctx) => {
        const img = avatar(ctx) as HTMLImageElement | null;
        if (!img || !img.naturalWidth || !img.naturalHeight) return false;
        if (style(ctx, img, "object-fit") === "cover") return true;
        const r = rect(img);
        return Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) < 0.02;
      },
    },
    {
      id: "buttons-row",
      kind: "required",
      label: "Los dos botones están en fila, dentro de la tarjeta",
      explain:
        "Pon display: flex y un gap en .acciones. Que los botones no se salgan del borde.",
      test: (ctx) => {
        const card = $(ctx, ".perfil");
        const list = botones(ctx);
        if (!card || list.length !== 2 || !sameRow(list, 2)) return false;
        const c = rect(card);
        return list.every((b) => rect(b).left >= c.left && rect(b).right <= c.right);
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "Nombre, bio y botones se leen bien (contraste 4.5:1)",
      explain:
        "La bio gris y los botones azul claro no llegan a 4.5:1. Oscurece la bio y el fondo azul.",
      test: (ctx) => {
        const els = [$(ctx, ".perfil .nombre"), $(ctx, ".perfil .bio"), ...botones(ctx)];
        return els.length === 4 && els.every((el) => !!el && textContrast(ctx, el) >= 4.5);
      },
    },
    {
      id: "focus",
      kind: "a11y",
      label: "Los botones muestran contorno al enfocarlos con Tab",
      explain:
        "Con outline: none nadie que use Tab sabe dónde está. Añade .boton:focus-visible con un outline de 2px o más.",
      test: (ctx) => {
        const list = botones(ctx);
        return list.length === 2 && list.every((b) => hasVisibleFocus(ctx, b));
      },
    },
    {
      id: "alt",
      kind: "a11y",
      label: "El avatar tiene un texto alternativo",
      explain: "El atributo alt describe la imagen a quien no puede verla. No lo borres al editar el HTML.",
      test: (ctx) => (avatar(ctx)?.getAttribute("alt") ?? "").trim().length > 0,
    },
    {
      // Last: it resizes the preview and later checks would see 360px.
      id: "mobile",
      kind: "required",
      label: "En un móvil de 360px no hay scroll horizontal",
      explain:
        "Si la tarjeta es más ancha que la pantalla, hay scroll lateral. Con border-box y max-width: 100% cabe.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return noHorizontalScroll(ctx) && ctx.doc.documentElement.scrollWidth <= 360;
      },
    },
  ],
  hints: [
    "Repasa: border-box, avatar con width = height, object-fit y border-radius, flex, contraste y :focus-visible.",
    ".perfil { box-sizing: border-box; }\n.avatar { height: 120px; object-fit: cover; border-radius: 50%; }\n.acciones { display: flex; gap: 12px; }",
    "Consulta object-fit y box-sizing en MDN.",
  ],
  mdn: [
    {
      label: "MDN: object-fit",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/object-fit",
    },
    {
      label: "MDN: box-sizing",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/box-sizing",
    },
    {
      label: "MDN: :focus-visible",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:focus-visible",
    },
  ],
  cards: [],
};
