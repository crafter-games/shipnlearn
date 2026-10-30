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
];
