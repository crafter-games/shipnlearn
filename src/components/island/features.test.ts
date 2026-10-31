import { describe, expect, it } from "vitest";
import { islandFeatures, worldProgress } from "./features";

const base = { completed: 0, total: 9, stars: 0, bossDone: false, rank: 1 };

describe("islandFeatures", () => {
  it("starts grey and empty", () => {
    expect(islandFeatures(base)).toEqual({
      named: false,
      palms: 0,
      houses: 0,
      lighthouse: false,
      boat: false,
      flag: false,
      flowers: false,
      lanterns: false,
      landmark: 0,
    });
  });

  it("puts the name sign up after the first level", () => {
    const f = islandFeatures({ ...base, completed: 1, stars: 3 });
    expect(f.named).toBe(true);
    expect(f.palms).toBe(1);
    expect(f.houses).toBe(0);
  });

  it("grows with completed levels and docks a boat when done", () => {
    const f = islandFeatures({ ...base, completed: 9, stars: 27, bossDone: true });
    expect(f).toMatchObject({ palms: 3, houses: 3, lighthouse: true, boat: true });
  });

  it("builds the landmark in stages", () => {
    const stage = (completed: number, bossDone = false) =>
      islandFeatures({ ...base, completed, stars: completed * 3, bossDone }).landmark;
    expect([stage(0), stage(1), stage(5), stage(9, true)]).toEqual([0, 1, 2, 3]);
  });

  it("unlocks cosmetics by rank", () => {
    const f = islandFeatures({ ...base, completed: 1, stars: 1, rank: 3 });
    expect(f).toMatchObject({ flag: true, flowers: true, lanterns: false });
  });

  it("summarises a world from the store", () => {
    const world = {
      levels: [{ id: "a" }, { id: "b", boss: true }] as never,
    };
    const p = worldProgress(world, { a: { stars: 2, completedAt: 0 } }, 1);
    expect(p).toEqual({ completed: 1, total: 2, stars: 2, bossDone: false, rank: 1 });
  });
});
