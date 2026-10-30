import type { ConceptCard } from "@/lib/levels/types";

/** Concept cards for Isla Estilo (CSS fundamental), in teaching order. */
export const cssCards: ConceptCard[] = [
  // -------------------------------------------------------------------------
  // css-01: the first rule
  // -------------------------------------------------------------------------
  {
    id: "css-regla",
    worldId: "css-basics",
    kind: "concept",
    title: "Regla CSS",
    tagline: "Le dice al navegador a quién cambiar y cómo debe verse.",
    explain:
      "HTML dice qué es cada cosa; CSS dice cómo se ve. Una regla empieza con un selector, que elige a quién se aplica, y entre llaves { } lleva declaraciones propiedad: valor; (qué cambiar y cómo). El selector más simple es el nombre de una etiqueta sin < >: p elige todos los <p> de la página.",
    use: [
      "Escribe una regla por cada grupo de elementos que quieras cambiar.",
      "Junta en las mismas llaves todas las declaraciones para esos elementos.",
      "Termina cada declaración con punto y coma, incluso la última: así añadir otra no rompe nada.",
    ],
    avoid: [
      "Escribir el selector como en HTML: <p> { … } no funciona; el selector es p, sin < >.",
      "Olvidar los dos puntos o el punto y coma: el navegador no entiende la declaración y la ignora.",
    ],
    example: {
      html: `<h1>Flores de Rosa</h1>
<p>Ramos frescos cada mañana.</p>
<p>Encargos para bodas y cumpleaños.</p>
`,
      css: `p {
  color: darkmagenta;
}
`,
    },
    exampleNote:
      "p es el selector, color la propiedad y darkmagenta el valor; las llaves encierran la declaración.",
    predict: {
      question: "Con la regla p { color: darkmagenta; }, ¿qué se pinta de ese color?",
      options: [
        {
          label: "Los dos párrafos",
          correct: true,
          why: "Un selector de etiqueta elige todos los elementos de ese tipo, no solo el primero.",
        },
        {
          label: "Solo el primer párrafo",
          correct: false,
          why: "p no distingue entre párrafos: los elige a todos. Para elegir uno concreto hacen falta clases o ids.",
        },
        {
          label: "Toda la página, título incluido",
          correct: false,
          why: "El <h1> no es un <p>, así que la regla no lo toca.",
        },
      ],
    },
    mdn: {
      label: "MDN: ¿Qué es CSS?",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/What_is_CSS",
    },
  },
  {
    id: "css-color",
    worldId: "css-basics",
    kind: "property",
    title: "color",
    tagline: "Cambia el color del texto.",
    explain:
      "color pinta las letras de un elemento. Acepta nombres de color en inglés (crimson, navy, seagreen) o códigos como #B00020. Solo afecta al texto, no al fondo de la caja.",
    use: [
      "Destacar un título con el color de tu marca.",
      "Oscurecer un texto que se lee mal sobre su fondo.",
    ],
    avoid: [
      "Escribir colour, con u: CSS usa inglés americano y la ignora sin avisar.",
      "Elegir un color claro sobre fondo blanco: con un contraste menor de 4.5:1, mucha gente no podrá leerlo.",
      "Usar el color como única señal (rojo para error): quien no distingue colores se lo pierde.",
    ],
    example: {
      html: `<h1>Flores de Rosa</h1>
<p>Tulipanes, girasoles y margaritas.</p>
`,
      css: `h1 {
  color: darkgreen;
}
`,
    },
    exampleNote: "color: darkgreen solo cambia las letras del <h1>; el párrafo conserva su color.",
    predict: {
      question: "¿Qué pasa si escribes colour: darkgreen; en vez de color: darkgreen;?",
      options: [
        {
          label: "El título no cambia de color",
          correct: true,
          why: "colour no es una propiedad de CSS. El navegador ignora lo que no entiende, sin mostrar ningún error.",
        },
        {
          label: "Funciona igual",
          correct: false,
          why: "CSS no corrige la ortografía: la propiedad tiene que escribirse exactamente color.",
        },
        {
          label: "Se rompe todo el CSS de la página",
          correct: false,
          why: "Solo se ignora esa declaración; el resto de reglas sigue funcionando.",
        },
      ],
    },
    mdn: {
      label: "MDN: color",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/color",
    },
  },
  {
    id: "css-text-align",
    worldId: "css-basics",
    kind: "property",
    title: "text-align",
    tagline: "Alinea el texto a la izquierda, al centro o a la derecha.",
    explain:
      "text-align decide hacia dónde se coloca el texto dentro de su caja: left (izquierda), center (centro) o right (derecha). La caja no se mueve ni cambia de tamaño; solo se recoloca lo que hay dentro.",
    use: [
      "Centrar un título corto o el texto de un cartel.",
      "Alinear a la derecha una firma o una fecha.",
    ],
    avoid: [
      "Centrar párrafos largos: con muchas líneas, el ojo pierde dónde empieza cada una.",
      "Esperar que centre la caja entera: text-align mueve el contenido, no la caja.",
    ],
    example: {
      html: `<h2>Ramo del día</h2>
<p>Tres girasoles y un lazo amarillo.</p>
`,
      css: `h2 {
  text-align: center;
}

p {
  text-align: right;
}
`,
    },
    exampleNote:
      "text-align: center coloca el título en el medio de su fila; text-align: right lleva el párrafo a la derecha.",
    predict: {
      question: "Si añades text-align: center a la regla de h2, ¿qué se mueve?",
      options: [
        {
          label: "El texto, dentro de una caja que sigue ocupando todo el ancho",
          correct: true,
          why: "Un título ya ocupa toda la fila; text-align solo decide dónde va el texto dentro de ella.",
        },
        {
          label: "La caja del título se encoge y se va al centro",
          correct: false,
          why: "text-align no cambia el tamaño ni la posición de la caja, solo la de su contenido.",
        },
      ],
    },
    mdn: {
      label: "MDN: text-align",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/text-align",
    },
  },

  // -------------------------------------------------------------------------
  // css-02: classes and ids
  // -------------------------------------------------------------------------
  {
    id: "css-clase-id",
    worldId: "css-basics",
    kind: "selector",
    title: ".clase y #id",
    tagline: "Eligen elementos por el nombre que tú les pones en el HTML.",
    explain:
      "En el HTML puedes ponerle a un elemento el atributo class=\"fresco\" o id=\"pesca-del-dia\". En CSS, el punto elige una clase (.fresco) y la almohadilla elige un id (#pesca-del-dia). Una clase se puede repetir en muchos elementos; un id es único: solo un elemento por página.",
    use: [
      "Una clase para un grupo que comparte estilo: todas las ofertas, todas las tarjetas.",
      "Un id para algo que solo existe una vez en la página.",
      "Para dar estilo, prefiere clases: se reutilizan y son más fáciles de cambiar después.",
    ],
    avoid: [
      "Confundir los símbolos: si el HTML dice class=\"fresco\", el selector es .fresco, no #fresco.",
      "Repetir el mismo id en dos elementos: un id es como un DNI, uno por persona.",
      "Poner el punto en el HTML: se escribe class=\"fresco\", no class=\".fresco\".",
    ],
    example: {
      html: `<h2>Puesto de Anzuelo</h2>
<ul>
  <li class="fresco">Sardinas</li>
  <li>Anzuelos</li>
  <li class="fresco">Calamares</li>
  <li id="pesca-del-dia">Atún gigante</li>
</ul>
`,
      css: `.fresco {
  color: darkgreen;
}

#pesca-del-dia {
  color: crimson;
}
`,
    },
    exampleNote:
      ".fresco pinta los dos elementos con esa clase; #pesca-del-dia elige solo el que tiene ese id.",
    predict: {
      question: "Si añades class=\"fresco\" al elemento de Anzuelos, ¿qué pasa?",
      options: [
        {
          label: "Anzuelos también se pone verde, sin tocar el CSS",
          correct: true,
          why: "La regla .fresco se aplica a cualquier elemento que lleve esa clase, estén donde estén.",
        },
        {
          label: "Aparece un error: una clase no se puede repetir",
          correct: false,
          why: "Eso le pasa al id. Las clases están pensadas justamente para repetirse.",
        },
        {
          label: "No cambia: la regla ya pintó dos elementos",
          correct: false,
          why: "Una regla no tiene límite: pinta a todos los que encajan con el selector.",
        },
      ],
    },
    mdn: {
      label: "MDN: Selectores de clase",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/Class_selectors",
    },
  },
  {
    id: "css-font-weight",
    worldId: "css-basics",
    kind: "property",
    title: "font-weight",
    tagline: "Hace la letra más gruesa o más fina.",
    explain:
      "font-weight controla el grosor de las letras. bold (o 700) es negrita y normal (o 400) es el grosor habitual. Los títulos ya vienen en negrita; en un texto normal, bold lo hace destacar.",
    use: [
      "Resaltar un precio, un nombre o una palabra clave solo por estilo.",
      "Quitar la negrita de un título con font-weight: normal si el diseño lo pide.",
    ],
    avoid: [
      "Usarla para marcar algo importante para el significado: para eso está <strong> en el HTML; font-weight solo cambia el aspecto.",
      "Poner todo en negrita: si todo destaca, nada destaca.",
    ],
    example: {
      html: `<p>Pan de coco: <span class="precio">2 monedas</span></p>
<p>Pan de algas: 3 monedas</p>
`,
      css: `.precio {
  font-weight: bold;
}
`,
    },
    exampleNote: "font-weight: bold engrosa solo el texto con la clase precio.",
    predict: {
      question: "Si borras class=\"precio\" del HTML, ¿cómo se ve «2 monedas»?",
      options: [
        {
          label: "Con el grosor normal, como el resto del párrafo",
          correct: true,
          why: "La regla sigue en el CSS, pero ya no hay ningún elemento con esa clase al que aplicarse.",
        },
        {
          label: "Sigue en negrita, porque la regla .precio existe",
          correct: false,
          why: "Una regla solo actúa sobre los elementos que encajan con su selector. Sin la clase, no encaja.",
        },
      ],
    },
    mdn: {
      label: "MDN: font-weight",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/font-weight",
    },
  },

  // -------------------------------------------------------------------------
  // css-03: backgrounds, borders and corners
  // -------------------------------------------------------------------------
  {
    id: "css-background-color",
    worldId: "css-basics",
    kind: "property",
    title: "background-color",
    tagline: "Pinta el fondo de la caja de un elemento.",
    explain:
      "Cada elemento es una caja rectangular, aunque no la veas. background-color rellena esa caja de color, por detrás del texto. Cuando cambias el fondo, revisa también color: CSS no cambia el color del texto por ti.",
    use: [
      "Dar fondo a un cartel, un botón o una tarjeta para separarlos del resto.",
      "Marcar una zona de la página, como un aviso.",
    ],
    avoid: [
      "Cambiar el fondo y olvidar el texto: letras oscuras sobre morado apenas se leen (pide al menos 4.5:1 de contraste).",
      "Confundirlo con color: color pinta las letras; background-color, el fondo.",
    ],
    example: {
      html: `<p class="aviso">Hoy hay fiesta en la playa</p>
<p>Trae tu toalla.</p>
`,
      css: `.aviso {
  padding: 12px;
  background-color: navy;
  color: white;
}
`,
    },
    exampleNote:
      "background-color: navy pinta la caja entera del párrafo, de lado a lado; color: white mantiene el texto legible.",
    predict: {
      question: "Si borras color: white, ¿qué pasa con el aviso?",
      options: [
        {
          label: "El texto vuelve a ser oscuro y casi no se lee sobre navy",
          correct: true,
          why: "El color del texto no cambia solo al cambiar el fondo: vuelve al de siempre, que es oscuro.",
        },
        {
          label: "El texto se pone blanco igualmente, porque el fondo es oscuro",
          correct: false,
          why: "CSS no adivina contrastes. Si quieres texto claro, tienes que pedirlo con color.",
        },
      ],
    },
    mdn: {
      label: "MDN: background-color",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/background-color",
    },
  },
  {
    id: "css-border",
    worldId: "css-basics",
    kind: "property",
    title: "border",
    tagline: "Dibuja un contorno alrededor de la caja.",
    explain:
      "border es un atajo que lleva tres valores separados por espacios: grosor, estilo y color, por ejemplo 4px solid gold. El estilo dice cómo es la línea: solid (continua), dashed (rayas) o dotted (puntos). Sin estilo no hay borde, porque el estilo por defecto es none (ninguno).",
    use: [
      "Enmarcar un cartel, una tarjeta o una foto.",
      "Separar zonas con una línea, por ejemplo border-bottom bajo un título.",
    ],
    avoid: [
      "Olvidar el estilo: border: 4px gold; no dibuja nada.",
      "Separar los valores con comas: border: 4px, solid, gold; es inválido; van con espacios.",
    ],
    example: {
      html: `<p class="cartel">Entrada libre</p>
`,
      css: `.cartel {
  padding: 12px;
  border: 4px dashed darkorange;
}
`,
    },
    exampleNote: "4px es el grosor, dashed el estilo (rayas) y darkorange el color.",
    predict: {
      question: "Si cambias dashed por solid, ¿qué cambia?",
      options: [
        {
          label: "La línea pasa de rayas a continua",
          correct: true,
          why: "El segundo valor es el estilo de la línea. Grosor y color se quedan igual.",
        },
        {
          label: "El borde se hace más grueso",
          correct: false,
          why: "El grosor es el primer valor (4px) y no lo has tocado.",
        },
        {
          label: "El borde desaparece",
          correct: false,
          why: "Desaparecería con none o sin estilo. solid es un estilo válido: una línea continua.",
        },
      ],
    },
    mdn: {
      label: "MDN: border",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/border",
    },
  },
  {
    id: "css-border-radius",
    worldId: "css-basics",
    kind: "property",
    title: "border-radius",
    tagline: "Redondea las esquinas de la caja.",
    explain:
      "border-radius recibe un tamaño: cuanto mayor, más redonda la esquina. 8px suaviza, 16px redondea bastante, y 50% convierte una caja cuadrada en un círculo. Redondea a la vez el fondo y el borde.",
    use: [
      "Suavizar botones, tarjetas y carteles.",
      "Hacer fotos de perfil redondas con border-radius: 50% en una imagen cuadrada.",
    ],
    avoid: [
      "Esperar un círculo de una caja rectangular: con 50%, una caja ancha se vuelve un óvalo.",
      "Ponerlo en un elemento sin fondo ni borde: redondea igual, pero no se nota.",
    ],
    example: {
      html: `<p class="boton">Pedir canción a DJ Marea</p>
`,
      css: `.boton {
  padding: 12px;
  background-color: teal;
  color: white;
  text-align: center;
  border-radius: 16px;
}
`,
    },
    exampleNote: "border-radius: 16px redondea las cuatro esquinas del fondo teal.",
    predict: {
      question: "Tienes una imagen cuadrada de 100px. ¿Qué valor la vuelve un círculo?",
      options: [
        {
          label: "border-radius: 50%",
          correct: true,
          why: "Cada esquina se redondea la mitad del lado, y las curvas se juntan formando un círculo.",
        },
        {
          label: "border-radius: 10%",
          correct: false,
          why: "Solo suaviza un poco las esquinas: sigue pareciendo un cuadrado.",
        },
        {
          label: "border-radius: 5px",
          correct: false,
          why: "5px apenas redondea las puntas de un cuadrado de 100px.",
        },
      ],
    },
    mdn: {
      label: "MDN: border-radius",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/border-radius",
    },
  },

  // -------------------------------------------------------------------------
  // css-04: typography
  // -------------------------------------------------------------------------
  {
    id: "css-font-family",
    worldId: "css-basics",
    kind: "property",
    title: "font-family",
    tagline: "Elige la fuente (la tipografía) del texto.",
    explain:
      "font-family recibe una lista de fuentes separadas por comas, de la preferida a la de respaldo. El navegador usa la primera que tenga instalada. Al final va siempre una familia genérica, como serif (letras con remates) o sans-serif (sin remates), que existe en todos los dispositivos.",
    use: [
      "Dar personalidad a un título o a todo un texto.",
      "Una fuente serif para un cuento largo, una sans-serif para botones y menús.",
      "Si el nombre lleva espacios, escríbelo entre comillas: \"Courier New\".",
    ],
    avoid: [
      "Poner una sola fuente sin respaldo: si no está instalada, el navegador usa la suya por defecto.",
      "Poner comillas a la genérica: \"serif\" entre comillas se busca como una fuente llamada así y deja de ser el respaldo.",
    ],
    example: {
      html: `<p class="bitacora">Bitácora del faro: noche tranquila, mar en calma, tres barcos a la vista.</p>
`,
      css: `.bitacora {
  font-family: "Courier New", monospace;
}
`,
    },
    exampleNote:
      "\"Courier New\" es la preferida; monospace, la genérica de respaldo si no está instalada.",
    predict: {
      question: "Si el dispositivo no tiene Courier New, ¿qué fuente se usa?",
      options: [
        {
          label: "Una fuente monoespaciada cualquiera, la genérica monospace",
          correct: true,
          why: "El navegador recorre la lista de izquierda a derecha y usa la primera que tiene. La genérica siempre existe.",
        },
        {
          label: "Ninguna: el texto no se ve",
          correct: false,
          why: "El texto siempre se muestra; como mucho, con otra fuente.",
        },
        {
          label: "Courier New igualmente: el navegador la descarga",
          correct: false,
          why: "font-family no descarga nada; solo elige entre las fuentes que ya hay en el dispositivo.",
        },
      ],
    },
    mdn: {
      label: "MDN: font-family",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/font-family",
    },
  },
  {
    id: "css-font-size-rem",
    worldId: "css-basics",
    kind: "property",
    title: "font-size y rem",
    tagline: "Cambia el tamaño de la letra; en rem, respeta a quien lee.",
    explain:
      "font-size fija el tamaño de la letra. 1rem es el tamaño base que cada persona tiene en su navegador (16px si nunca lo tocó), así que 1.25rem son 20px. Si alguien con baja visión sube su tamaño base, todo lo que mediste en rem crece con él; lo que mediste en px se queda igual.",
    use: [
      "Mide el texto en rem para que crezca con los ajustes de cada persona.",
      "Unos 1rem para texto normal, 1.25rem para lecturas largas, de 1.5rem a 2rem para títulos.",
    ],
    avoid: [
      "Fijar el texto en px: ignora a quien agrandó la letra del navegador.",
      "Bajar de 1rem en textos largos: 12px se lee con lupa.",
    ],
    example: {
      html: `<p class="chica">Con 0.75rem hay que entornar los ojos.</p>
<p class="comoda">Con 1.25rem se lee sin esfuerzo.</p>
`,
      css: `.chica {
  font-size: 0.75rem;
}

.comoda {
  font-size: 1.25rem;
}
`,
    },
    exampleNote: "Con el tamaño base de 16px, 0.75rem son 12px y 1.25rem son 20px.",
    predict: {
      question: "Una persona sube el tamaño base de su navegador a 20px. ¿Cuánto mide ahora el texto .comoda?",
      options: [
        {
          label: "25px",
          correct: true,
          why: "1.25rem es 1.25 veces el tamaño base: 1.25 por 20 da 25px. Creció con su ajuste.",
        },
        {
          label: "20px, igual que antes",
          correct: false,
          why: "Eso pasaría con font-size: 20px. En rem, el tamaño sigue a la base de cada persona.",
        },
      ],
    },
    mdn: {
      label: "MDN: font-size",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/font-size",
    },
  },
  {
    id: "css-line-height",
    worldId: "css-basics",
    kind: "property",
    title: "line-height",
    tagline: "Controla el espacio entre las líneas de un texto.",
    explain:
      "line-height marca la altura de cada línea. Escrito como número sin unidad (1.6), multiplica el tamaño de la letra: con letra de 20px, cada línea mide 32px. Las líneas apretadas cansan la vista; entre 1.4 y 1.8 el texto respira.",
    use: [
      "Párrafos largos: 1.5 o 1.6 hace la lectura más cómoda.",
      "Títulos de varias líneas: algo menos, como 1.2, para que no se separen de más.",
    ],
    avoid: [
      "line-height: 1 en párrafos: las líneas casi se tocan.",
      "Darle unidad (24px): si luego agrandas la letra, el interlineado no crece con ella y las líneas se pisan.",
    ],
    example: {
      html: `<p class="apretado">Cada noche Lumi sube los escalones del faro, limpia el cristal y enciende la luz para los barcos.</p>
<p class="aireado">Cada noche Lumi sube los escalones del faro, limpia el cristal y enciende la luz para los barcos.</p>
`,
      css: `.apretado {
  line-height: 1;
}

.aireado {
  line-height: 1.6;
}
`,
    },
    exampleNote: "El mismo texto: con line-height 1.6 las líneas se separan y se leen mejor.",
    predict: {
      question: "Con font-size de 20px y line-height: 1.5, ¿cuánto mide cada línea?",
      options: [
        {
          label: "30px",
          correct: true,
          why: "Un número sin unidad multiplica el tamaño de la letra: 20 por 1.5 da 30px.",
        },
        {
          label: "21.5px",
          correct: false,
          why: "No se suma al tamaño de la letra: lo multiplica.",
        },
        {
          label: "1.5px",
          correct: false,
          why: "Sin unidad no son píxeles, sino veces el tamaño de la letra.",
        },
      ],
    },
    mdn: {
      label: "MDN: line-height",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/line-height",
    },
  },

  // -------------------------------------------------------------------------
  // css-05: the box model
  // -------------------------------------------------------------------------
  {
    id: "css-modelo-caja",
    worldId: "css-basics",
    kind: "concept",
    title: "Modelo de caja",
    tagline: "Toda caja tiene contenido, padding, border y margin, de dentro hacia fuera.",
    explain:
      "Cada elemento es una caja de cuatro capas. En el centro está el contenido (el texto). Alrededor, padding: el relleno interior, que comparte el fondo de la caja. Luego el border. Y por fuera, margin: un espacio transparente que la separa de sus vecinas.",
    use: [
      "padding para que el texto no toque el borde: aire por dentro.",
      "margin para separar una caja de otra: aire por fuera.",
      "padding: 20px vale para los cuatro lados; margin: 0 0 24px da 0 arriba, 0 a los lados y 24px abajo.",
    ],
    avoid: [
      "Usar margin para apartar el texto del borde: el margin está fuera del borde y no lleva fondo.",
      "Usar padding para separar dos cajas: la caja crece en vez de alejarse de la otra.",
    ],
    example: {
      html: `<p class="tabla">Se venden sillas</p>
<p class="tabla">Y mesas a juego</p>
`,
      css: `.tabla {
  padding: 20px;
  border: 4px solid sienna;
  margin: 24px 0;
  background-color: wheat;
}
`,
    },
    exampleNote:
      "El fondo wheat cubre contenido y padding; el margin de 24px queda fuera del borde, transparente.",
    predict: {
      question: "Si cambias padding a 40px, ¿qué crece?",
      options: [
        {
          label: "El espacio entre el texto y el borde: cada tabla se hace más grande",
          correct: true,
          why: "padding está dentro del borde, así que más padding agranda la caja pintada.",
        },
        {
          label: "La distancia entre las dos tablas",
          correct: false,
          why: "Eso lo controla margin, que está por fuera del borde.",
        },
        {
          label: "El tamaño de la letra",
          correct: false,
          why: "padding es espacio alrededor del contenido; la letra no cambia.",
        },
      ],
    },
    mdn: {
      label: "MDN: El modelo de caja",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Box_model",
    },
  },
  {
    id: "css-box-sizing",
    worldId: "css-basics",
    kind: "property",
    title: "box-sizing",
    tagline: "Decide si width incluye el padding y el borde.",
    explain:
      "Por defecto (content-box), width mide solo el contenido, y el padding y el borde se suman por fuera: width: 300px con 20px de padding y 4px de borde ocupa 348px. Con box-sizing: border-box, width mide la caja entera, borde incluido, y el contenido se encoge para que todo quepa.",
    use: [
      "Cuando una caja debe medir justo lo que dices: botones, tarjetas, columnas.",
      "Muchos proyectos se lo ponen a todas las cajas desde el principio para no tener que sumar.",
    ],
    avoid: [
      "Sumar de cabeza padding y borde para cuadrar el ancho: con border-box no hace falta.",
      "Pensar que border-box quita el padding: sigue ahí, solo que dentro del ancho.",
    ],
    example: {
      html: `<div>content-box: mido 248px</div>
<div class="exacta">border-box: mido 200px</div>
`,
      css: `div {
  width: 200px;
  padding: 20px;
  border: 4px solid sienna;
  margin-bottom: 12px;
  background-color: wheat;
}

.exacta {
  box-sizing: border-box;
}
`,
    },
    exampleNote:
      "Las dos dicen width: 200px, pero solo la de box-sizing: border-box mide 200px con borde y todo.",
    predict: {
      question: "En la caja .exacta (200px de ancho, 20px de padding, 4px de borde), ¿cuánto ancho le queda al texto?",
      options: [
        {
          label: "152px",
          correct: true,
          why: "Con border-box, padding y borde salen de los 200px: 200 menos 40 menos 8 da 152px.",
        },
        {
          label: "200px",
          correct: false,
          why: "Eso sería con content-box: el contenido mide 200px y lo demás se suma por fuera.",
        },
        {
          label: "248px",
          correct: false,
          why: "248px es lo que ocupa la otra caja entera, la de content-box.",
        },
      ],
    },
    mdn: {
      label: "MDN: box-sizing",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/box-sizing",
    },
  },
  {
    id: "css-fusion-margenes",
    worldId: "css-basics",
    kind: "concept",
    title: "Fusión de márgenes",
    tagline: "Dos márgenes verticales que se tocan se funden en uno.",
    explain:
      "Cuando una caja con margen abajo queda justo encima de otra con margen arriba, los dos márgenes no se suman: se funden y gana el mayor. 24px y 24px dejan 24px de separación, no 48px. Solo pasa en vertical, entre cajas apiladas una encima de otra.",
    use: [
      "Para separar cajas apiladas, ponles margen solo por un lado (por ejemplo, abajo): es más fácil de prever.",
      "Si ves menos espacio del esperado entre dos cajas, sospecha de la fusión.",
    ],
    avoid: [
      "Poner 12px arriba y 12px abajo esperando 24px entre cajas: obtendrás 12px.",
      "Esperar que pase en horizontal: los márgenes izquierdo y derecho siempre se suman.",
    ],
    example: {
      html: `<p class="nota">Primera nota de pedido</p>
<p class="nota">Segunda nota de pedido</p>
`,
      css: `.nota {
  margin: 30px 0;
  padding: 8px;
  background-color: wheat;
}
`,
    },
    exampleNote:
      "Cada nota tiene 30px de margin arriba y abajo, pero entre ellas solo hay 30px: los márgenes se fundieron.",
    predict: {
      question: "Si la primera caja tiene margin-bottom: 40px y la segunda margin-top: 10px, ¿cuánto espacio queda entre ellas?",
      options: [
        {
          label: "40px",
          correct: true,
          why: "Los márgenes verticales vecinos se funden y gana el mayor.",
        },
        {
          label: "50px",
          correct: false,
          why: "Así sería si se sumaran, pero en vertical no se suman.",
        },
        {
          label: "10px",
          correct: false,
          why: "Gana el mayor, no el menor.",
        },
      ],
    },
    mdn: {
      label: "MDN: Fusión de márgenes",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Box_model/Margin_collapsing",
    },
  },

  // -------------------------------------------------------------------------
  // css-06: cascade and specificity
  // -------------------------------------------------------------------------
  {
    id: "css-cascada",
    worldId: "css-basics",
    kind: "concept",
    title: "Cascada",
    tagline: "Cuando dos reglas chocan, CSS sigue un orden para decidir cuál gana.",
    explain:
      "Si dos reglas dan valores distintos a la misma propiedad del mismo elemento, solo una puede ganar. Primero se compara la especificidad de los selectores (la siguiente ficha); si empatan, gana la que aparece más abajo en el CSS. Las declaraciones que no chocan se combinan sin problema.",
    use: [
      "Escribe primero los estilos generales y después los casos especiales.",
      "Si dos selectores pesan lo mismo, basta con escribir la regla nueva después de la original.",
    ],
    avoid: [
      "Repetir el mismo selector por todo el archivo: cuesta saber cuál manda.",
      "Creer que la regla de abajo gana siempre: un selector más específico gana aunque esté arriba.",
    ],
    example: {
      html: `<p>Pan recién horneado</p>
`,
      css: `p {
  color: navy;
  font-weight: bold;
}

p {
  color: sienna;
}
`,
    },
    exampleNote:
      "Las dos reglas dan color: gana sienna porque va después. font-weight no choca con nada y se mantiene.",
    predict: {
      question: "Si intercambias el orden de las dos reglas, ¿cómo queda el texto?",
      options: [
        {
          label: "Navy y en negrita",
          correct: true,
          why: "Ahora color: navy va después y gana. La negrita no compite con nada, así que sigue.",
        },
        {
          label: "Sienna y en negrita",
          correct: false,
          why: "Con el mismo selector, gana la regla que está más abajo, que ahora es la de navy.",
        },
        {
          label: "Navy y sin negrita",
          correct: false,
          why: "Solo se pisan las propiedades repetidas. font-weight solo aparece una vez, así que se aplica.",
        },
      ],
    },
    mdn: {
      label: "MDN: Cascada, especificidad y herencia",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts",
    },
  },
  {
    id: "css-especificidad",
    worldId: "css-basics",
    kind: "concept",
    title: "Especificidad",
    tagline: "Cuanto más concreto es un selector, más pesa.",
    explain:
      "Cada selector tiene un peso: una etiqueta (a) pesa poco, una clase (.especial) pesa más y un id (#menu) muchísimo; un solo id vence a cualquier cantidad de clases. Un espacio entre selectores significa «dentro de»: #menu a elige los <a> que están dentro de #menu, y su peso es la suma de un id y una etiqueta.",
    use: [
      "Cuando una regla no se aplica, compara el peso de los selectores que chocan.",
      "Para ganarle a una regla, usa un selector un poco más concreto, no uno enorme.",
      "Da estilo sobre todo con clases: así es fácil prever quién gana.",
    ],
    avoid: [
      "Llenar el CSS de ids para ganar: después nada puede cambiarlos sin otro id.",
      "Pensar que cinco clases ganan a un id: el id siempre pesa más.",
    ],
    example: {
      html: `<nav id="menu">
  <a href="#">Pan</a>
  <a class="especial" href="#">Tarta</a>
</nav>
`,
      css: `#menu a {
  color: navy;
}

/* Pierde: una clase pesa menos que id + etiqueta */
.especial {
  color: crimson;
}
`,
    },
    exampleNote:
      "Tarta sigue navy: #menu a (un id y una etiqueta) pesa más que .especial (una clase), aunque esta vaya después.",
    predict: {
      question: "¿Qué selector pintaría la Tarta de crimson sin tocar la regla #menu a?",
      options: [
        {
          label: "#menu .especial",
          correct: true,
          why: "Un id y una clase pesan más que un id y una etiqueta, así que gana.",
        },
        {
          label: "nav .especial",
          correct: false,
          why: "Una etiqueta y una clase no tienen id, y cualquier selector con id les gana.",
        },
        {
          label: "a",
          correct: false,
          why: "Una sola etiqueta es lo que menos pesa. Además, pintaría todos los enlaces.",
        },
      ],
    },
    mdn: {
      label: "MDN: Especificidad",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Cascade/Specificity",
    },
  },
  {
    id: "css-important",
    worldId: "css-basics",
    kind: "concept",
    title: "!important",
    tagline: "Obliga a una declaración a ganar siempre. Casi nunca es buena idea.",
    explain:
      "Escribir !important al final de una declaración (color: crimson !important;) la hace ganar por encima de la especificidad y del orden. Funciona, pero rompe la cascada: para cambiar ese valor más adelante necesitarás otro !important, y así cada vez.",
    use: [
      "En tu propio CSS, casi nunca: primero sube la especificidad del selector o cambia el orden.",
      "Se reserva para casos raros, como pisar código ajeno que no puedes editar.",
    ],
    avoid: [
      "Usarlo como primer remedio cuando una regla no se aplica: esconde el problema en vez de entenderlo.",
      "Encadenar !important para ganarle a otro !important.",
    ],
    example: {
      html: `<div id="horno">
  <p class="aviso">Horno caliente</p>
</div>
`,
      css: `#horno p {
  color: navy;
}

.aviso {
  color: crimson !important;
}
`,
    },
    exampleNote:
      ".aviso pesa menos que #horno p, pero !important la hace ganar a la fuerza.",
    predict: {
      question: "Mañana quieres el aviso en verde y añades #horno .aviso { color: green; }. ¿Funciona?",
      options: [
        {
          label: "No: sigue crimson, porque !important gana a cualquier regla sin él",
          correct: true,
          why: "Ahí está la trampa: ahora tu cambio también necesitaría !important.",
        },
        {
          label: "Sí, porque #horno .aviso es más específico",
          correct: false,
          why: "Lo sería sin !important. Con él, la especificidad deja de importar.",
        },
      ],
    },
    mdn: {
      label: "MDN: !important (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/important",
    },
  },

  // -------------------------------------------------------------------------
  // css-07: pseudo-classes
  // -------------------------------------------------------------------------
  {
    id: "css-hover",
    worldId: "css-basics",
    kind: "selector",
    title: ":hover",
    tagline: "Aplica estilos mientras el puntero del ratón está encima.",
    explain:
      "Una pseudoclase describe un estado del elemento y se pega al selector con dos puntos, sin espacio: .boton:hover. Sus estilos solo se aplican mientras el ratón pasa por encima; al salir, todo vuelve a como estaba.",
    use: [
      "Dar respuesta visual a botones y enlaces: cambiar el fondo o el subrayado.",
      "Confirmar que algo se puede pulsar antes de hacer clic.",
    ],
    avoid: [
      "Esconder información importante solo en :hover: en un móvil no hay ratón y no se ve.",
      "Dejar un espacio: .boton :hover busca elementos dentro del botón y no funciona como esperas.",
    ],
    example: {
      html: `<button class="boton" type="button">Pedir helado</button>
`,
      css: `.boton {
  padding: 12px 20px;
  border: 3px solid #1B1F3B;
  border-radius: 999px;
  background-color: lightpink;
}

.boton:hover {
  background-color: hotpink;
}
`,
    },
    exampleNote: "Pasa el ratón por el botón: .boton:hover cambia el fondo solo mientras estás encima.",
    predict: {
      question: "Si escribes .boton :hover (con un espacio), ¿qué pasa al pasar el ratón por el botón?",
      options: [
        {
          label: "Nada: el espacio busca elementos dentro del botón",
          correct: true,
          why: "Un espacio significa «dentro de». La pseudoclase va pegada: .boton:hover.",
        },
        {
          label: "Lo mismo que sin espacio",
          correct: false,
          why: "En CSS los espacios importan: separan un elemento de lo que hay dentro de él.",
        },
      ],
    },
    mdn: {
      label: "MDN: :hover",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:hover",
    },
  },
  {
    id: "css-focus-visible",
    worldId: "css-basics",
    kind: "selector",
    title: ":focus-visible",
    tagline: "Muestra dónde está el foco cuando alguien navega con el teclado.",
    explain:
      "Mucha gente no usa ratón: recorre la página con la tecla Tab. El elemento que recibe el foco necesita una marca visible, normalmente un contorno hecho con outline. :focus-visible aplica estilos cuando el foco llega desde el teclado, sin molestar a quien hace clic.",
    use: [
      "En todos los botones y enlaces a los que cambies el estilo.",
      "outline: 3px solid con un color que contraste al menos 3:1 con el fondo.",
      "outline-offset separa el contorno del borde para que se vea mejor.",
    ],
    avoid: [
      "Poner outline: none sin dar otro indicador: quien usa teclado se pierde.",
      "Un contorno pálido o de 1px: si no contrasta, es como no tenerlo.",
    ],
    example: {
      html: `<button class="sabor" type="button">Fresa</button>
<button class="sabor" type="button">Mango</button>
`,
      css: `.sabor {
  padding: 12px 20px;
  border: 3px solid #1B1F3B;
  border-radius: 999px;
  background-color: lightpink;
}

.sabor:focus-visible {
  outline: 3px solid navy;
  outline-offset: 3px;
}
`,
    },
    exampleNote:
      "Haz clic en la vista y pulsa Tab: el botón enfocado muestra un contorno navy de 3px.",
    predict: {
      question: "Alguien pone outline: none en .sabor y borra la regla :focus-visible. ¿Qué le pasa a quien usa Tab?",
      options: [
        {
          label: "No ve qué botón tiene el foco",
          correct: true,
          why: "El foco sigue moviéndose, pero sin contorno nada indica dónde está.",
        },
        {
          label: "Nada: el navegador lo arregla solo",
          correct: false,
          why: "outline: none quita justamente el contorno que pone el navegador.",
        },
        {
          label: "Los botones dejan de funcionar con el teclado",
          correct: false,
          why: "Siguen funcionando con Enter, pero a ciegas: no sabe cuál va a pulsar.",
        },
      ],
    },
    mdn: {
      label: "MDN: :focus-visible",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:focus-visible",
    },
  },

  // -------------------------------------------------------------------------
  // css-08: units and overflow
  // -------------------------------------------------------------------------
  {
    id: "css-unidades",
    worldId: "css-basics",
    kind: "concept",
    title: "px, rem, ch y %",
    tagline: "Formas de medir: unas fijas y otras relativas a algo.",
    explain:
      "px es una medida fija. rem depende del tamaño de letra base del navegador (1rem son 16px por defecto). ch es el ancho del carácter «0» de la fuente actual, ideal para medir líneas de texto. % depende del contenedor: width: 50% ocupa la mitad del ancho de su padre.",
    use: [
      "px para detalles que no deben cambiar, como bordes de 2px o 3px.",
      "rem para letras y espacios que deben crecer con el texto.",
      "ch para el ancho de un texto; % para que una caja se adapte a su contenedor.",
    ],
    avoid: [
      "Medir todo en px: la página no se adapta a quien agranda la letra ni a pantallas pequeñas.",
      "Pensar que % depende de la pantalla: depende de la caja que lo contiene.",
    ],
    example: {
      html: `<div class="fija">width: 120px</div>
<div class="mitad">width: 50%</div>
<div class="letras">width: 30ch</div>
`,
      css: `div {
  margin-bottom: 8px;
  padding: 4px 8px;
  border: 2px solid sienna;
  background-color: wheat;
}

.fija {
  width: 120px;
}

.mitad {
  width: 50%;
}

.letras {
  width: 30ch;
}
`,
    },
    exampleNote:
      "Estrecha la vista: la caja de 50% se encoge con su contenedor; la de 120px no cambia.",
    predict: {
      question: "Si la persona agranda la letra de su navegador, ¿qué caja se ensancha?",
      options: [
        {
          label: "La de 30ch",
          correct: true,
          why: "ch mide en caracteres; si la letra crece, cada carácter es más ancho y la caja también.",
        },
        {
          label: "La de 120px",
          correct: false,
          why: "px es fijo: mide lo mismo con letra grande o pequeña.",
        },
        {
          label: "La de 50%",
          correct: false,
          why: "% depende del ancho del contenedor, no del tamaño de la letra.",
        },
      ],
    },
    mdn: {
      label: "MDN: Valores y unidades CSS",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Values_and_units",
    },
  },
  {
    id: "css-max-width",
    worldId: "css-basics",
    kind: "property",
    title: "max-width",
    tagline: "Pone un tope al ancho de una caja sin impedir que se encoja.",
    explain:
      "width fija un ancho exacto: si la pantalla es más estrecha, la caja se sale y aparece scroll horizontal. max-width solo marca un máximo: la caja crece hasta ese límite y, en pantallas pequeñas, se encoge para caber. Con max-width: 60ch, las líneas no pasan de unos 60 caracteres, una medida cómoda de leer.",
    use: [
      "Textos largos: entre 45ch y 75ch las líneas se siguen sin esfuerzo.",
      "Tarjetas e imágenes: max-width: 100% impide que sean más anchas que su contenedor.",
    ],
    avoid: [
      "Darle un width grande (900px) a una caja de texto: en el móvil provoca scroll horizontal.",
      "Esperar que ensanche la caja: max-width solo la limita.",
    ],
    example: {
      html: `<p class="pergamino">Las mareas suben dos veces al día. Antes de salir a pescar, mira la tabla del muelle y vuelve antes de que oscurezca.</p>
`,
      css: `.pergamino {
  max-width: 30ch;
  padding: 12px;
  background-color: wheat;
}
`,
    },
    exampleNote:
      "max-width: 30ch corta las líneas a unos 30 caracteres; en una vista estrecha la caja se encoge.",
    predict: {
      question: "En una pantalla más estrecha que 30ch, ¿qué hace el pergamino?",
      options: [
        {
          label: "Se encoge al espacio disponible, sin scroll horizontal",
          correct: true,
          why: "max-width es solo un tope: por debajo de él, la caja se adapta.",
        },
        {
          label: "Mantiene sus 30ch y se sale de la pantalla",
          correct: false,
          why: "Eso pasaría con width: 30ch, que fija el ancho aunque no quepa.",
        },
      ],
    },
    mdn: {
      label: "MDN: max-width (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/max-width",
    },
  },
  {
    id: "css-overflow-wrap",
    worldId: "css-basics",
    kind: "property",
    title: "overflow-wrap",
    tagline: "Permite partir palabras larguísimas para que no se salgan de su caja.",
    explain:
      "El navegador solo corta las líneas en los espacios. Una palabra enorme sin espacios, como una dirección web, no cabe y desborda: sobresale de su caja. overflow-wrap: anywhere permite cortarla en cualquier punto para que encaje.",
    use: [
      "Direcciones web, correos o códigos largos dentro de cajas estrechas.",
      "Textos que escriben otras personas, que pueden traer palabras enormes.",
    ],
    avoid: [
      "Tapar el desborde con overflow: hidden: recorta lo que sobra y parte del texto deja de verse.",
      "Esperar que parta palabras normales: solo actúa cuando una palabra no cabe en la línea.",
    ],
    example: {
      html: `<p>faro.islaestilo.example/horariosDeLaLuzYDeLasMareas</p>
<p class="partida">faro.islaestilo.example/horariosDeLaLuzYDeLasMareas</p>
`,
      css: `p {
  width: 12rem;
  padding: 8px;
  border: 2px solid sienna;
}

.partida {
  overflow-wrap: anywhere;
}
`,
    },
    exampleNote:
      "La primera dirección se sale del borde; en la segunda, overflow-wrap: anywhere la parte en dos líneas.",
    predict: {
      question: "¿Y si a la primera caja le pones overflow: hidden en vez de overflow-wrap?",
      options: [
        {
          label: "El final de la dirección queda recortado y no se puede leer",
          correct: true,
          why: "overflow: hidden oculta lo que sobresale; no lo recoloca.",
        },
        {
          label: "La dirección se parte en varias líneas",
          correct: false,
          why: "Partir palabras es cosa de overflow-wrap. overflow solo decide qué hacer con lo que sobresale.",
        },
      ],
    },
    mdn: {
      label: "MDN: overflow-wrap (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap",
    },
  },
];
