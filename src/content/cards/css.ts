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
];
