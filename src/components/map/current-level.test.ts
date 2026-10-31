import { describe, expect, it } from "vitest";
import { allLevels, getWorld } from "@/lib/levels/registry";
import { currentLevelId } from "./current-level";

const html = getWorld("html-basics")!.levels;
const css = getWorld("css-basics")!.levels;
const done = (at: number) => ({ stars: 2 as const, completedAt: at });

describe("currentLevelId", () => {
  it("starts at the very first level", () => {
    expect(currentLevelId({}, [])).toBe(html[0].id);
  });

  it("follows the level after the last one beaten", () => {
    expect(currentLevelId({ [html[0].id]: done(1), [html[1].id]: done(2) }, [])).toBe(html[2].id);
  });

  it("prefers a fresh jump until its first level is played", () => {
    const levels = { [html[0].id]: done(1) };
    expect(currentLevelId(levels, ["css-basics"])).toBe(css[0].id);
    // After playing there, the player keeps going in the jumped world.
    expect(currentLevelId({ ...levels, [css[0].id]: done(2) }, ["css-basics"])).toBe(css[1].id);
  });

  it("returns to the skipped world after replaying an old level there", () => {
    const levels = { [html[0].id]: done(3), [css[0].id]: done(2) };
    expect(currentLevelId(levels, ["css-basics"])).toBe(html[1].id);
  });

  it("wraps around to earlier gaps once the last world is done", () => {
    // The last world that has levels, whichever it is as content grows.
    const lastWorld = allLevels.at(-1)!.worldId;
    const last = getWorld(lastWorld)!.levels;
    const levels = Object.fromEntries(last.map((l, i) => [l.id, done(10 + i)]));
    expect(currentLevelId(levels, [lastWorld])).toBe(html[0].id);
  });
});
