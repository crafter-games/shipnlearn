import { beforeEach, describe, expect, it } from "vitest";
import type { Level } from "@/lib/levels/types";
import { summarize } from "./axe";
import { assembleFill, blankCount, blankWidth, fillTemplate, parseFill } from "./fill";
import { buildSrcdoc, PREVIEW_NONCE } from "./preview";
import type { CheckResult } from "./run-checks";
import { starsFor } from "./run-checks";
import { composeFiles, draftKey, initialDraft, loadDraft, saveDraft } from "./session";
import { assembleTiles, makeTiles, moveItem, placedLines, shuffleTiles } from "./tiles";

const base: Omit<Level, "mode"> = {
  id: "test-01",
  worldId: "html-basics",
  title: "Test",
  npc: { name: "Octo", avatar: "octo" },
  story: "",
  concept: "",
  lesson: "",
  starter: { html: "<p>starter</p>", css: "p{}" },
  editable: ["html"],
  solution: { html: "" },
  checks: [],
  hints: ["a", "b", "c"],
  mdn: [],
  cards: [],
};

const tilesLevel: Level = {
  ...base,
  mode: "tiles",
  tiles: {
    file: "html",
    lines: ["<li>uno</li>", "<li>dos</li>", "<li>uno</li>"],
    distractors: ["<li>tres"],
    before: "<ul>\n",
    after: "\n</ul>",
  },
};

const fillLevel: Level = {
  ...base,
  mode: "fill",
  fill: { file: "css", template: "h1 { color: [[0]]; font-size: [[1]]; }", placeholders: ["red", "2rem"] },
};

describe("tiles", () => {
  it("gives every line a stable id, including duplicates and distractors", () => {
    expect(makeTiles(tilesLevel.tiles!).map((t) => t.id)).toEqual(["l0", "l1", "l2", "d0"]);
  });

  it("shuffles deterministically and never returns the solved order", () => {
    const tiles = makeTiles(tilesLevel.tiles!);
    const a = shuffleTiles(tiles, "seed");
    expect(shuffleTiles(tiles, "seed")).toEqual(a);
    expect(a.map((t) => t.id).sort()).toEqual(tiles.map((t) => t.id).sort());
    for (const seed of ["x", "y", "z", "html-01", "css-02"]) {
      const two = shuffleTiles(tiles.slice(0, 2), seed);
      expect(two.map((t) => t.id)).not.toEqual(["l0", "l1"]);
    }
  });

  it("assembles before + lines + after", () => {
    expect(assembleTiles(tilesLevel.tiles!, ["<li>uno</li>", "<li>dos</li>"])).toBe(
      "<ul>\n<li>uno</li>\n<li>dos</li>\n</ul>",
    );
    expect(assembleTiles({ file: "html", lines: [] }, ["a"])).toBe("a");
  });

  it("with nothing placed yields just the fixed code (the tiles starter)", () => {
    expect(assembleTiles(tilesLevel.tiles!, [])).toBe("<ul>\n\n</ul>");
  });

  it("resolves placed ids and drops unknown ones", () => {
    const tiles = makeTiles(tilesLevel.tiles!);
    expect(placedLines(tiles, ["l1", "nope", "d0"])).toEqual(["<li>dos</li>", "<li>tres"]);
  });

  it("moves items with clamping", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveItem(["a", "b", "c"], 2, -5)).toEqual(["c", "a", "b"]);
    expect(moveItem(["a"], 3, 0)).toEqual(["a"]);
  });
});

describe("fill", () => {
  const t = fillLevel.fill!.template;

  it("parses text and blanks in order", () => {
    expect(parseFill(t)).toEqual([
      { kind: "text", text: "h1 { color: " },
      { kind: "blank", index: 0 },
      { kind: "text", text: "; font-size: " },
      { kind: "blank", index: 1 },
      { kind: "text", text: "; }" },
    ]);
    expect(parseFill("[[0]]")).toEqual([{ kind: "blank", index: 0 }]);
  });

  it("counts blanks and assembles values", () => {
    expect(blankCount(t)).toBe(2);
    expect(blankCount("no blanks")).toBe(0);
    expect(assembleFill(t, ["blue"])).toBe("h1 { color: blue; font-size: ; }");
    expect(fillTemplate(fillLevel.fill!, ["red", "2rem"])).toBe("h1 { color: red; font-size: 2rem; }");
  });

  it("sizes inputs to content", () => {
    expect(blankWidth("", "2rem")).toBe(5);
    expect(blankWidth("rebeccapurple", "red")).toBe(14);
  });
});

