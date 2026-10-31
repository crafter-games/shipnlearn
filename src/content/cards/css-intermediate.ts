import type { ConceptCard } from "@/lib/levels/types";

const ES = "https://developer.mozilla.org/es/docs/Web/CSS/Reference";

/** Shared look for example boxes: chunky workshop tiles. */
const TILE = `  padding: 8px 12px;
  border: 3px solid #1B1F3B;
  border-radius: 10px;
  background-color: #FFF4D6;`;

/** Concept cards for Isla Taller (CSS intermedio), in teaching order. */
export const cssIntermediateCards: ConceptCard[] = [
  // -------------------------------------------------------------------------
  // cssi-01: flex-direction, flex-wrap and the two axes
  // -------------------------------------------------------------------------
  {
    id: "cssi-flex-direction",
    worldId: "css-intermediate",
    kind: "property",
    title: "flex-direction",
    tagline: "Elige si los hijos flex van en fila o en columna.",
    explain:
      "row (por defecto) los pone en fila; column, uno debajo de otro. La dirección marca el eje principal del contenedor.",
    use: [
      "column para apilar título y botón dentro de una tarjeta.",
      "row para barras de herramientas y menús.",
    ],
    avoid: [
      "row-reverse o column-reverse: el orden visual deja de coincidir con el HTML.",
    ],
    example: {
      html: `<div class="caja">
  <span class="pieza">Martillo</span>
  <span class="pieza">Sierra</span>
</div>
`,
      css: `.caja {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "Con flex-direction: column, Sierra queda debajo de Martillo.",
    predict: {
      question: "Si cambias column por row, ¿dónde queda Sierra?",
      options: [
        {
          label: "A la derecha de Martillo",
          correct: true,
          why: "row es la dirección por defecto: los hijos van en fila, de izquierda a derecha.",
        },
        {
          label: "Encima de Martillo",
          correct: false,
          why: "Eso sería column-reverse. row pone los hijos en fila, no los apila.",
        },
      ],
    },
    mdn: { label: "MDN: flex-direction", url: `${ES}/Properties/flex-direction` },
  },
  {
    id: "cssi-flex-wrap",
    worldId: "css-intermediate",
    kind: "property",
    title: "flex-wrap",
    tagline: "Deja que los hijos flex salten a otra fila.",
    explain:
      "Por defecto (nowrap) flex mete todo en una fila, aunque no quepa. Con wrap, lo que no cabe baja a la fila siguiente.",
    use: [
      "Listas de tarjetas o etiquetas que deben caber en un móvil.",
      "Junto a gap, que separa también las filas nuevas.",
    ],
    avoid: [
      "wrap-reverse: las filas aparecen al revés que en el HTML.",
    ],
    example: {
      html: `<div class="estante">
  <span class="pieza">Martillo</span>
  <span class="pieza">Serrucho</span>
  <span class="pieza">Alicates</span>
  <span class="pieza">Metro</span>
</div>
`,
      css: `.estante {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 220px;
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "El estante mide 220px: lo que no cabe salta a la fila de abajo.",
    predict: {
      question: "Si quitas flex-wrap: wrap, ¿qué pasa con las cuatro piezas?",
      options: [
        {
          label: "Se quedan en una fila y se aprietan o se salen",
          correct: true,
          why: "nowrap es el valor por defecto: todo en una fila, quepa o no.",
        },
        {
          label: "Se apilan en una columna",
          correct: false,
          why: "Para apilarlas haría falta flex-direction: column, no quitar el wrap.",
        },
      ],
    },
    mdn: { label: "MDN: flex-wrap", url: `${ES}/Properties/flex-wrap` },
  },
  {
    id: "cssi-flex-ejes",
    worldId: "css-intermediate",
    kind: "concept",
    title: "Los dos ejes de flex",
    tagline: "justify-content: eje principal; align-items: el otro.",
    explain:
      "El eje principal sigue flex-direction; el cruzado es el perpendicular. En column, justify-content mueve en vertical y align-items en horizontal.",
    use: [
      "En row: justify-content en horizontal, align-items en vertical.",
      "En column: justify-content en vertical, align-items en horizontal.",
    ],
    avoid: [
      "Pensar que justify-content siempre es horizontal: depende de la dirección.",
      "align-items: stretch con botones: los estira a todo lo ancho.",
    ],
    example: {
      html: `<div class="cartel">
  <strong>Taller abierto</strong>
  <span class="pieza">Pasa</span>
</div>
`,
      css: `.cartel {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  height: 120px;
  padding: 8px;
  border: 3px solid #1B1F3B;
  border-radius: 12px;
  background-color: #EDE4FF;
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "En column, justify-content: flex-end los baja y align-items: center los centra.",
    predict: {
      question: "En una columna, ¿qué propiedad centra los hijos a lo ancho?",
      options: [
        {
          label: "align-items: center",
          correct: true,
          why: "En column, el eje cruzado es horizontal, y ese eje lo controla align-items.",
        },
        {
          label: "justify-content: center",
          correct: false,
          why: "En column, justify-content va en vertical: centraría de arriba abajo.",
        },
      ],
    },
    mdn: {
      label: "MDN: Conceptos básicos de flexbox",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts",
    },
  },

  // -------------------------------------------------------------------------
  // cssi-02: grow, shrink, basis and order
  // -------------------------------------------------------------------------
  {
    id: "cssi-flex-grow",
    worldId: "css-intermediate",
    kind: "property",
    title: "flex-grow y flex: 1",
    tagline: "Reparte el espacio que sobra entre los hijos flex.",
    explain:
      "flex-grow: 1 hace que el hijo crezca hasta llenar el sobrante. flex: 1 es un atajo: crece, encoge y parte de ancho 0.",
    use: [
      "Un buscador que ocupa todo menos el botón.",
      "Columnas iguales: flex: 1 en todas.",
    ],
    avoid: [
      "Poner flex-grow en el contenedor: va en los hijos.",
    ],
    example: {
      html: `<div class="banco">
  <span class="pieza">Cajón</span>
  <span class="pieza tablero">Tablero</span>
</div>
`,
      css: `.banco {
  display: flex;
  gap: 8px;
}

.pieza {
${TILE}
}

.tablero {
  flex-grow: 1;
}
`,
    },
    exampleNote: "El tablero tiene flex-grow: 1 y se queda con todo el espacio libre.",
    predict: {
      question: "Si el cajón también tuviera flex-grow: 1, ¿cómo se repartiría el sobrante?",
      options: [
        {
          label: "A partes iguales entre los dos",
          correct: true,
          why: "Los dos piden 1 parte del sobrante, así que cada uno recibe la mitad.",
        },
        {
          label: "Todo para el tablero, que lo pidió antes",
          correct: false,
          why: "El orden no importa: el sobrante se reparte según el número de cada uno.",
        },
      ],
    },
    mdn: { label: "MDN: flex-grow", url: `${ES}/Properties/flex-grow` },
  },
  {
    id: "cssi-flex-basis",
    worldId: "css-intermediate",
    kind: "property",
    title: "flex-basis y flex-shrink",
    tagline: "El ancho de partida y si se permite encoger.",
    explain:
      "flex-basis es el tamaño inicial de un hijo flex. Si falta sitio, flex-shrink decide si encoge: 1 sí (por defecto), 0 nunca.",
    use: [
      "Barras laterales o iconos que deben medir siempre lo mismo.",
      "flex: 0 0 110px resume grow 0, shrink 0 y basis 110px.",
    ],
    avoid: [
      "flex-shrink: 0 en todo: si nada encoge, aparece scroll lateral.",
    ],
    example: {
      html: `<div class="banco">
  <span class="pieza cajon">Cajón</span>
  <span class="pieza">Un tablero con mucho texto que pide sitio</span>
</div>
`,
      css: `.banco {
  display: flex;
  gap: 8px;
}

.pieza {
${TILE}
}

.cajon {
  flex-basis: 90px;
  flex-shrink: 0;
}
`,
    },
    exampleNote: "El cajón parte de 90px y, con flex-shrink: 0, no encoge aunque falte sitio.",
    predict: {
      question: "Si quitas flex-shrink: 0 y la pantalla es estrecha, ¿qué le pasa al cajón?",
      options: [
        {
          label: "Encoge por debajo de 90px",
          correct: true,
          why: "flex-shrink vale 1 por defecto: si falta sitio, todos los hijos encogen.",
        },
        {
          label: "Sigue en 90px pase lo que pase",
          correct: false,
          why: "flex-basis es solo el punto de partida; sin shrink 0, puede encoger.",
        },
      ],
    },
    mdn: { label: "MDN: flex-basis", url: `${ES}/Properties/flex-basis` },
  },
  {
    id: "cssi-order",
    worldId: "css-intermediate",
    kind: "property",
    title: "order",
    tagline: "Cambia dónde se ve un hijo flex o grid, no dónde está.",
    explain:
      "Todos empiezan en order: 0 y se colocan de menor a mayor. Solo cambia lo que se ve: el teclado y los lectores siguen el HTML.",
    use: [
      "Casi nunca: mejor cambia el orden en el HTML.",
      "Detalles decorativos que no se leen ni reciben foco.",
    ],
    avoid: [
      "Reordenar contenido o enlaces: quien usa Tab salta de un lado a otro.",
    ],
    example: {
      html: `<div class="banco">
  <span class="pieza">1 Clavos</span>
  <span class="pieza">2 Tablero</span>
  <span class="pieza">3 Tornillos</span>
</div>
`,
      css: `.banco {
  display: flex;
  gap: 8px;
}

.pieza {
${TILE}
}

.pieza:first-child {
  order: 1;
}
`,
    },
    exampleNote: "Clavos va primero en el HTML, pero order: 1 lo pinta al final.",
    predict: {
      question: "Con este CSS, ¿qué lee primero un lector de pantalla?",
      options: [
        {
          label: "Clavos, porque va primero en el HTML",
          correct: true,
          why: "order solo cambia la vista. Los lectores y el Tab siguen el orden del HTML.",
        },
        {
          label: "Tablero, porque se ve primero",
          correct: false,
          why: "Eso es justo el problema: lo que ves y lo que se lee dejan de coincidir.",
        },
      ],
    },
    mdn: { label: "MDN: order", url: `${ES}/Properties/order` },
  },

  // -------------------------------------------------------------------------
  // cssi-03: grid basics
  // -------------------------------------------------------------------------
  {
    id: "cssi-grid",
    worldId: "css-intermediate",
    kind: "property",
    title: "display: grid",
    tagline: "Convierte una caja en una rejilla de filas y columnas.",
    explain:
      "display: grid en el padre crea la rejilla; grid-template-columns dice cuántas columnas y cuánto mide cada una. Los hijos se colocan solos.",
    use: [
      "Catálogos, galerías y páginas en dos dimensiones.",
      "Flex para una fila o columna; grid para filas y columnas a la vez.",
    ],
    avoid: [
      "Poner display: grid en los hijos: la rejilla se declara en el padre.",
    ],
    example: {
      html: `<div class="catalogo">
  <span class="pieza">Martillo</span>
  <span class="pieza">Sierra</span>
  <span class="pieza">Metro</span>
  <span class="pieza">Lija</span>
</div>
`,
      css: `.catalogo {
  display: grid;
  grid-template-columns: 120px 120px;
  gap: 8px;
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "Dos valores en grid-template-columns: dos columnas de 120px.",
    predict: {
      question: "Si escribes tres valores en grid-template-columns, ¿qué cambia?",
      options: [
        {
          label: "Hay tres columnas y las piezas se recolocan",
          correct: true,
          why: "Cada valor es una columna. Los hijos llenan la rejilla de izquierda a derecha.",
        },
        {
          label: "Solo la tercera pieza cambia de tamaño",
          correct: false,
          why: "Los valores definen columnas, no piezas concretas.",
        },
      ],
    },
    mdn: {
      label: "MDN: grid-template-columns",
      url: `${ES}/Properties/grid-template-columns`,
    },
  },
  {
    id: "cssi-fr-repeat",
    worldId: "css-intermediate",
    kind: "concept",
    title: "fr y repeat()",
    tagline: "fr reparte el espacio libre; repeat() evita repetir.",
    explain:
      "1fr es una parte del espacio libre de la rejilla: tres columnas de 1fr miden igual y llenan el ancho. repeat(3, 1fr) es igual a 1fr 1fr 1fr.",
    use: [
      "Columnas iguales que se adaptan al ancho: repeat(3, 1fr).",
      "Mezclar fijo y flexible: 200px 1fr.",
    ],
    avoid: [
      "Columnas en px que suman más que la pantalla: aparece scroll lateral.",
    ],
    example: {
      html: `<div class="catalogo">
  <span class="pieza">Uno</span>
  <span class="pieza">Dos</span>
  <span class="pieza">Tres</span>
</div>
`,
      css: `.catalogo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "repeat(3, 1fr): tres columnas iguales que ocupan todo el ancho.",
    predict: {
      question: "Con grid-template-columns: 2fr 1fr, ¿cómo son las columnas?",
      options: [
        {
          label: "La primera mide el doble que la segunda",
          correct: true,
          why: "El espacio se parte en 3 partes: 2 para la primera y 1 para la segunda.",
        },
        {
          label: "La primera mide 2px",
          correct: false,
          why: "fr no es un píxel: es una fracción del espacio libre.",
        },
      ],
    },
    mdn: { label: "MDN: repeat()", url: `${ES}/Values/repeat` },
  },

  // -------------------------------------------------------------------------
  // cssi-04: areas and intrinsic responsive grids
  // -------------------------------------------------------------------------
  {
    id: "cssi-grid-areas",
    worldId: "css-intermediate",
    kind: "property",
    title: "grid-template-areas",
    tagline: "Dibuja la página con nombres de zonas.",
    explain:
      "Cada texto entre comillas es una fila y cada palabra, una celda. Con grid-area: nombre, cada hijo ocupa su zona.",
    use: [
      "Páginas con cabecera, menú, contenido y pie.",
      "Repite un nombre para que la zona ocupe varias celdas.",
    ],
    avoid: [
      "Zonas en forma de L: cada zona debe ser un rectángulo.",
      "Olvidar grid-area en los hijos: sin él, ignoran las zonas.",
    ],
    example: {
      html: `<div class="web">
  <header class="pieza cab">Cabecera</header>
  <nav class="pieza menu">Menú</nav>
  <main class="pieza cont">Contenido</main>
</div>
`,
      css: `.web {
  display: grid;
  grid-template-columns: 90px 1fr;
  grid-template-areas:
    "cab  cab"
    "menu cont";
  gap: 8px;
}

.cab { grid-area: cab; }
.menu { grid-area: menu; }
.cont { grid-area: cont; }

.pieza {
${TILE}
}
`,
    },
    exampleNote: "\"cab cab\" hace que la cabecera ocupe las dos columnas.",
    predict: {
      question: "Si la segunda fila fuera \"cont menu\", ¿dónde queda el menú?",
      options: [
        {
          label: "A la derecha del contenido",
          correct: true,
          why: "Las palabras se leen como celdas de izquierda a derecha: menú va a la derecha.",
        },
        {
          label: "Igual, porque va antes en el HTML",
          correct: false,
          why: "Con áreas manda el dibujo, no el orden del HTML.",
        },
      ],
    },
    mdn: {
      label: "MDN: grid-template-areas",
      url: `${ES}/Properties/grid-template-areas`,
    },
  },
  {
    id: "cssi-auto-fit",
    worldId: "css-intermediate",
    kind: "concept",
    title: "repeat(auto-fit, minmax())",
    tagline: "Tantas columnas como quepan, sin media queries.",
    explain:
      "minmax(140px, 1fr) da columnas de 140px como mínimo que crecen hasta repartirse el sitio. auto-fit crea tantas como quepan.",
    use: [
      "Galerías y tarjetas que se adaptan solas al ancho.",
      "Elegir el mínimo según el contenido más ancho.",
    ],
    avoid: [
      "Un mínimo mayor que el móvil, como 400px: aparece scroll lateral.",
    ],
    example: {
      html: `<div class="galeria">
  <span class="pieza">Martillo</span>
  <span class="pieza">Sierra</span>
  <span class="pieza">Metro</span>
  <span class="pieza">Lija</span>
</div>
`,
      css: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "Cambia el ancho de la ventana: las columnas pasan de 4 a 2 o a 1 solas.",
    predict: {
      question: "En un móvil de 360px con minmax(140px, 1fr), ¿cuántas columnas caben?",
      options: [
        {
          label: "Dos, cada una un poco más ancha que 140px",
          correct: true,
          why: "Caben dos de 140px; el sobrante se reparte con 1fr y llenan la fila.",
        },
        {
          label: "Cuatro, apretadas",
          correct: false,
          why: "minmax nunca baja del mínimo: si no caben de 140px, pasan a otra fila.",
        },
      ],
    },
    mdn: { label: "MDN: minmax()", url: `${ES}/Values/minmax` },
  },

  // -------------------------------------------------------------------------
  // cssi-05: positioning
  // -------------------------------------------------------------------------
  {
    id: "cssi-position-absolute",
    worldId: "css-intermediate",
    kind: "property",
    title: "position: relative y absolute",
    tagline: "Coloca un elemento encima de otro, en una esquina.",
    explain:
      "absolute saca al elemento del flujo y lo coloca con top, right, bottom y left respecto al antepasado posicionado más cercano.",
    use: [
      "Sellos, etiquetas o avisos en la esquina de una tarjeta.",
      "relative en la tarjeta para que sea la referencia.",
    ],
    avoid: [
      "Olvidar relative en el padre: el elemento se va a la esquina de la página.",
      "Maquetar páginas enteras con absolute: no se adapta al contenido.",
    ],
    example: {
      html: `<div class="ficha">
  <span class="sello">Nuevo</span>
  Martillo de carpintero
</div>
`,
      css: `.ficha {
  position: relative;
  padding: 24px 12px;
  border: 3px solid #1B1F3B;
  border-radius: 12px;
  background-color: #FFF4D6;
}

.sello {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background-color: #FFD66B;
}
`,
    },
    exampleNote: "top y right se miden desde la ficha porque tiene position: relative.",
    predict: {
      question: "Si quitas position: relative de .ficha, ¿dónde acaba el sello?",
      options: [
        {
          label: "En la esquina superior derecha de la página",
          correct: true,
          why: "Sin antepasado posicionado, absolute se mide desde la página entera.",
        },
        {
          label: "Donde estaba, dentro de la ficha",
          correct: false,
          why: "absolute busca un antepasado posicionado; sin él, usa la página.",
        },
      ],
    },
    mdn: { label: "MDN: position", url: `${ES}/Properties/position` },
  },
  {
    id: "cssi-sticky",
    worldId: "css-intermediate",
    kind: "concept",
    title: "position: sticky",
    tagline: "Se queda pegado al borde al hacer scroll.",
    explain:
      "sticky se comporta como normal hasta llegar a top (por ejemplo 0) y ahí se queda fijo mientras su contenedor siga a la vista.",
    use: [
      "Cabeceras y barras que deben verse siempre.",
      "Títulos de sección en listas largas.",
    ],
    avoid: [
      "Olvidar top: sin él, sticky no se pega a ningún borde.",
      "fixed para una cabecera: sale del flujo y tapa el contenido.",
    ],
    example: {
      html: `<header class="cab">Taller</header>
<p class="largo">Baja: la cabecera se queda arriba mientras todo lo demás sube.</p>
`,
      css: `.cab {
  position: sticky;
  top: 0;
  padding: 8px 12px;
  background-color: #5B21B6;
  color: white;
}

.largo {
  height: 600px;
}
`,
    },
    exampleNote: "Con top: 0, la cabecera se pega arriba en cuanto llega al borde.",
    predict: {
      question: "¿Qué diferencia hay con position: fixed?",
      options: [
        {
          label: "sticky guarda su hueco en la página; fixed no",
          correct: true,
          why: "fixed sale del flujo y lo de debajo sube y queda tapado; sticky no.",
        },
        {
          label: "Ninguna, son sinónimos",
          correct: false,
          why: "sticky solo se pega al llegar a top; fixed está pegado siempre.",
        },
      ],
    },
    mdn: { label: "MDN: position", url: `${ES}/Properties/position` },
  },
  {
    id: "cssi-z-index",
    worldId: "css-intermediate",
    kind: "property",
    title: "z-index",
    tagline: "Decide qué elemento posicionado se pinta encima.",
    explain:
      "Entre elementos posicionados que se solapan, gana el z-index mayor. Con el mismo valor, se pinta encima el que va después en el HTML.",
    use: [
      "Que una cabecera sticky tape lo que pasa por debajo.",
      "Que un sello quede sobre la foto de su tarjeta.",
    ],
    avoid: [
      "Valores enormes como 9999 por si acaso: usa 1, 2, 10 con sentido.",
    ],
    example: {
      html: `<div class="mesa">
  <span class="pieza a">Primera</span>
  <span class="pieza b">Segunda</span>
</div>
`,
      css: `.mesa {
  position: relative;
  height: 90px;
}

.pieza {
  position: absolute;
${TILE}
}

.a {
  top: 10px;
  left: 10px;
  z-index: 2;
  background-color: #FFD66B;
}

.b {
  top: 30px;
  left: 40px;
  z-index: 1;
  background-color: #EDE4FF;
}
`,
    },
    exampleNote: "«Primera» va antes en el HTML, pero su z-index: 2 la pinta encima.",
    predict: {
      question: "Si las dos piezas tuvieran z-index: 1, ¿cuál se vería encima?",
      options: [
        {
          label: "«Segunda», porque va después en el HTML",
          correct: true,
          why: "Con el mismo z-index, el que va después en el HTML se pinta encima.",
        },
        {
          label: "«Primera», porque va antes",
          correct: false,
          why: "Ir primero en el HTML significa pintarse antes, es decir, debajo.",
        },
      ],
    },
    mdn: { label: "MDN: z-index", url: `${ES}/Properties/z-index` },
  },

  // -------------------------------------------------------------------------
  // cssi-06: media queries
  // -------------------------------------------------------------------------
  {
    id: "cssi-media-query",
    worldId: "css-intermediate",
    kind: "concept",
    title: "@media",
    tagline: "Reglas que solo se aplican en ciertas pantallas.",
    explain:
      "@media (min-width: 700px) { … } aplica sus reglas solo si la ventana mide 700px o más. Fuera de ese ancho, se ignoran.",
    use: [
      "Pasar de una columna a varias cuando hay sitio.",
      "Cambiar tamaños de letra o espacios en pantallas grandes.",
    ],
    avoid: [
      "Un breakpoint por cada móvil del mercado: elige según tu contenido.",
      "Olvidar la llave que cierra el @media: el resto del CSS queda dentro.",
    ],
    example: {
      html: `<div class="tablon">
  <span class="pieza">Aviso 1</span>
  <span class="pieza">Aviso 2</span>
</div>
`,
      css: `.tablon {
  display: grid;
  gap: 8px;
}

@media (min-width: 500px) {
  .tablon {
    grid-template-columns: 1fr 1fr;
  }
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "En un móvil verás una columna; desde 500px, dos.",
    predict: {
      question: "En una pantalla de 400px, ¿se aplica la regla de dentro del @media?",
      options: [
        {
          label: "No: min-width: 500px pide 500px o más",
          correct: true,
          why: "400 es menor que 500, así que el navegador ignora todo el bloque.",
        },
        {
          label: "Sí: @media se aplica siempre",
          correct: false,
          why: "Esa es la gracia de @media: sus reglas dependen de la pantalla.",
        },
      ],
    },
    mdn: {
      label: "MDN: Media queries",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Media_queries",
    },
  },
  {
    id: "cssi-mobile-first",
    worldId: "css-intermediate",
    kind: "concept",
    title: "Mobile first",
    tagline: "Primero el móvil; luego, mejoras para pantallas grandes.",
    explain:
      "Escribe los estilos base para el móvil, casi siempre una columna. Luego añade @media (min-width: …) con lo que solo cabe en pantallas anchas.",
    use: [
      "Base: una columna, letra legible y sin anchos fijos.",
      "min-width en las media queries para ir ampliando.",
    ],
    avoid: [
      "Base con anchos de escritorio: en el móvil aparece scroll lateral.",
    ],
    example: {
      html: `<nav class="barra">
  <span class="pieza">Cursos</span>
  <span class="pieza">Tienda</span>
</nav>
`,
      css: `.barra {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (min-width: 500px) {
  .barra {
    flex-direction: row;
  }
}

.pieza {
${TILE}
}
`,
    },
    exampleNote: "La base apila los botones; desde 500px se ponen en fila.",
    predict: {
      question: "¿Por qué empezar por el móvil?",
      options: [
        {
          label: "Lo sencillo va en la base y lo amplio se añade",
          correct: true,
          why: "Una columna funciona en todas partes; las columnas extra solo donde caben.",
        },
        {
          label: "Porque el CSS del móvil se carga más rápido",
          correct: false,
          why: "Se carga igual. La ventaja es que la base ya funciona en pantallas pequeñas.",
        },
      ],
    },
    mdn: {
      label: "MDN: Diseño responsivo",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design",
    },
  },

  // -------------------------------------------------------------------------
  // cssi-07: custom properties
  // -------------------------------------------------------------------------
  {
    id: "cssi-custom-property",
    worldId: "css-intermediate",
    kind: "property",
    title: "--variables y :root",
    tagline: "Guarda un valor con nombre y úsalo en muchos sitios.",
    explain:
      "Una propiedad que empieza por -- guarda un valor: --marca: #5B21B6;. Definida en :root, se hereda por toda la página.",
    use: [
      "Colores de marca, espacios o radios que se repiten.",
      "Cambiar un tema entero tocando una sola línea.",
    ],
    avoid: [
      "Olvidar los dos guiones: marca: … no es una variable.",
      "Definirla en un elemento concreto si toda la página la necesita.",
    ],
    example: {
      html: `<p class="pieza titulo">Taller</p>
<p class="pieza boton">Apuntarme</p>
`,
      css: `:root {
  --marca: #5B21B6;
}

.pieza {
${TILE}
}

.titulo {
  color: var(--marca);
}

.boton {
  border-color: var(--marca);
}
`,
    },
    exampleNote: "Cambia #5B21B6 en :root y cambian el texto y el borde a la vez.",
    predict: {
      question: "Si cambias --marca a darkgreen, ¿cuántas reglas tienes que tocar?",
      options: [
        {
          label: "Solo una: la de :root",
          correct: true,
          why: "Todas las reglas leen la variable con var(), así que cambian juntas.",
        },
        {
          label: "Todas las que usan var(--marca)",
          correct: false,
          why: "var() lee el valor actual: no hace falta tocar cada regla.",
        },
      ],
    },
    mdn: {
      label: "MDN: Propiedades personalizadas",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties",
    },
  },
  {
    id: "cssi-var-fallback",
    worldId: "css-intermediate",
    kind: "concept",
    title: "var() con valor de reserva",
    tagline: "Lee una variable y da un plan B si no existe.",
    explain:
      "var(--marca) lee la variable. var(--marca, #6B3E1F) usa #6B3E1F si --marca no está definida.",
    use: [
      "Componentes que pueden usarse en páginas sin tus variables.",
      "Evitar que un error de nombre deje algo sin color.",
    ],
    avoid: [
      "Escribir mal el nombre: var(--maraca) no existe y sin reserva falla.",
    ],
    example: {
      html: `<p class="pieza">Sin variable, pero con reserva</p>
`,
      css: `.pieza {
${TILE}
  background-color: var(--fondo, #EDE4FF);
}
`,
    },
    exampleNote: "--fondo no existe, así que se usa el color de reserva #EDE4FF.",
    predict: {
      question: "Con background-color: var(--fondo) y sin --fondo definida, ¿qué fondo hay?",
      options: [
        {
          label: "Ninguno: queda transparente",
          correct: true,
          why: "La declaración no vale y el fondo vuelve a su valor inicial: transparente.",
        },
        {
          label: "Negro, como aviso de error",
          correct: false,
          why: "CSS no avisa: si falta la variable y no hay reserva, se usa el valor inicial.",
        },
      ],
    },
    mdn: { label: "MDN: var()", url: `${ES}/Values/var` },
  },

  // -------------------------------------------------------------------------
  // cssi-08: motion
  // -------------------------------------------------------------------------
  {
    id: "cssi-transition",
    worldId: "css-intermediate",
    kind: "property",
    title: "transition",
    tagline: "Suaviza el paso de un estilo a otro.",
    explain:
      "transition: background-color 0.2s hace que el cambio de fondo dure 0.2s en vez de ser instantáneo. Va en el estado normal.",
    use: [
      "Cambios de :hover y :focus-visible en botones y enlaces.",
      "Duraciones cortas, entre 0.1s y 0.3s.",
    ],
    avoid: [
      "Duraciones largas: un botón que tarda 2s parece roto.",
      "Ponerla solo en :hover: al salir, el cambio vuelve de golpe.",
    ],
    example: {
      html: `<button class="boton" type="button">Fabricar</button>
`,
      css: `.boton {
  padding: 10px 20px;
  border: 3px solid #1B1F3B;
  border-radius: 999px;
  background-color: #EDE4FF;
  transition: background-color 0.3s;
}

.boton:hover {
  background-color: #FFD66B;
}
`,
    },
    exampleNote: "Pasa el ratón por el botón: el fondo cambia de color poco a poco.",
    predict: {
      question: "Si la transition está solo en .boton:hover, ¿qué pasa al quitar el ratón?",
      options: [
        {
          label: "Vuelve al color de antes de golpe",
          correct: true,
          why: "Al salir ya no se aplica :hover, así que tampoco su transition.",
        },
        {
          label: "Vuelve suave, igual que al entrar",
          correct: false,
          why: "Para suavizar la ida y la vuelta, la transition va en el estado normal.",
        },
      ],
    },
    mdn: { label: "MDN: transition", url: `${ES}/Properties/transition` },
  },
  {
    id: "cssi-keyframes",
    worldId: "css-intermediate",
    kind: "concept",
    title: "@keyframes y animation",
    tagline: "Una animación que se mueve sola, sin esperar al usuario.",
    explain:
      "@keyframes girar { to { … } } describe la animación. animation: girar 4s linear infinite la aplica: nombre, duración, ritmo y repeticiones.",
    use: [
      "Indicadores de carga o de que algo está en marcha.",
      "infinite para repetirla sin fin; un número para N veces.",
    ],
    avoid: [
      "Animar todo: distrae y marea. Anima solo lo que comunica algo.",
    ],
    example: {
      html: `<div class="engranaje">Gira</div>
`,
      css: `.engranaje {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border: 3px dashed #1B1F3B;
  border-radius: 50%;
  animation: girar 4s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
`,
    },
    exampleNote: "girar va de 0 a 360 grados en 4s, y infinite lo repite sin parar.",
    predict: {
      question: "Si escribes animation: girar 4s pero el @keyframes se llama gira, ¿qué pasa?",
      options: [
        {
          label: "No se mueve: el nombre no coincide",
          correct: true,
          why: "animation busca un @keyframes con ese nombre exacto; si no lo encuentra, nada.",
        },
        {
          label: "Gira igual, porque se parecen",
          correct: false,
          why: "CSS no adivina: los nombres deben coincidir letra por letra.",
        },
      ],
    },
    mdn: { label: "MDN: @keyframes", url: `${ES}/At-rules/@keyframes` },
  },
  {
    id: "cssi-reduced-motion",
    worldId: "css-intermediate",
    kind: "concept",
    title: "prefers-reduced-motion",
    tagline: "Respeta a quien pide menos movimiento en su sistema.",
    explain:
      "Hay quien se marea con las animaciones y activa «reducir movimiento». @media (prefers-reduced-motion: reduce) te deja apagarlas para esa persona.",
    use: [
      "En cada animación o transición que añadas.",
      "animation: none o transition: none dentro de esa media query.",
    ],
    avoid: [
      "Pensar que es un caso raro: mucha gente lo activa sin que lo sepas.",
    ],
    example: {
      html: `<div class="engranaje">Gira</div>
`,
      css: `.engranaje {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border: 3px dashed #1B1F3B;
  border-radius: 50%;
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
`,
    },
    exampleNote: "Si tu sistema pide reducir movimiento, el engranaje se queda quieto.",
    predict: {
      question: "¿Cuándo se aplica la regla de dentro de esta media query?",
      options: [
        {
          label: "Cuando la persona activó «reducir movimiento»",
          correct: true,
          why: "La media query lee una preferencia del sistema, no el tamaño de pantalla.",
        },
        {
          label: "En pantallas pequeñas",
          correct: false,
          why: "Eso sería max-width. Esta lee la preferencia de movimiento del sistema.",
        },
      ],
    },
    mdn: {
      label: "MDN: prefers-reduced-motion (en inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion",
    },
  },
];
