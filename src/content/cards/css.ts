import { svgDataUri } from "@/content/css-basics/_helpers";
import type { ConceptCard } from "@/lib/levels/types";

/**
 * A 2:1 lighthouse at dusk, for the object-fit card: squeezing it into a
 * square without object-fit visibly deforms the tower. preserveAspectRatio="none"
 * makes the SVG stretch like a photo would, instead of letterboxing itself.
 */
const LIGHTHOUSE_SRC = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
  <rect width="200" height="100" fill="#FFB23F"/>
  <rect y="72" width="200" height="28" fill="#1E90FF"/>
  <circle cx="160" cy="28" r="12" fill="#FFF4D6"/>
  <path d="M88 72 L92 32 H108 L112 72 Z" fill="#FFFFFF" stroke="#1B1F3B" stroke-width="3"/>
  <path d="M90 56 H110 M91 44 H109" stroke="#FF5D73" stroke-width="5"/>
  <rect x="90" y="20" width="20" height="12" fill="#FFD66B" stroke="#1B1F3B" stroke-width="3"/>
  <path d="M86 20 L100 9 L114 20 Z" fill="#FF5D73" stroke="#1B1F3B" stroke-width="3"/>
</svg>`);

/** Concept cards for Isla Estilo (CSS fundamental), in teaching order. */
export const cssCards: ConceptCard[] = [
  {
    id: "css-que-es",
    worldId: "css-basics",
    kind: "concept",
    title: "CSS",
    tagline: "El idioma que decide cómo se ve cada parte de la página.",
    explain:
      "HTML dice qué es cada cosa; CSS dice cómo se ve. Suele ir en un archivo aparte y cambia el aspecto, nunca el contenido.",
    use: [
      "Para todo lo visual: colores, letras, espacios, bordes, columnas.",
      "HTML para el significado, CSS para el diseño.",
    ],
    avoid: [
      "Cambiar una etiqueta solo por cómo se ve (un <h3> por pequeño): eso es CSS.",
    ],
    example: {
      html: "<h1>Floristería Rosa</h1>\n<p>Ramos frescos cada día.</p>\n",
      css: "h1 {\n  color: #D63A52;\n}\np {\n  color: #4FA82F;\n}\n",
    },
    exampleNote:
      "El HTML no cambia; el CSS pinta el título de coral y el párrafo de verde.",
    predict: {
      question: "Si borras todo el CSS de este ejemplo, ¿qué le pasa al título?",
      options: [
        {
          label: "Sigue ahí, pero con el color por defecto",
          correct: true,
          why: "El contenido vive en el HTML. Sin CSS, el navegador lo muestra con su estilo básico.",
        },
        {
          label: "Desaparece de la página",
          correct: false,
          why: "CSS no crea ni borra contenido: solo cambia cómo se ve lo que ya está en el HTML.",
        },
      ],
    },
    mdn: {
      label: "MDN: ¿Qué es CSS?",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/What_is_CSS",
    },
  },
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
      "El selector elige a quién se aplica la regla: p elige todos los <p>. Entre llaves { } van las declaraciones propiedad: valor;",
    use: [
      "Una regla por cada grupo de elementos que quieras cambiar.",
      "Todas las declaraciones de esos elementos, en las mismas llaves.",
      "Punto y coma al final de cada declaración, incluso la última.",
    ],
    avoid: [
      "Escribir el selector con < >: es p { … }, no <p> { … }.",
      "Olvidar los dos puntos o el punto y coma: el navegador ignora la declaración.",
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
      "p es el selector, color la propiedad y darkmagenta el valor.",
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
          why: "p elige todos los párrafos. Para elegir uno solo hacen falta clases o ids.",
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
      "color pinta las letras, no el fondo. Acepta nombres en inglés (crimson, navy) o códigos como #B00020.",
    use: [
      "Destacar un título con el color de tu marca.",
      "Oscurecer un texto que se lee mal sobre su fondo.",
      "Junto a texto o un icono: el color solo no basta como señal.",
    ],
    avoid: [
      "Escribir colour, con u: CSS no la entiende y la ignora sin avisar.",
      "Un color claro sobre blanco: con contraste menor de 4.5:1, cuesta leerlo.",
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
          why: "colour no existe en CSS. El navegador ignora lo que no entiende, sin avisar.",
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
      "text-align coloca el texto dentro de su caja: left, center o right. La caja no se mueve; solo lo de dentro.",
    use: [
      "Centrar un título corto o el texto de un cartel.",
      "Alinear a la derecha una firma o una fecha.",
    ],
    avoid: [
      "Centrar párrafos largos: el ojo pierde dónde empieza cada línea.",
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
      "center lleva el título al medio de su fila; right lleva el párrafo a la derecha.",
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
      "En el HTML escribes class=\"fresco\"; en CSS la eliges con .fresco. Una clase se repite; un id (#pesca-del-dia) es único.",
    use: [
      "Clase para un grupo con el mismo estilo: todas las ofertas.",
      "Id para algo que existe una sola vez en la página.",
      "Para dar estilo, prefiere clases: se reutilizan.",
    ],
    avoid: [
      "Usar # para una clase: class=\"fresco\" se elige con .fresco.",
      "Repetir un id en dos elementos: es como un DNI, uno por persona.",
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
      ".fresco pinta los dos elementos con esa clase; #pesca-del-dia, solo uno.",
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
      "font-weight cambia el grosor de la letra. bold (700) es negrita y normal (400), el grosor habitual.",
    use: [
      "Resaltar un precio, un nombre o una palabra clave solo por estilo.",
      "Quitar la negrita de un título con font-weight: normal.",
    ],
    avoid: [
      "Marcar algo importante para el significado: eso es <strong> en el HTML.",
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
          why: "Una regla solo actúa sobre lo que encaja con su selector. Sin la clase, no encaja.",
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
      "Cada elemento es una caja; background-color la rellena de color por detrás del texto. El texto no cambia de color solo: revísalo.",
    use: [
      "Dar fondo a un cartel, un botón o una tarjeta para destacarlos.",
      "Marcar una zona de la página, como un aviso.",
    ],
    avoid: [
      "Cambiar el fondo y olvidar el texto: busca 4.5:1 de contraste.",
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
      "navy pinta la caja entera del párrafo; color: white mantiene el texto legible.",
    predict: {
      question: "Si borras color: white, ¿qué pasa con el aviso?",
      options: [
        {
          label: "El texto vuelve a ser oscuro y casi no se lee sobre navy",
          correct: true,
          why: "El texto no cambia solo al cambiar el fondo: sigue con su color oscuro.",
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
      "border lleva tres valores separados por espacios: grosor, estilo y color (4px solid gold). Sin estilo no hay borde.",
    use: [
      "Enmarcar un cartel, una tarjeta o una foto.",
      "Separar zonas con una línea, por ejemplo border-bottom bajo un título.",
      "Estilos: solid (continua), dashed (rayas) o dotted (puntos).",
    ],
    avoid: [
      "Olvidar el estilo: border: 4px gold; no dibuja nada.",
      "Separar con comas: border: 4px, solid, gold; no funciona.",
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
      "border-radius redondea las esquinas: cuanto mayor el valor, más curva. 50% vuelve círculo una caja cuadrada.",
    use: [
      "Suavizar botones, tarjetas y carteles.",
      "Fotos de perfil redondas: border-radius: 50% en una imagen cuadrada.",
    ],
    avoid: [
      "Esperar un círculo de una caja ancha: con 50% sale un óvalo.",
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
      "font-family recibe una lista separada por comas; el navegador usa la primera que tenga. Termina con una genérica, como serif o sans-serif.",
    use: [
      "Dar personalidad a un título o a todo un texto.",
      "serif (con remates) en cuentos; sans-serif (sin remates) en menús.",
      "Si el nombre lleva espacios, escríbelo entre comillas: \"Courier New\".",
    ],
    avoid: [
      "Poner una sola fuente: si no está instalada, sale la de por defecto.",
      "Poner comillas a la genérica: \"serif\" ya no sirve de respaldo.",
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
          why: "El navegador usa la primera de la lista que tenga. La genérica siempre existe.",
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
      "font-size fija el tamaño de la letra. 1rem es el tamaño base del navegador de cada persona: 16px si nunca lo cambió.",
    use: [
      "Mide el texto en rem para que crezca con los ajustes de cada persona.",
      "1rem texto, 1.25rem lecturas largas, de 1.5rem a 2rem títulos.",
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
      question: "Alguien sube la base de su navegador a 20px. ¿Cuánto mide ahora .comoda?",
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
      "line-height marca la altura de cada línea. Un número sin unidad (1.6) multiplica el tamaño de la letra.",
    use: [
      "Párrafos: entre 1.4 y 1.8, como 1.6, se leen cómodos.",
      "Títulos de varias líneas: algo menos, como 1.2.",
    ],
    avoid: [
      "line-height: 1 en párrafos: las líneas casi se tocan.",
      "Darle unidad (24px): no crece si luego agrandas la letra.",
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
    tagline: "Contenido, padding, border y margin, de dentro afuera.",
    explain:
      "Cada caja tiene capas: contenido, padding (relleno con fondo), border y margin (espacio transparente por fuera).",
    use: [
      "padding para que el texto no toque el borde: aire por dentro.",
      "margin para separar una caja de otra: aire por fuera.",
      "padding: 20px, a los cuatro lados; margin: 0 0 24px, solo abajo.",
    ],
    avoid: [
      "Usar margin para apartar el texto del borde: va fuera y sin fondo.",
      "Usar padding para separar cajas: crece en vez de alejarse.",
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
      "El fondo wheat cubre contenido y padding; el margin queda fuera, transparente.",
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
      "Por defecto, width mide solo el contenido y el padding y el borde se suman. Con box-sizing: border-box, width mide la caja entera.",
    use: [
      "Cajas que deben medir justo lo que dices: botones, tarjetas.",
      "Muchos proyectos lo ponen en todas las cajas desde el inicio.",
    ],
    avoid: [
      "Sumar padding y borde de cabeza: con border-box no hace falta.",
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
      "Las dos dicen width: 200px; solo la de border-box mide 200px en total.",
    predict: {
      question: "En .exacta (200px, 20px de padding, 4px de borde), ¿cuánto ancho le queda al texto?",
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
      "Si una caja con margen abajo toca otra con margen arriba, los márgenes no se suman: gana el mayor. Solo pasa en vertical.",
    use: [
      "Separa cajas apiladas con margen por un solo lado, como abajo.",
      "¿Menos espacio del esperado entre cajas? Sospecha de la fusión.",
    ],
    avoid: [
      "Poner 12px arriba y 12px abajo esperando 24px entre cajas: obtendrás 12px.",
      "Esperarlo en horizontal: los márgenes de los lados sí se suman.",
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
      "Cada nota tiene 30px arriba y abajo, pero entre ellas solo hay 30px.",
    predict: {
      question: "Una caja tiene margin-bottom: 40px y la de abajo margin-top: 10px. ¿Cuánto las separa?",
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
    tagline: "Cuando dos reglas chocan, decide cuál gana.",
    explain:
      "Si dos reglas chocan en la misma propiedad, gana el selector más específico. Si empatan, gana la que va más abajo.",
    use: [
      "Escribe primero los estilos generales y después los casos especiales.",
      "Con selectores del mismo peso, escribe la regla nueva después.",
    ],
    avoid: [
      "Repetir el mismo selector por todo el archivo: cuesta saber cuál manda.",
      "Creer que la de abajo gana siempre: un selector más específico pesa más.",
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
      "Las dos dan color: gana sienna porque va después. font-weight no choca y se mantiene.",
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
          why: "Solo se pisan las propiedades repetidas. font-weight aparece una vez y se aplica.",
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
      "Una etiqueta (a) pesa poco, una clase (.especial) más y un id (#menu) muchísimo. Un espacio es «dentro de»: #menu a elige los <a> de #menu.",
    use: [
      "Si una regla no se aplica, compara el peso de los selectores.",
      "Para ganar, usa un selector un poco más concreto, no uno enorme.",
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
      "Tarta sigue navy: #menu a (id y etiqueta) pesa más que .especial, aunque vaya después.",
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
    tagline: "Obliga a una declaración a ganar. Casi nunca conviene.",
    explain:
      "!important al final de una declaración la hace ganar siempre. Pero rompe la cascada: para cambiarla luego necesitarás otro !important.",
    use: [
      "En tu CSS, casi nunca: antes sube la especificidad o cambia el orden.",
      "Casos raros, como pisar código ajeno que no puedes editar.",
    ],
    avoid: [
      "Usarlo como primer remedio: esconde el problema en vez de resolverlo.",
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
      "Una pseudoclase es un estado. :hover se activa con el ratón encima y va pegada al selector: .boton:hover.",
    use: [
      "Respuesta visual en botones y enlaces: otro fondo o subrayado.",
      "Confirmar que algo se puede pulsar antes de hacer clic.",
    ],
    avoid: [
      "Esconder información solo en :hover: en el móvil no hay ratón.",
      "Dejar un espacio: .boton :hover busca dentro del botón.",
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
    tagline: "Marca dónde está el foco al navegar con el teclado.",
    explain:
      "Mucha gente navega con la tecla Tab y necesita ver dónde está el foco. :focus-visible le da estilo, como un outline, al llegar con teclado.",
    use: [
      "En todos los botones y enlaces a los que cambies el estilo.",
      "outline: 3px solid, con contraste de al menos 3:1 con el fondo.",
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
      question: "Si pones outline: none en .sabor y borras :focus-visible, ¿qué le pasa a quien usa Tab?",
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
      "px es fijo. rem sigue la letra base (16px por defecto), ch mide caracteres y % depende del ancho del contenedor.",
    use: [
      "px para detalles que no deben cambiar, como bordes de 2px o 3px.",
      "rem para letras y espacios que deben crecer con el texto.",
      "ch para anchos de texto; % para adaptarse al contenedor.",
    ],
    avoid: [
      "Medir todo en px: no se adapta a letra grande ni a pantallas pequeñas.",
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
      "width fija el ancho aunque no quepa, y aparece scroll horizontal. max-width solo pone un tope: en pantallas pequeñas, la caja se encoge.",
    use: [
      "Textos largos: entre 45ch y 75ch las líneas se siguen sin esfuerzo.",
      "max-width: 100% para que tarjetas e imágenes no desborden.",
    ],
    avoid: [
      "Un width grande (900px) en un texto: en el móvil da scroll lateral.",
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
      "30ch corta las líneas a unos 30 caracteres; en vista estrecha, la caja se encoge.",
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
    tagline: "Parte palabras larguísimas para que no se salgan.",
    explain:
      "El navegador solo corta líneas en los espacios, así que una URL larga se sale de su caja. overflow-wrap: anywhere la corta donde haga falta.",
    use: [
      "Direcciones web, correos o códigos largos dentro de cajas estrechas.",
      "Textos que escriben otras personas, que pueden traer palabras enormes.",
    ],
    avoid: [
      "Tapar el desborde con overflow: hidden: parte del texto deja de verse.",
      "Esperar que parta palabras normales: solo actúa si una no cabe.",
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
      "La primera dirección se sale; en la segunda, overflow-wrap: anywhere la parte.",
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
          why: "overflow no parte palabras: solo decide qué hacer con lo que sobresale.",
        },
      ],
    },
    mdn: {
      label: "MDN: overflow-wrap (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap",
    },
  },

  // -------------------------------------------------------------------------
  // css-09: display and sizing
  // -------------------------------------------------------------------------
  {
    id: "css-display",
    worldId: "css-basics",
    kind: "property",
    title: "display: block e inline",
    tagline: "Decide si una caja ocupa toda la fila o fluye con el texto.",
    explain:
      "Los block (<p>, <div>, <li>) ocupan todo el ancho y se apilan. Los inline (<a>, <span>) van en la línea, pero ignoran width y height.",
    use: [
      "display: block para que un enlace ocupe su propia fila entera.",
      "display: inline para poner <li> en fila, si no necesitan tamaño.",
    ],
    avoid: [
      "Darle width a un <a> o un <span> y esperar que cambie: siendo inline, lo ignora.",
      "Colocar cajas con <br> o espacios: display, y luego flexbox, lo hacen mejor.",
    ],
    example: {
      html: `<p>Soy un párrafo: block.</p>
