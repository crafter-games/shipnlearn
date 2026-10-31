import { describe, expect, it } from "vitest";
import { specificity, specificityAtMost, splitSelectorList } from "./_helpers";

describe("splitSelectorList", () => {
  it("splits on top-level commas only", () => {
    expect(splitSelectorList(".a, :is(.b, .c) p,[data-x='1,2']")).toEqual([".a", ":is(.b, .c) p", "[data-x='1,2']"]);
  });
});

describe("specificity", () => {
  it.each([
    [".u-peligro", [0, 1, 0]],
    [".lab .boton", [0, 2, 0]],
    ["#lab button", [1, 0, 1]],
    ["p.aviso:hover", [0, 2, 1]],
    [":where(.lab) .u-peligro", [0, 1, 0]],
    ["a::before", [0, 0, 2]],
  ] as const)("%s", (selector, expected) => {
    expect(specificity(selector)).toEqual(expected);
  });

  it("orders specificities", () => {
    expect(specificityAtMost([0, 1, 0], [0, 1, 0])).toBe(true);
    expect(specificityAtMost([0, 2, 0], [0, 1, 0])).toBe(false);
    expect(specificityAtMost([0, 0, 5], [0, 1, 0])).toBe(true);
  });
});
