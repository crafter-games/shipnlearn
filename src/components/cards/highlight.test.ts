import { describe, expect, it } from "vitest";
import { highlightCss, highlightHtml } from "./highlight";

const join = (t: { text: string }[]) => t.map((x) => x.text).join("");
const kinds = (t: { kind: string; text: string }[], kind: string) =>
  t.filter((x) => x.kind === kind).map((x) => x.text.trim());

describe("highlightHtml", () => {
  const src = '<!-- hola -->\n<a href="/mapa" class=x>Ir</a>\n<img src="i.png" alt="">';
  const tokens = highlightHtml(src);

  it("keeps every character", () => expect(join(tokens)).toBe(src));
  it("colours tags, attributes and strings", () => {
    expect(kinds(tokens, "tag")).toEqual(["a", "a", "img"]);
    expect(kinds(tokens, "attr")).toEqual(["href", "class", "src", "alt"]);
    expect(kinds(tokens, "comment")).toEqual(["<!-- hola -->"]);
    expect(tokens.find((t) => t.text === "Ir")?.kind).toBe("text");
  });
});

describe("highlightCss", () => {
  const src = "/* tarjeta */\n.card a:hover {\n  color: red;\n  margin: 0 auto\n}\n@media (max-width: 600px) {\n  h1 { font-size: 2rem; }\n}\n";
  const tokens = highlightCss(src);

  it("keeps every character", () => expect(join(tokens)).toBe(src));
  it("tells selectors, properties and values apart", () => {
    expect(kinds(tokens, "selector")).toEqual([".card a:hover", "@media (max-width: 600px)", "h1"]);
    expect(kinds(tokens, "property")).toEqual(["color", "margin", "font-size"]);
    expect(kinds(tokens, "value")).toEqual(["red", "0 auto", "2rem"]);
  });
});
