import { expect, test } from "@playwright/test";
import { allLevels } from "../src/lib/levels/registry";
import type { FillSpec, Level } from "../src/lib/levels/types";

/** Blank values that turn `spec.template` into the level's solution file. */
function fillAnswers(level: Level, spec: FillSpec): string[] {
  const solution = (level.solution[spec.file] ?? "").trim();
  const pattern = spec.template
    .trim()
    .split(/\[\[\d+\]\]/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("([\\s\\S]*?)");
  const match = solution.match(new RegExp(`^${pattern}$`));
  if (!match) throw new Error(`${level.id}: solution does not match the fill template`);
  return match.slice(1);
}

const playable = allLevels.filter((l) => l.mode === "tiles" || l.mode === "fill");

test.beforeEach(async ({ page }) => {
  // Every level unlocked, no intro, no saved drafts.
  await page.goto("/");
  await page.evaluate((ids) => {
    localStorage.clear();
    const levels = Object.fromEntries(ids.map((id) => [id, { stars: 1, completedAt: 1 }]));
    localStorage.setItem(
      "shipnlearn-progress",
      JSON.stringify({ state: { levels, xp: 0, reviews: [], seenIntro: true }, version: 2 }),
    );
  }, allLevels.map((l) => l.id));
});

for (const level of playable) {
  test(`plays ${level.id} (${level.mode}) through the UI`, async ({ page }) => {
    await page.goto(`/play/${level.id}`);
    await expect(page.locator("[data-check]").first()).toBeVisible();

    if (level.tiles) {
      for (const line of level.tiles.lines) {
        await page
          .getByTestId("tiles-bank")
          .getByRole("button", { name: `Añadir línea: ${line.trim()}`, exact: true })
          .first()
          .click();
      }
    } else if (level.fill) {
      const answers = fillAnswers(level, level.fill);
      const inputs = page.getByTestId("fill-board").locator("input");
      await expect(inputs).toHaveCount(answers.length);
      for (const [i, value] of answers.entries()) await inputs.nth(i).fill(value);
    }

    await page.getByTestId("ship").click();
    const dialog = page.getByRole("dialog", { name: /Lanzado/ });
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    // The reference solution is semantic and accessible: it must earn 3 stars.
    await expect(dialog.locator("[data-stars]")).toHaveAttribute("data-stars", "3");
  });
}