<p>Otro párrafo, debajo.</p>
<a href="#">Barcos</a>
<a href="#">Cebos</a>
<a href="#">Mareas</a>
`,
      css: `p {
  background-color: lightblue;
}

a {
  width: 200px;
  background-color: wheat;
}
`,
    },
    exampleNote:
      "Los <p> ocupan todo el ancho; los <a> van en fila e ignoran width: 200px.",
    predict: {
      question: "Si añades display: block a la regla de a, ¿qué pasa con los enlaces?",
      options: [
        {
          label: "Cada uno pasa a su propia fila y mide 200px",
          correct: true,
          why: "Como block, empiezan línea nueva y ya respetan width.",
        },
        {
          label: "Siguen en fila, pero ahora de 200px",
          correct: false,
          why: "Eso lo hace inline-block, la siguiente ficha. block siempre empieza una fila nueva.",
        },
        {
          label: "Nada cambia",
          correct: false,
          why: "display cambia cómo se comporta la caja: es justo lo que lo arregla.",
        },
      ],
    },
    mdn: {
      label: "MDN: display",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/display",
    },
  },
  {
    id: "css-inline-block",
    worldId: "css-basics",
    kind: "property",
    title: "display: inline-block",
    tagline: "En fila como el texto, pero respetando width y height.",
    explain:
      "inline-block va en la línea junto a sus vecinas, como inline, pero acepta width, height y padding, como block.",
    use: [
      "Botones o etiquetas que van en fila y necesitan un ancho fijo.",
      "Elementos de lista (<li>) que quieres poner uno al lado del otro.",
    ],
    avoid: [
      "Dárselo solo al <a> si cada uno vive en un <li>: el <li> también lo necesita.",
      "Esperar que se centren solos: para eso, flexbox (próximo nivel).",
    ],
    example: {
      html: `<a class="boton" href="#">Barcos</a>
