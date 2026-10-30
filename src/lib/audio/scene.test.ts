import { describe, expect, it } from "vitest";
import { STINGER_BARS } from "./composition";
import { SceneDirector } from "./scene";

describe("SceneDirector", () => {
  it("only switches at the next bar", () => {
    const d = new SceneDirector("map");
    d.request("editor");
    expect(d.current).toBe("map");
    expect(d.target).toBe("editor");
    expect(d.onBar()).toEqual({ apply: "editor", stinger: false });
    expect(d.current).toBe("editor");
    expect(d.onBar()).toEqual({ apply: null, stinger: false });
  });

  it("ignores requests for the scene already playing", () => {
    const d = new SceneDirector("map");
    d.request("map");
    expect(d.onBar().apply).toBeNull();
  });

  it("celebrates for STINGER_BARS bars, then returns to the previous scene", () => {
    const d = new SceneDirector("map");
    d.request("editor");
    d.onBar();
    d.request("celebrate");
    expect(d.onBar()).toEqual({ apply: "celebrate", stinger: true });
    for (let i = 1; i < STINGER_BARS; i++) expect(d.onBar().apply).toBeNull();
    expect(d.onBar()).toEqual({ apply: "editor", stinger: false });
    expect(d.current).toBe("editor");
  });

  it("an explicit request during the celebration wins over the auto-return", () => {
    const d = new SceneDirector("editor");
    d.request("celebrate");
    d.onBar();
    d.request("map");
    expect(d.onBar()).toEqual({ apply: "map", stinger: false });
    for (let i = 0; i < 4; i++) expect(d.onBar().apply).toBeNull();
    expect(d.current).toBe("map");
  });

  it("settle applies the requested scene instantly and skips a stale celebration", () => {
    const d = new SceneDirector("map");
    d.request("editor");
    expect(d.settle()).toBe("editor");
    d.request("celebrate");
    expect(d.settle()).toBe("editor");
    expect(d.onBar().apply).toBeNull();
  });
});
