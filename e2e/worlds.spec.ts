import { type Page, expect, test } from "@playwright/test";
import { TIP_IDS } from "../src/components/tutorial/tours";
import { getWorld, worlds } from "../src/lib/levels/registry";

const KEY = "shipnlearn-progress";
const FIRST = "html-01-titulo";
const css = getWorld("css-basics")!;

// Bobbing nodes are never "stable" for Playwright; motion is not under test here.
test.use({ reducedMotion: "reduce" });

async function seed(page: Page, state: Record<string, unknown>) {
  await page.addInitScript(
    ([key, value]) => {
      if (sessionStorage.getItem("seeded")) return;
      localStorage.setItem(key, value);
      sessionStorage.setItem("seeded", "1");
    },
    [KEY, JSON.stringify({ state: { seenTips: TIP_IDS, seenIntro: true, ...state }, version: 3 })] as const,
  );
}

const nav = (page: Page) => page.getByRole("navigation", { name: "Islas" });

test("the navigator lists every island and scrolls to the one tapped", async ({ page }) => {
  await seed(page, { levels: { [FIRST]: { stars: 2, completedAt: 1 } } });
  await page.goto("/");
  const chips = nav(page).getByRole("button");
  await expect(chips).toHaveCount(worlds.length);
  expect(worlds.length).toBe(6);
  await expect(chips.first()).toHaveAccessibleName(/^Isla Marcado\s*1\/\d+ niveles$/);
  await expect(chips.nth(1)).toHaveAccessibleName(/^Isla Estilo\s*0\/\d+ niveles, bloqueada$/);

  const last = worlds.at(-1)!;
  const chip = nav(page).getByRole("button", { name: new RegExp(last.title) });
  await chip.click();
  await expect(page.getByRole("heading", { name: last.title, exact: true })).toBeInViewport();
  await expect(page.getByRole("heading", { name: last.title, exact: true })).toBeFocused();
  await expect(chip).toHaveAttribute("aria-current", "location");
  // The page itself never scrolls sideways (the chip row does, inside the bar).
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("tiers and languages are labelled, and empty islands say «Próximamente»", async ({ page }) => {
  await seed(page, { levels: {} });
  await page.goto("/");
  for (const name of ["Nivel básico", "Nivel intermedio", "Nivel avanzado"]) {
    await expect(page.getByRole("heading", { name, level: 2 })).toBeAttached();
  }
  const cssSection = page.getByRole("region", { name: css.title });
  await expect(cssSection.getByTestId("tier-badge")).toHaveText("Básico");
  await expect(cssSection.getByTestId("language-badge")).toHaveText("CSS");

  const empty = worlds.filter((w) => w.levels.length === 0);
  for (const w of empty) {
    const section = page.getByRole("region", { name: w.title });
    await expect(section.getByText("¡Próximamente!")).toBeAttached();
    // Nothing to jump to yet.
    await expect(section.getByRole("button", { name: "Saltar a esta isla" })).toHaveCount(0);
    await expect(nav(page).getByRole("button", { name: new RegExp(`^${w.title}\\s*Pronto$`) })).toBeVisible();
  }
});

test("«Saltar a esta isla» opens only the island's first level", async ({ page }) => {
  await seed(page, { levels: {} });
  await page.goto("/");
  const section = page.getByRole("region", { name: css.title });
  // Islands already reached offer no jump.
  await expect(page.getByRole("region", { name: "Isla Marcado" }).getByRole("button", { name: "Saltar a esta isla" })).toHaveCount(0);

  // «Mejor no» changes nothing.
  await section.getByRole("button", { name: "Saltar a esta isla" }).click();
  let dialog = page.getByRole("dialog", { name: `Saltar a ${css.title}` });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Podrás volver cuando quieras.")).toBeVisible();
  await dialog.getByRole("button", { name: "Mejor no" }).click();
  await expect(dialog).toBeHidden();
  await expect(section.getByRole("button", { name: /^Nivel 1: .*bloqueado$/ })).toBeVisible();

  await section.getByRole("button", { name: "Saltar a esta isla" }).click();
  dialog = page.getByRole("dialog", { name: `Saltar a ${css.title}` });
  await dialog.getByRole("button", { name: "Saltar a la isla" }).click();
  await expect(dialog).toBeHidden();

  // The jumped island's first level is now the next level, spotlit and focused.
  const first = section.getByRole("button", { name: /^Nivel 1: .*siguiente nivel$/ });
  await expect(first).toBeInViewport();
  await expect(first).toBeFocused();
  await expect(page.getByTestId("jump-spotlight")).toBeAttached();
  await expect(page.getByRole("button", { name: /siguiente nivel/ })).toHaveCount(1);
  // The rest of the island stays locked, and the skipped one stays playable.
  await expect(section.getByRole("button", { name: /bloqueado$/ })).toHaveCount(css.levels.length - 1);
  await expect(page.getByRole("button", { name: /^Nivel 1: .*disponible$/ })).toHaveCount(1);
  await expect(section.getByRole("button", { name: "Saltar a esta isla" })).toHaveCount(0);

  const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).state.unlockedWorlds, KEY);
  expect(stored).toEqual(["css-basics"]);

  await first.click();
  await page.getByRole("link", { name: "¡Jugar!" }).click();
  await expect(page).toHaveURL(new RegExp(`/play/${css.levels[0].id}`));
});