<a class="boton" href="#">Cebos</a>
`,
      css: `.boton {
  display: inline-block;
  width: 140px;
  padding: 10px 0;
  border-radius: 8px;
  background-color: teal;
  color: white;
  text-align: center;
}
`,
    },
    exampleNote: "display: inline-block deja los enlaces en fila y hace que respeten width: 140px.",
    predict: {
      question: "Cada enlace está en su propio <li>. Si solo los <a> llevan inline-block, ¿quedan en fila?",
      options: [
        {
          label: "No: cada <li> sigue siendo block y ocupa su fila",
          correct: true,
          why: "El padre manda: los <li> también necesitan inline-block (o flexbox en la lista).",
        },
        {
          label: "Sí, porque los enlaces ya van en fila",
          correct: false,
          why: "Van en fila dentro de su línea, pero cada uno vive en un <li> distinto, apilado.",
        },
      ],
    },
    mdn: {
      label: "MDN: display",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/display",
    },
  },
  {
    id: "css-object-fit",
    worldId: "css-basics",
    kind: "property",
    title: "object-fit",
    tagline: "Decide cómo encaja una imagen en una caja de otra forma.",
    explain:
      "Una imagen con width y height de otra proporción se deforma. object-fit: cover la recorta sin deformarla; contain la mete entera con huecos.",
    use: [
      "Fotos de perfil cuadradas o redondas a partir de fotos apaisadas.",
      "Galerías donde todas las miniaturas miden lo mismo.",
    ],
    avoid: [
      "Forzar width y height de otra proporción sin object-fit: sale aplastada.",
      "Usar cover si no puedes recortar nada, como en un mapa: ahí, contain.",
    ],
    example: {
      html: `<img src="${LIGHTHOUSE_SRC}" alt="Un faro, aplastado a la fuerza">
