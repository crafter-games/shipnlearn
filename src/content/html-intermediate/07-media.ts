import { $, rect, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { MARKET_CSS } from "./_helpers";
import { MANGO_CAPTIONS, MANGO_POSTER, MANGO_VIDEO, STALL_SONG } from "./_images";

const CAPTION = "«Fruta fresca», grabada por DJ Marea en la plaza.";

const starter = `<h2>La radio del mercado</h2>
<p>El anuncio de los mangos, con la voz de Marisol:</p>
<video src="${MANGO_VIDEO}"
  poster="${MANGO_POSTER}"
  width="320" height="180"></video>

<p>Y la canción del puesto:</p>
<audio src="${STALL_SONG}"></audio>
<p>${CAPTION}</p>
`;

const solution = `<h2>La radio del mercado</h2>
<p>El anuncio de los mangos, con la voz de Marisol:</p>
<video controls src="${MANGO_VIDEO}"
  poster="${MANGO_POSTER}"
  width="320" height="180">
  <track kind="captions" src="${MANGO_CAPTIONS}"
    srclang="es" label="Español">
</video>

<p>Y la canción del puesto:</p>
<figure>
  <audio controls src="${STALL_SONG}"></audio>
  <figcaption>${CAPTION}</figcaption>
</figure>
`;

const video = (ctx: CheckContext) => $(ctx, "video") as HTMLVideoElement | null;
const audio = (ctx: CheckContext) => $(ctx, "audio") as HTMLAudioElement | null;
const captions = (ctx: CheckContext) =>
  (Array.from(video(ctx)?.querySelectorAll("track") ?? []) as HTMLTrackElement[]).find(
    (t) => t.kind === "captions" && (t.getAttribute("src") ?? "").trim().length > 0,
  ) ?? null;

export const media: Level = {
  id: "htmli-07-media",
  worldId: "html-intermediate",
  title: "La radio del mercado",
  npc: { name: "DJ Marea", avatar: "dj-marea" },
  story:
    "El anuncio no se puede pausar, la canción ni se ve y quien no oye se pierde a Marisol. ¡Botones y subtítulos!",
  concept: "<video>, <audio>, <track> y <figure>",
  lesson:
    "controls da botones a vídeo y audio, <track kind=\"captions\"> pone subtítulos y <figure> une cada medio con su <figcaption>.",
  mode: "code",
  starter: { html: starter, css: MARKET_CSS },
  editable: ["html"],
  solution: { html: solution, css: MARKET_CSS },
  checks: [
    {
      id: "video-controls",
      kind: "required",
      label: "El vídeo tiene botones (controls)",
      explain:
        "Sin controls no hay play ni pausa: nadie puede pararlo. Añade controls dentro de <video>.",
      test: (ctx) => !!video(ctx)?.controls,
    },
    {
      id: "captions",
      kind: "required",
      label: "El vídeo trae subtítulos con <track>",
      explain:
        "Mete en el <video> un <track kind=\"captions\" src=\"…/subtitulos.vtt\">: son los subtítulos.",
      test: (ctx) => captions(ctx) !== null,
    },
    {
      id: "audio-controls",
      kind: "required",
      label: "La canción se ve y se puede reproducir",
      explain: "Un <audio> sin controls es invisible y nadie le puede dar al play. Añádele controls.",
      test: (ctx) => {
        const el = audio(ctx);
        return !!el?.controls && rect(el).height > 0;
      },
    },
    {
      id: "figure",
      kind: "required",
      label: "La canción y su pie van juntos en <figure>",
      explain:
        "Un <p> suelto no queda unido al audio. Mete los dos en <figure> y cambia el <p> por <figcaption>.",
      test: (ctx) => {
        const fig = audio(ctx)?.closest("figure");
        const caption = fig?.querySelector(":scope > figcaption");
        return !!caption && text(caption).length >= 8;
      },
    },
    {
      id: "track-lang",
      kind: "a11y",
      label: "Los subtítulos dicen su idioma (srclang y label)",
      explain:
        "srclang=\"es\" dice el idioma y label=\"Español\" es el nombre que se ve en el menú de subtítulos.",
      test: (ctx) => {
        const t = video(ctx)?.querySelector("track") as HTMLTrackElement | null;
        return !!t && /^es\b/i.test(t.srclang) && t.label.trim().length >= 2;
      },
    },
  ],
  hints: [
    "controls va en <video> y en <audio>. El <track> va dentro del vídeo. Audio y pie, dentro de <figure>.",
    '<video controls …>\n  <track kind="captions" src="/levels/mercado/subtitulos.vtt" srclang="es" label="Español">\n</video>',
    "Mira «Contenido de vídeo y audio» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Contenido de vídeo y audio",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/HTML_video_and_audio",
    },
    { label: "MDN: <track>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/track" },
    { label: "MDN: <figure>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/figure" },
  ],
  cards: ["htmli-video-track", "htmli-audio", "htmli-figure"],
};
