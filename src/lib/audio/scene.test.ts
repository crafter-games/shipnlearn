import { describe, expect, it } from "vitest";
import { INTENSITY, SCENE_DB } from "./mix";
import { SceneDirector } from "./scene";
import { JINGLE_ORDER } from "./tracks";

describe("SceneDirector", () => {
  it("maps scenes to tracks: map loop on the map, the world's loop in the editor", () => {
    const d = new SceneDirector("map");
    expect(d.resolve().track).toBe("map");
    d.request("editor");
    expect(d.resolve().track).toBe("html");
    d.setWorld("css");
    expect(d.resolve().track).toBe("css");
    d.request("map");
    expect(d.resolve().track).toBe("map");
  });

  it("intensity shapes the editor only", () => {
    const d = new SceneDirector("editor");
    d.setIntensity(0);
    const calm = d.resolve();
    d.setIntensity(1);
    const full = d.resolve();
    expect(calm.cutoffHz).toBe(INTENSITY.minHz);
    expect(full.cutoffHz).toBeCloseTo(INTENSITY.maxHz, 6);
    expect(full.gainDb - calm.gainDb).toBe(2);
    expect(full.sceneDb).toBe(SCENE_DB.editor);
    d.request("map");
    expect(d.resolve().cutoffHz).toBe(INTENSITY.maxHz);
    d.setIntensity(3);
    expect(d.intensity).toBe(1);
  });

  it("celebrate ducks the current loop under a jingle, then returns on its own", () => {
    const d = new SceneDirector("editor");
    expect(d.request("celebrate")).toBe(JINGLE_ORDER[0]);
    expect(d.target).toBe("celebrate");
    expect(d.resolve()).toMatchObject({ track: "html", ducked: true });
    expect(d.jingleEnded()).toBe(true);
    expect(d.target).toBe("editor");
    expect(d.resolve()).toMatchObject({ track: "html", ducked: false });
    expect(d.jingleEnded()).toBe(false);
  });

  it("alternates jingles across celebrations", () => {
    const d = new SceneDirector("editor");
    const got = [d.request("celebrate"), d.request("celebrate"), d.request("celebrate")];
    const n = JINGLE_ORDER.length;
    expect(got).toEqual([JINGLE_ORDER[0], JINGLE_ORDER[1 % n], JINGLE_ORDER[2 % n]]);
  });

  it("an explicit request during the celebration wins over the auto-return", () => {
    const d = new SceneDirector("editor");
    d.request("celebrate");
    expect(d.request("map")).toBeNull();
    expect(d.resolve()).toMatchObject({ track: "map", ducked: false });
    expect(d.jingleEnded()).toBe(false);
    expect(d.target).toBe("map");
  });

  it("settle drops a stale celebration requested before unlock", () => {
    const d = new SceneDirector("map");
    d.request("editor");
    d.request("celebrate");
    d.settle();
    expect(d.target).toBe("editor");
    expect(d.resolve().ducked).toBe(false);
  });
});