<img class="encaja" src="${LIGHTHOUSE_SRC}" alt="Un faro, recortado sin deformar">
`,
      css: `img {
  width: 120px;
  height: 120px;
  border: 3px solid #1B1F3B;
}

.encaja {
  object-fit: cover;
}
`,
    },
    exampleNote:
      "Ambas son apaisadas en 120 por 120px; solo la de object-fit: cover no se aplasta.",
    predict: {
      question: "Con object-fit: cover, una foto apaisada dentro de un cuadrado pierde…",
      options: [
        {
          label: "Un trozo de los lados izquierdo y derecho",
          correct: true,
          why: "Crece hasta cubrir el alto; como es más ancha que alta, sobra por los lados.",
        },
        {
          label: "Un trozo de arriba y de abajo",
          correct: false,
          why: "Eso le pasaría a una foto vertical. La apaisada sobra por los lados.",
        },
        {
          label: "Nada: se estrecha para caber",
          correct: false,
          why: "Estrecharla es deformarla, que es justo lo que cover evita.",
        },
      ],
    },
    mdn: {
      label: "MDN: object-fit",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/object-fit",
    },
  },

  // -------------------------------------------------------------------------
  // css-10: flexbox
  // -------------------------------------------------------------------------
  {
    id: "css-flex",
    worldId: "css-basics",
    kind: "property",
    title: "display: flex",
    tagline: "Pone a los hijos de una caja en fila.",
    explain:
      "display: flex va en el padre. Sus hijos directos se ponen en fila, aunque sean block; luego decides cómo se reparten.",
    use: [
      "Menús, barras de botones, filas de tarjetas o de iconos.",
      "Cualquier grupo que deba ir en fila y alinearse.",
    ],
    avoid: [
      "Ponérselo a los hijos esperando que se pongan en fila: va en el contenedor.",
      "Cambiar el orden con row-reverse u order: el teclado sigue el HTML.",
    ],
    example: {
      html: `<div class="jardin">
  <div class="maceta">Cactus</div>
  <div class="maceta">Girasol</div>
  <div class="maceta">Palmera</div>
