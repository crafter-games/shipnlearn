import { expect, type Page, test } from "@playwright/test";
import { levelBasics, MAP, TILES } from "../src/components/tutorial/tours";
import { allCards } from "../src/lib/levels/cards";
import { getLevel } from "../src/lib/levels/registry";

const KEY = "shipnlearn-progress";
const FIRST = "html-01-titulo";
const TILES_LEVEL = "html-02-encabezados";

// Spring and bob animations are not under test; the steps and persistence are.
test.use({ reducedMotion: "reduce" });

async function fresh(page: Page, path: string, state: Record<string, unknown> = {}) {
  await page.goto("/fichero");
  await page.evaluate(
    ([k, s]) => {
      localStorage.clear();
      localStorage.setItem(k, JSON.stringify({ state: s, version: 3 }));
    },
    [KEY, state] as const,
  );
  await page.goto(path);
}

const seenTips = (page: Page) =>
  page.evaluate((k) => (JSON.parse(localStorage.getItem(k) ?? "{}").state?.seenTips ?? []) as string[], KEY);

const tour = (page: Page) => page.getByTestId("coach-marks");
const text = (page: Page) => page.getByTestId("coach-text");

test("level 1 tour starts after the cards, walks every step and never returns", async ({ page }) => {
  await fresh(page, `/play/${FIRST}`);

  // The cards come first, and the tour never covers their «Saltar».
  const cards = page.getByRole("dialog", { name: /Ficha nueva/ });
  await expect(cards).toBeVisible();
  await expect(tour(page)).toHaveCount(0);
  await cards.getByRole("button", { name: "Saltar" }).click();

  const steps = levelBasics(getLevel(FIRST)!);
  for (const [i, step] of steps.entries()) {
    await expect(text(page)).toHaveText(step.text);
    // The main action has focus, so Enter keeps going.
    await expect(page.getByTestId("coach-next")).toBeFocused();
    // The spotlit target is really on screen.
    await expect(page.locator(step.target).first()).toBeInViewport();
    if (i === 0) {
      // Tapping anywhere on the dim also advances.
      await tour(page).click({ position: { x: 4, y: 4 } });
    } else if (i === 1) {
      await page.keyboard.press("Enter");
    } else {
      await page.getByTestId("coach-next").click();
    }
  }
  await expect(tour(page)).toHaveCount(0);
  expect(await seenTips(page)).toContain("level-basics");

  // The page is playable again.
  await expect(page.locator(".cm-content")).toBeVisible();

  await page.reload();
  await expect(page.locator("[data-check]").first()).toBeVisible();
  await page.waitForTimeout(1200);
  await expect(tour(page)).toHaveCount(0);
});

test("«Saltar» and Escape skip the tour and remember it", async ({ page }) => {
  const seenCards = allCards.map((c) => c.id);
  await fresh(page, `/play/${FIRST}`, { seenCards });
  await expect(text(page)).toHaveText(levelBasics(getLevel(FIRST)!)[0].text);
  await page.getByTestId("coach-skip").click();
  await expect(tour(page)).toHaveCount(0);
  expect(await seenTips(page)).toEqual(["level-basics"]);

  await fresh(page, `/play/${FIRST}`, { seenCards });
  await expect(tour(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tour(page)).toHaveCount(0);
  expect(await seenTips(page)).toEqual(["level-basics"]);
});

test("the first tiles level explains the tiles once", async ({ page }) => {
  await fresh(page, `/play/${TILES_LEVEL}`, {
    levels: { [FIRST]: { stars: 1, completedAt: 1 } },
    seenCards: allCards.map((c) => c.id),
    seenTips: ["level-basics"],
  });
  for (const step of TILES) {
    await expect(text(page)).toHaveText(step.text);
    await expect(page.locator(step.target)).toBeInViewport();
    await page.getByTestId("coach-next").click();
  }
  await expect(tour(page)).toHaveCount(0);
  expect(await seenTips(page)).toContain("tiles");

  // The board works right after.
  await page.getByTestId("tiles-bank").getByRole("button").first().click();
  await expect(page.getByTestId("tiles-placed").getByRole("button")).toHaveCount(1);
});

test("the map explains nodes, the Fichero and progress after the first win", async ({ page }) => {
  await fresh(page, "/", {
    levels: { [FIRST]: { stars: 2, completedAt: 1 } },
    xp: 20,
    seenIntro: true,
    seenTips: ["level-basics"],
  });
  for (const step of MAP) {
    await expect(text(page)).toHaveText(step.text);
    await page.getByTestId("coach-next").click();
  }
  await expect(tour(page)).toHaveCount(0);
  expect(await seenTips(page)).toContain("map");

  await page.reload();
  await expect(page.getByTestId("hud-fichero")).toBeVisible();
  await page.waitForTimeout(1200);
  await expect(tour(page)).toHaveCount(0);
});

test("a brand-new map without wins shows no map tip", async ({ page }) => {
  await fresh(page, "/", { seenIntro: true });
  await expect(page.getByTestId("hud-fichero")).toBeVisible();
  await page.waitForTimeout(1200);
  await expect(tour(page)).toHaveCount(0);
});
