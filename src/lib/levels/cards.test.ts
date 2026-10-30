import { describe, expect, it } from "vitest";
import { allCards, getCard } from "./cards";
import { allLevels } from "./registry";

describe("concept cards", () => {
  it("have unique ids", () => {
    const ids = allCards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each have exactly one correct predict option", () => {
    for (const c of allCards) {
      expect(c.predict.options.filter((o) => o.correct), c.id).toHaveLength(1);
    }
  });

  it("are all referenced by existing ids from levels", () => {
    for (const l of allLevels) for (const id of l.cards) expect(getCard(id), `${l.id} → ${id}`).toBeDefined();
  });

  it("are introduced by at most one level and belong to its world", () => {
    const seen = new Map<string, string>();
    for (const l of allLevels) {
      for (const id of l.cards) {
        expect(seen.has(id), `${id} introduced twice (${seen.get(id)}, ${l.id})`).toBe(false);
        seen.set(id, l.id);
        expect(getCard(id)?.worldId).toBe(l.worldId);
      }
    }
  });
});
