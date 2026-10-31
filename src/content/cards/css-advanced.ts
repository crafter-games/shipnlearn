import type { ConceptCard } from "@/lib/levels/types";

/** Concept cards for Isla Volcán (CSS avanzado), in teaching order. */
export const cssAdvancedCards: ConceptCard[] = [
  // -------------------------------------------------------------------------
  // cssa-01: nesting
  // -------------------------------------------------------------------------
  {
    id: "cssa-anidado",
    worldId: "css-advanced",
    kind: "concept",
    title: "Anidado CSS",
    tagline: "Reglas dentro de otras reglas, como el HTML.",
    explain:
      "Dentro de las llaves de .card puedes escribir h2 { … }: significa «un h2 dentro de .card». Ya no repites .card en cada regla.",
    use: [
      "Agrupar los estilos de un componente en un solo bloque.",
      "Evitar repetir el mismo selector una y otra vez.",
      "Funciona en todos los navegadores actuales (Baseline desde 2023).",
    ],
    avoid: [
      "Anidar cinco niveles: el selector final pesa mucho y cuesta leerlo.",
    ],
    example: {
      html: `<article class="card">
  <h2>Obsidiana</h2>
  <p>Vidrio volcánico negro.</p>
</article>
`,
      css: `.card {
  padding: 12px;
  border: 3px solid #5C3A2E;
  border-radius: 12px;

  h2 {
    margin: 0;
    color: #A3300B;
  }
}
`,
    },
    exampleNote: "h2 va dentro de .card: equivale a escribir .card h2 { … } aparte.",
    predict: {
      question: "Con h2 { color: #A3300B; } anidado en .card, ¿qué títulos cambian?",
      options: [
        {
          label: "Solo los h2 que están dentro de una .card",
          correct: true,
          why: "Una regla anidada se aplica dentro de su padre: es lo mismo que .card h2.",
        },
        {
          label: "Todos los h2 de la página",
          correct: false,
          why: "Eso sería un h2 suelto, fuera de las llaves. Anidado, se limita a .card.",
        },
      ],
    },
    mdn: {
      label: "MDN: Anidado CSS (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using",
    },
  },
  {
    id: "cssa-ampersand",
    worldId: "css-advanced",
    kind: "selector",
    title: "& (selector de anidado)",
    tagline: "Dentro de una regla anidada, & es el propio padre.",
    explain:
      "&:hover dentro de .card significa .card:hover. Sin &, «:hover» se uniría con un espacio y buscaría hijos con el ratón encima.",
    use: [
      "Estados del propio elemento: &:hover, &:focus-within.",
      "Variantes con otra clase: &.destacada es .card.destacada.",
    ],
    avoid: [
      "Escribir & :hover con espacio: así eliges hijos, no la tarjeta.",
    ],
    example: {
      html: `<a class="boton" href="#">Comprar</a>
`,
      css: `.boton {
  padding: 8px 14px;
  border: 3px solid #5C3A2E;
  border-radius: 10px;

  &:hover,
  &:focus-visible {
    border-color: #D9480F;
  }
}
`,
    },
    exampleNote: "&:hover y &:focus-visible pegados a &: estados del propio .boton.",
    predict: {
      question: "Dentro de .card, ¿qué elige & .titulo (con espacio)?",
      options: [
        {
          label: "Un .titulo dentro de .card",
          correct: true,
          why: "El espacio es el combinador de descendiente: .card .titulo.",
        },
        {
          label: "Una .card que además tiene la clase .titulo",
          correct: false,
          why: "Eso sería &.titulo, pegado y sin espacio.",
        },
      ],
    },
    mdn: {
      label: "MDN: Selector & (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Nesting_selector",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-02: :has()
  // -------------------------------------------------------------------------
  {
    id: "cssa-has",
    worldId: "css-advanced",
    kind: "selector",
    title: ":has()",
    tagline: "Elige un elemento según lo que tiene dentro.",
    explain:
      ".cristal:has(input:checked) elige la tarjeta que contiene una casilla marcada. Por fin, el padre reacciona a sus hijos sin JavaScript.",
    use: [
      "Resaltar una tarjeta cuando su casilla está marcada.",
      "Cambiar un formulario si tiene un campo :invalid.",
      "Funciona en todos los navegadores actuales (Baseline desde 2023).",
    ],
    avoid: [
      "Anclarlo en body si basta un contenedor cercano: obliga a revisar más elementos.",
    ],
    example: {
      html: `<label class="opcion"><input type="checkbox" checked> Amatista</label>
<label class="opcion"><input type="checkbox"> Ópalo</label>
`,
      css: `.opcion {
  display: block;
  margin-bottom: 8px;
  padding: 8px;
  border: 4px solid #EADCF5;
  border-radius: 10px;
}

.opcion:has(input:checked) {
  border-color: #6B2FA3;
}
`,
    },
    exampleNote: "Solo la opción con la casilla marcada lleva el borde violeta oscuro.",
    predict: {
      question: "¿Qué elige .reservas:has(input:checked)?",
      options: [
        {
          label: "El contenedor .reservas, si tiene alguna casilla marcada",
          correct: true,
          why: ":has() elige al elemento de la izquierda; lo de dentro es la condición.",
        },
        {
          label: "Las casillas marcadas dentro de .reservas",
          correct: false,
          why: "Eso sería .reservas input:checked. :has() devuelve el contenedor.",
        },
      ],
    },
    mdn: {
      label: "MDN: :has()",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:has",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-03: cascade layers
  // -------------------------------------------------------------------------
  {
    id: "cssa-layer",
    worldId: "css-advanced",
    kind: "concept",
    title: "@layer",
    tagline: "Agrupa tus reglas en capas con un orden fijo.",
    explain:
      "@layer components { … } mete reglas en una capa. Entre capas no cuenta la especificidad: gana la capa declarada más tarde.",
    use: [
      "Ordenar reset, componentes y utilidades sin pelear con selectores.",
      "Que una clase de utilidad gane siempre, sin !important.",
      "Funciona en todos los navegadores actuales (Baseline desde 2022).",
    ],
    avoid: [
      "Subir la especificidad (.lab .u-peligro) para ganar: la siguiente regla perderá.",
    ],
    example: {
      html: `<p class="aviso u-rojo">¡Lava cerca!</p>
`,
      css: `@layer componentes, utilidades;

@layer utilidades {
  .u-rojo { color: #B3260B; }
}

@layer componentes {
  p.aviso { color: #1F5F8B; }
}
`,
    },
    exampleNote: "p.aviso pesa más, pero utilidades se declaró después: el texto sale rojo.",
    predict: {
      question: "Con @layer base, temas; ¿qué capa gana si dos reglas chocan?",
      options: [
        {
          label: "temas, porque se nombró después",
          correct: true,
          why: "El orden de la lista manda: cada capa vence a las anteriores.",
        },
        {
          label: "La que tenga el selector más específico",
          correct: false,
          why: "La especificidad solo decide dentro de la misma capa.",
        },
      ],
    },
    mdn: {
      label: "MDN: @layer (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer",
    },
  },
  {
    id: "cssa-orden-capas",
    worldId: "css-advanced",
    kind: "concept",
    title: "Orden de las capas",
    tagline: "Una lista al principio decide quién gana.",
    explain:
      "@layer reset, components, utilities; fija el orden aunque las reglas vengan después. Las reglas fuera de toda capa ganan a todas.",
    use: [
      "Escribir la lista de capas en la primera línea del CSS.",
      "Dejar las utilidades en la última capa.",
    ],
    avoid: [
      "Olvidar la lista: el orden sería el de la primera aparición de cada capa.",
      "Dejar CSS suelto sin capa sin querer: le ganará a todas tus capas.",
    ],
    example: {
      html: `<button class="boton">Mezclar</button>
`,
      css: `@layer reset, components;

@layer components {
  .boton { background: #1F5F8B; color: white; }
}

@layer reset {
  button.boton { background: gray; }
}
`,
    },
    exampleNote: "button.boton pesa más y va después, pero la lista puso reset primero: gana components.",
    predict: {
      question: "Una regla sin @layer choca con una de @layer utilities. ¿Cuál gana?",
      options: [
        {
          label: "La regla sin capa",
          correct: true,
          why: "El CSS fuera de capas va por encima de todas las capas.",
        },
        {
          label: "La de utilities, por estar en una capa",
          correct: false,
          why: "Estar en una capa no da más fuerza: las reglas sueltas vencen a las capas.",
        },
      ],
    },
    mdn: {
      label: "MDN: Capas de cascada (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-04: container queries
  // -------------------------------------------------------------------------
  {
    id: "cssa-container-type",
    worldId: "css-advanced",
    kind: "property",
    title: "container-type",
    tagline: "Convierte una caja en contenedor que se puede consultar.",
    explain:
      "container-type: inline-size deja que sus hijos pregunten por su ancho con @container. Sin él, @container no tiene a quién mirar.",
    use: [
      "En la columna o barra donde vive un componente.",
      "inline-size para consultar el ancho, que es lo habitual.",
      "Funciona en todos los navegadores actuales (Baseline desde 2023).",
    ],
    avoid: [
      "Ponerlo en el propio componente: un elemento no puede consultarse a sí mismo.",
    ],
    example: {
      html: `<aside class="barra">
  <p class="nota">Pregunto por el ancho de .barra.</p>
</aside>
`,
      css: `.barra {
  container-type: inline-size;
  width: 200px;
  padding: 8px;
  border: 3px dashed #5C3A2E;
}
`,
    },
    exampleNote: "La barra discontinua es ahora un contenedor: .nota puede preguntar por su ancho.",
    predict: {
      question: "¿Dónde pones container-type para que .tarjeta use @container?",
      options: [
        {
          label: "En un ancestro, como la columna que la contiene",
          correct: true,
          why: "@container consulta al contenedor más cercano por encima del elemento.",
        },
        {
          label: "En la propia .tarjeta",
          correct: false,
          why: "Su ancho dependería de sus estilos, que dependen de su ancho: un círculo.",
        },
      ],
    },
    mdn: {
      label: "MDN: container-type (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type",
    },
  },
  {
    id: "cssa-container",
    worldId: "css-advanced",
    kind: "concept",
    title: "@container",
    tagline: "Estilos según el ancho de la caja, no de la pantalla.",
    explain:
      "@container (min-width: 360px) { … } aplica sus reglas cuando el contenedor mide 360px o más. Un componente se adapta donde lo pongas.",
    use: [
      "Tarjetas que van en una columna ancha y en una barra estrecha.",
      "Componentes reutilizables que no saben dónde acabarán.",
    ],
    avoid: [
      "Usar @media para un componente: mira la pantalla, no su hueco real.",
    ],
    example: {
      html: `<div class="zona"><div class="ficha"><b>Cráter</b><span>1180 °C</span></div></div>
<div class="zona estrecha"><div class="ficha"><b>Cráter</b><span>1180 °C</span></div></div>
`,
      css: `.zona { container-type: inline-size; margin-bottom: 8px; }
.estrecha { width: 120px; }
.ficha { display: grid; gap: 4px; padding: 8px; border: 3px solid #5C3A2E; }

@container (min-width: 200px) {
  .ficha { grid-template-columns: 1fr 1fr; }
}
`,
    },
    exampleNote: "Misma .ficha: en la zona ancha va en dos columnas; en la de 120px, apilada.",
    predict: {
      question: "Pantalla de 1200px y barra de 200px. ¿@container (min-width: 400px) se cumple en la barra?",
      options: [
        {
          label: "No: la barra mide 200px",
          correct: true,
          why: "@container mira el ancho del contenedor, no el de la pantalla.",
        },
        {
          label: "Sí: la pantalla mide 1200px",
          correct: false,
          why: "Eso sería @media. @container solo mira su caja.",
        },
      ],
    },
    mdn: {
      label: "MDN: Consultas de contenedor",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Containment/Container_queries",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-05: subgrid
  // -------------------------------------------------------------------------
  {
    id: "cssa-subgrid",
    worldId: "css-advanced",
    kind: "concept",
    title: "subgrid",
    tagline: "Una rejilla hija que usa las filas de su madre.",
    explain:
      "Con grid-row: span 3 y grid-template-rows: subgrid, cada tarjeta ocupa tres filas del padre. Así los títulos y botones se alinean.",
    use: [
      "Tarjetas en fila con títulos de largos distintos.",
      "Formularios con etiquetas y campos alineados en columnas.",
      "Funciona en todos los navegadores actuales (Baseline desde 2023).",
    ],
    avoid: [
      "Olvidar grid-row: span N: sin filas que heredar, la tarjeta se aplasta en una.",
    ],
    example: {
      html: `<div class="fila">
  <div class="t"><b>Jade</b><span>Verde.</span></div>
  <div class="t"><b>Topacio imperial dorado</b><span>Raro.</span></div>
</div>
`,
      css: `.fila { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.t {
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  padding: 8px;
  border: 3px solid #5C3A2E;
}
`,
    },
    exampleNote: "El título largo ocupa dos líneas y empuja los dos textos a la misma altura.",
    predict: {
      question: "Si una tarjeta tiene el título más alto, ¿qué pasa en las otras con subgrid?",
      options: [
        {
          label: "Su fila de título crece igual",
          correct: true,
          why: "Comparten la misma fila del padre, así que todas miden lo que la más alta.",
        },
        {
          label: "Nada: cada tarjeta mide sus propias filas",
          correct: false,
          why: "Eso pasa sin subgrid: cada rejilla interna va a su aire.",
        },
      ],
    },
    mdn: {
      label: "MDN: Subgrid (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-06: modern colour
  // -------------------------------------------------------------------------
  {
    id: "cssa-oklch",
    worldId: "css-advanced",
    kind: "concept",
    title: "oklch()",
    tagline: "Colores por luz, intensidad y tono.",
    explain:
      "oklch(52% 0.19 38): luz del 0 al 100%, intensidad (0 es gris) y tono en grados. Subir la luz aclara sin cambiar el tono.",
    use: [
      "Crear tonos claros y oscuros de un color cambiando solo L.",
      "Paletas con la misma luz percibida: contraste más previsible.",
      "Funciona en todos los navegadores actuales (Baseline desde 2023).",
    ],
    avoid: [
      "Intensidades muy altas: la pantalla no puede mostrarlas y las recorta.",
    ],
    example: {
      html: `<span class="m a">40%</span><span class="m b">70%</span><span class="m c">90%</span>
`,
      css: `.m { display: inline-block; padding: 12px; font-weight: bold; }
.a { background: oklch(40% 0.15 38); color: white; }
.b { background: oklch(70% 0.15 38); }
.c { background: oklch(90% 0.06 38); }
`,
    },
    exampleNote: "Mismo tono (38): al subir la luz sale una escala limpia del mismo naranja.",
    predict: {
      question: "¿Qué hace pasar de oklch(50% 0.2 38) a oklch(50% 0 38)?",
      options: [
        {
          label: "Lo vuelve gris, con la misma luz",
          correct: true,
          why: "El segundo valor es la intensidad: en 0 no queda color.",
        },
        {
          label: "Lo vuelve negro",
          correct: false,
          why: "Para negro baja el primer valor, la luz, a 0%.",
        },
      ],
    },
    mdn: {
      label: "MDN: oklch() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch",
    },
  },
  {
    id: "cssa-color-mix",
    worldId: "css-advanced",
    kind: "concept",
    title: "color-mix()",
    tagline: "Mezcla dos colores en la proporción que digas.",
    explain:
      "color-mix(in oklch, var(--lava), black 25%) da la lava con un 25% de negro: un hover más oscuro sin inventar otro código.",
    use: [
      "Tonos de hover o activo a partir del color de marca.",
      "Fondos suaves: tu color con mucho blanco.",
      "Funciona en todos los navegadores actuales (Baseline desde 2023).",
    ],
    avoid: [
      "Mezclar in srgb: los tonos intermedios salen más grises que in oklch.",
    ],
    example: {
      html: `<span class="m base">Lava</span><span class="m osc">Lava + 25% negro</span>
`,
      css: `:root { --lava: oklch(52% 0.19 38); }
.m { display: inline-block; padding: 12px; color: white; }
.base { background: var(--lava); }
.osc { background: color-mix(in oklch, var(--lava), black 25%); }
`,
    },
    exampleNote: "Si cambias --lava, el tono oscuro se recalcula solo.",
    predict: {
      question: "¿Qué da color-mix(in oklch, red, white 90%)?",
      options: [
        {
          label: "Un rosa muy pálido",
          correct: true,
          why: "Es 90% blanco y solo 10% rojo.",
        },
        {
          label: "Un rojo casi puro",
          correct: false,
          why: "El porcentaje va con white: 90% blanco, así que domina el blanco.",
        },
      ],
    },
    mdn: {
      label: "MDN: color-mix() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix",
    },
  },
  {
    id: "cssa-light-dark",
    worldId: "css-advanced",
    kind: "concept",
    title: "light-dark()",
    tagline: "Un color para tema claro y otro para el oscuro.",
    explain:
      "light-dark(claro, oscuro) elige según el tema. Antes declara los dos en :root con color-scheme: light dark.",
    use: [
      "Fondos y textos que cambian con el tema del sistema.",
      "Junto a variables: --fondo: light-dark(…, …).",
      "Baseline desde 2024: va en los navegadores actuales.",
    ],
    avoid: [
      "Usarlo sin color-scheme: light dark: siempre saldría el color claro.",
      "Cambiar el fondo y no el texto: en oscuro desaparecería.",
    ],
    example: {
      html: `<p class="nota">Tema oscuro forzado</p>
`,
      css: `:root { color-scheme: dark; }
.nota {
  padding: 12px;
  background: light-dark(#FFF4E8, #2B1B17);
  color: light-dark(#2B1B17, #FFF4E8);
}
`,
    },
    exampleNote: "Con color-scheme: dark, light-dark() toma el segundo valor de cada pareja.",
    predict: {
      question: "Sin color-scheme en la página, ¿qué da light-dark(white, black)?",
      options: [
        {
          label: "white, el valor claro",
          correct: true,
          why: "Sin color-scheme la página es solo clara, así que gana el primero.",
        },
        {
          label: "black si el sistema está en modo oscuro",
          correct: false,
          why: "Solo pasa si la página acepta el oscuro con color-scheme: light dark.",
        },
      ],
    },
    mdn: {
      label: "MDN: light-dark() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-07: fluid type
  // -------------------------------------------------------------------------
  {
    id: "cssa-clamp",
    worldId: "css-advanced",
    kind: "concept",
    title: "clamp()",
    tagline: "Un valor que fluye entre un mínimo y un máximo.",
    explain:
      "clamp(2rem, 1rem + 4vw, 4rem) usa el valor del medio, pero nunca baja de 2rem ni pasa de 4rem. Ideal para títulos fluidos.",
    use: [
      "Títulos que crecen con la pantalla sin pasarse.",
      "Mezclar rem y vw en el medio: respeta la letra del usuario.",
      "Funciona en todos los navegadores actuales.",
    ],
    avoid: [
      "Solo vw: ignora el tamaño de letra del usuario y no crece con el zoom.",
    ],
    example: {
      html: `<h1 class="fluido">Festival del Cráter</h1>
`,
      css: `.fluido {
  margin: 0;
  font-size: clamp(1.5rem, 1rem + 4vw, 3rem);
}
`,
    },
    exampleNote: "En pantallas anchas el título crece, pero se frena entre 1.5rem y 3rem.",
    predict: {
      question: "Con clamp(2rem, 10vw, 4rem) en una pantalla de 1200px, ¿cuánto mide?",
      options: [
        {
          label: "4rem (64px)",
          correct: true,
          why: "10vw serían 120px, más que el máximo: se queda en 4rem.",
        },
        {
          label: "120px",
          correct: false,
          why: "clamp() no deja pasar del tercer valor, 4rem.",
        },
      ],
    },
    mdn: {
      label: "MDN: clamp() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp",
    },
  },
  {
    id: "cssa-text-wrap",
    worldId: "css-advanced",
    kind: "property",
    title: "text-wrap: balance",
    tagline: "Reparte un título en líneas de largo parecido.",
    explain:
      "Sin balance, la última línea puede quedar con una palabra sola. Con balance, el navegador iguala el largo de las líneas.",
    use: [
      "Títulos y subtítulos de dos o tres líneas.",
      "text-wrap: pretty para párrafos: evita palabras solas al final.",
      "balance va en los navegadores actuales desde 2024.",
    ],
    avoid: [
      "Usarlo en párrafos largos: solo actúa en textos de pocas líneas.",
    ],
    example: {
      html: `<h2 class="t">Música hasta que salga el sol en el cráter</h2>
<h2 class="t b">Música hasta que salga el sol en el cráter</h2>
`,
      css: `.t { width: 240px; margin: 0 0 8px; font-size: 1.25rem; }
.b { text-wrap: balance; }
`,
    },
    exampleNote: "Mismo título y ancho: el segundo reparte las palabras en dos líneas parejas.",
    predict: {
      question: "¿Cambia text-wrap: balance el tamaño de la letra?",
      options: [
        {
          label: "No, solo dónde se corta cada línea",
          correct: true,
          why: "Mueve los saltos de línea; la letra y el ancho siguen iguales.",
        },
        {
          label: "Sí, encoge el texto para que quepa",
          correct: false,
          why: "Nunca toca el tamaño: solo reparte las palabras entre líneas.",
        },
      ],
    },
    mdn: {
      label: "MDN: text-wrap",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/text-wrap",
    },
  },
  // -------------------------------------------------------------------------
  // cssa-08: anchor positioning
  // -------------------------------------------------------------------------
  {
    id: "cssa-anchor",
    worldId: "css-advanced",
    kind: "property",
    title: "anchor-name y position-anchor",
    tagline: "Ata un elemento flotante a otro elemento.",
    explain:
      "anchor-name: --frasco marca el ancla; position-anchor: --frasco ata a ella el elemento posicionado. Si el ancla se mueve, la sigue.",
    use: [
      "Tooltips, menús y popovers pegados a su botón.",
      "Un popover abierto con popovertarget ya usa su botón como ancla.",
      "Baseline desde 2026: en navegadores viejos, prevé un respaldo.",
    ],
    avoid: [
      "Calcular top y left a mano: si el botón se mueve, el tooltip no.",
      "Olvidar los dos guiones: el nombre del ancla es --algo.",
    ],
    example: {
      html: `<button class="b">Azufre</button>
<span class="tip">Huele fuerte</span>
`,
      css: `body { padding: 56px 24px 8px; }
.b { anchor-name: --b; }
.tip {
  position: absolute;
  position-anchor: --b;
  position-area: top;
  margin-bottom: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  background: #8A2B06;
  color: white;
}
`,
    },
    exampleNote: ".tip no sabe dónde está el botón: el ancla --b lo coloca encima.",
    predict: {
      question: "¿Qué pasa si quitas anchor-name: --b del botón?",
      options: [
        {
          label: "La etiqueta pierde su ancla y deja de pegarse",
          correct: true,
          why: "position-anchor busca un ancla llamada --b; si no existe, no hay a quién atarse.",
        },
        {
          label: "Nada: position-anchor ya sabe cuál es el botón",
          correct: false,
          why: "position-anchor solo nombra el ancla; anchor-name es quien la crea.",
        },
      ],
    },
    mdn: {
      label: "MDN: Posicionamiento con anclas (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using",
    },
  },
  {
    id: "cssa-position-area",
    worldId: "css-advanced",
    kind: "property",
    title: "position-area",
    tagline: "Coloca el elemento anclado a un lado de su ancla.",
    explain:
      "Imagina una rejilla de 3×3 con el ancla en el centro. position-area: top pone el elemento en la celda de arriba, centrado.",
    use: [
      "top, bottom, left o right para pegarlo a un lado.",
      "top right y similares para las esquinas.",
      "anchor() para medidas finas: top: anchor(bottom).",
    ],
    avoid: [
      "Dejar el margin automático de un popover: quita el hueco con margin: 0.",
    ],
    example: {
      html: `<button class="b">Ceniza</button>
<span class="tip">Fina como harina</span>
`,
      css: `body { padding: 8px; }
.b { anchor-name: --b; }
.tip {
  position: absolute;
  position-anchor: --b;
  position-area: right;
  margin-left: 8px;
}
`,
    },
    exampleNote: "position-area: right deja la etiqueta a la derecha, a 8px del botón.",
    predict: {
      question: "¿Dónde queda un elemento con position-area: bottom?",
      options: [
        {
          label: "Debajo del ancla, centrado",
          correct: true,
          why: "bottom es la celda de abajo de la rejilla que rodea al ancla.",
        },
        {
          label: "Al fondo de la página",
          correct: false,
          why: "position-area se mide desde el ancla, no desde la página.",
        },
      ],
    },
    mdn: {
      label: "MDN: position-area (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area",
    },
  },
];
