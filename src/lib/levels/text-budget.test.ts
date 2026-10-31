import { describe, expect, it } from "vitest";
import { allCards } from "./cards";
import { allLevels } from "./registry";

/**
 * Text budget. Players should read little at a time: each string fits one
 * glance on a phone. Limits are in characters (≈ 6 per word in Spanish).
 */
const BUDGET = {
  card: {
    tagline: 60,
    explain: 150, // two short sentences
    useItems: 3,
    useItem: 70,
    avoidItems: 2,
    avoidItem: 80,
    exampleNote: 90,
    question: 90,
    why: 90,
  },
  level: {
    story: 110,
    lesson: 140,
    checkLabel: 55,
    checkExplain: 110,
    conceptHint: 110, // hints[0] and hints[2]
    codeHint: 160, // hints[1] is a code fragment
  },
};

const over = (items: [string, string][], max: number) =>
  items.filter(([, s]) => s.length > max).map(([where, s]) => `${where} (${s.length}/${max}): ${s}`);

describe("text budget", () => {
  it("keeps concept cards short", () => {
    const b = BUDGET.card;
    const problems = allCards.flatMap((c) => [
      ...over([[`${c.id}.tagline`, c.tagline]], b.tagline),
      ...over([[`${c.id}.explain`, c.explain]], b.explain),
      ...over([[`${c.id}.exampleNote`, c.exampleNote]], b.exampleNote),
      ...over([[`${c.id}.predict.question`, c.predict.question]], b.question),
      ...over(c.use.map((u, i) => [`${c.id}.use[${i}]`, u]), b.useItem),
      ...over(c.avoid.map((u, i) => [`${c.id}.avoid[${i}]`, u]), b.avoidItem),
      ...over(c.predict.options.map((o, i) => [`${c.id}.why[${i}]`, o.why]), b.why),
      ...(c.use.length > b.useItems ? [`${c.id}.use has ${c.use.length}/${b.useItems} items`] : []),
      ...(c.avoid.length > b.avoidItems ? [`${c.id}.avoid has ${c.avoid.length}/${b.avoidItems} items`] : []),
    ]);
    expect(problems).toEqual([]);
  });

  it("keeps level text short", () => {
    const b = BUDGET.level;
    const problems = allLevels.flatMap((l) => [
      ...over([[`${l.id}.story`, l.story]], b.story),
      ...over([[`${l.id}.lesson`, l.lesson]], b.lesson),
      ...over(l.checks.map((c) => [`${l.id}.${c.id}.label`, c.label]), b.checkLabel),
      ...over(l.checks.map((c) => [`${l.id}.${c.id}.explain`, c.explain]), b.checkExplain),
      ...over([[`${l.id}.hints[0]`, l.hints[0]], [`${l.id}.hints[2]`, l.hints[2]]], b.conceptHint),
      ...over([[`${l.id}.hints[1]`, l.hints[1]]], b.codeHint),
    ]);
    expect(problems).toEqual([]);
  });
});