describe("session", () => {
  beforeEach(() => localStorage.clear());

  it("composes tiles and fill results into the right file", () => {
    const tiles = { ...initialDraft(tilesLevel), placed: ["l0", "l1"] };
    expect(composeFiles(tilesLevel, tiles)).toEqual({
      html: "<ul>\n<li>uno</li>\n<li>dos</li>\n</ul>",
      css: "p{}",
    });
    const fill = { ...initialDraft(fillLevel), values: ["red", "2rem"] };
    expect(composeFiles(fillLevel, fill)).toEqual({
      html: "<p>starter</p>",
      css: "h1 { color: red; font-size: 2rem; }",
    });
  });

  it("starts fill drafts with one empty value per blank", () => {
    expect(initialDraft(fillLevel).values).toEqual(["", ""]);
  });

  it("round-trips drafts and survives corrupt storage", () => {
    const code: Level = { ...base, mode: "code" };
    const d = { ...initialDraft(code), files: { html: "<h1>Hola</h1>" }, hintsUsed: 2 };
    saveDraft(code.id, d);
    expect(loadDraft(code)).toEqual(d);
    localStorage.setItem(draftKey(code.id), "{not json");
    expect(loadDraft(code)).toEqual(initialDraft(code));
    localStorage.setItem(draftKey(code.id), JSON.stringify({ v: 9 }));
    expect(loadDraft(code)).toEqual(initialDraft(code));
  });
});

describe("starsFor", () => {
  const r = (kind: CheckResult["kind"], pass: boolean): CheckResult => ({
    id: `${kind}-${pass}`,
    kind,
    pass,
    label: "",
    explain: "",
  });

  it("needs every required check for one star", () => {
    expect(starsFor([r("required", false), r("a11y", true)], { hintsUsed: 0 })).toBe(0);
  });

  it("needs a11y checks and a clean axe run for two", () => {
    expect(starsFor([r("required", true), r("a11y", false)], { hintsUsed: 0 })).toBe(1);
    expect(starsFor([r("required", true), r("a11y", true)], { hintsUsed: 0, axeClean: false })).toBe(1);
    expect(starsFor([r("required", true), r("a11y", true)], { hintsUsed: 1, axeClean: true })).toBe(2);
  });

  it("gives three only without hints", () => {
    expect(starsFor([r("required", true)], { hintsUsed: 0, axeClean: true })).toBe(3);
  });
});

describe("axe summary", () => {
  it("keeps only serious and critical violations, with friendly copy", () => {
    const issues = summarize({
      violations: [
        { id: "image-alt", impact: "critical", help: "x", nodes: [{}, {}] },
        { id: "heading-order", impact: "moderate", help: "y", nodes: [{}] },
        { id: "unknown-rule", impact: "serious", help: "Ayuda de axe", nodes: [{}] },
      ],
    } as never);
    expect(issues).toEqual([
      { id: "image-alt", impact: "critical", message: "Una imagen no tiene texto alternativo (alt).", count: 2 },
      { id: "unknown-rule", impact: "serious", message: "Ayuda de axe", count: 1 },
    ]);
  });
});

describe("buildSrcdoc", () => {
  it("adds a nonce-only script policy to wrapped and full documents", () => {
    const csp = `'nonce-${PREVIEW_NONCE}'`;
    expect(buildSrcdoc({ html: "<h1>Hi</h1>" })).toContain(csp);
    const full = buildSrcdoc({ html: "<!doctype html><html><head><title>x</title></head><body><header>h</header></body></html>", css: "h1{}" });
    expect(full.indexOf(csp)).toBeLessThan(full.indexOf("<title>"));
    expect(full).toContain("<header>h</header>");
    expect(full).toContain("<style data-user>h1{}</style></head>");
    expect(buildSrcdoc({ html: "<html><body>x</body></html>" })).toContain(csp);
  });

  it("strips player scripts", () => {
    expect(buildSrcdoc({ html: "<p>a</p><script>alert(1)</script>" })).not.toContain("alert");
  });
});