</div>
`,
      css: `.jardin {
  display: flex;
  padding: 12px;
  background-color: honeydew;
}

.maceta {
  padding: 12px;
  border: 3px solid darkgreen;
  background-color: gold;
}
`,
    },
    exampleNote: "display: flex en .jardin pone las tres macetas en fila, aunque cada una es un <div>.",
    predict: {
      question: "Si quitas display: flex de .jardin, ¿cómo quedan las macetas?",
      options: [
        {
          label: "Apiladas, una debajo de otra",
          correct: true,
          why: "Sin flex vuelven a ser <div> block normales: cada uno ocupa su fila.",
        },
        {
          label: "En fila igual",
          correct: false,
          why: "Lo que las ponía en fila era el contenedor flex. Sin él, mandan sus display de serie.",
        },
      ],
    },
    mdn: {
      label: "MDN: Flexbox",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Flexbox",
    },
  },
  {
    id: "css-justify-content",
    worldId: "css-basics",
    kind: "property",
    title: "justify-content y align-items",
    tagline: "Reparten y alinean a los hijos de un contenedor flex.",
    explain:
      "En un contenedor flex, justify-content reparte a los hijos en la fila y align-items los alinea en vertical. Las dos van en el contenedor.",
    use: [
      "justify-content: center para agrupar en el medio.",
      "space-between para llevar los extremos a los lados: logo y menú.",
      "align-items: center para centrar en vertical cajas de distinto alto.",
    ],
    avoid: [
      "Usarlas sin display: flex en el contenedor: no hacen nada.",
      "Centrar a ojo con márgenes: justify-content lo calcula exacto.",
    ],
    example: {
      html: `<div class="jardin">
  <div class="maceta">Cactus</div>
  <div class="maceta alta">Girasol</div>
  <div class="maceta">Palmera</div>
</div>
`,
      css: `.jardin {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  background-color: honeydew;
}

.maceta {
  padding: 12px;
  border: 3px solid darkgreen;
  background-color: gold;
}

.alta {
  padding: 36px 12px;
}
`,
    },
    exampleNote:
      "justify-content: center las agrupa en el medio; align-items: center, en vertical.",
    predict: {
      question: "Cambias justify-content: center por space-between. ¿Dónde quedan las macetas?",
      options: [
        {
          label: "Una en cada extremo y la del medio en el centro",
          correct: true,
          why: "Pega la primera y la última a los bordes y reparte el espacio entre ellas.",
        },
        {
          label: "Todas juntas a la izquierda",
          correct: false,
          why: "Eso hace flex-start, el valor por defecto.",
        },
        {
          label: "Igual, pero arriba del todo",
          correct: false,
          why: "La posición vertical la decide align-items, que no has cambiado.",
        },
      ],
    },
    mdn: {
      label: "MDN: justify-content",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/justify-content",
    },
  },
  {
    id: "css-gap",
    worldId: "css-basics",
    kind: "property",
    title: "gap",
    tagline: "Pone el mismo espacio entre los hijos de un contenedor flex.",
    explain:
      "gap pone el mismo espacio entre cada hijo y el siguiente, nunca en los extremos. Va en el contenedor, junto a display: flex.",
    use: [
      "Separar botones, tarjetas o iconos en fila con una distancia exacta.",
      "Cambiar toda la separación de una vez tocando un solo valor.",
    ],
    avoid: [
      "Separar con margin en cada hijo: sobra espacio en los extremos.",
      "Ponérselo a los hijos: gap va en el contenedor.",
    ],
    example: {
      html: `<div class="jardin">
  <div class="maceta">Cactus</div>
  <div class="maceta">Girasol</div>
  <div class="maceta">Palmera</div>
</div>
`,
      css: `.jardin {
  display: flex;
  gap: 24px;
  padding: 12px;
  background-color: honeydew;
}

.maceta {
  padding: 12px;
  border: 3px solid darkgreen;
  background-color: gold;
}
`,
    },
    exampleNote:
      "gap: 24px separa las macetas entre sí; la primera sigue pegada al relleno.",
    predict: {
      question: "Con tres macetas y gap: 24px, ¿cuántos huecos de 24px hay?",
      options: [
        {
          label: "Dos: uno entre cada par de macetas",
          correct: true,
          why: "gap solo pone espacio entre hijos vecinos, no en los extremos.",
        },
        {
          label: "Cuatro: también antes de la primera y después de la última",
          correct: false,
          why: "Eso pasaría con margin en cada maceta. gap no toca los extremos.",
        },
      ],
    },
    mdn: {
      label: "MDN: gap",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/gap",
    },
  },
];
