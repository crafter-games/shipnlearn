import path from "node:path";
import { type Page, expect, test } from "@playwright/test";
import { TIP_IDS } from "../src/components/tutorial/tours";

const KEY = "shipnlearn-progress";
const FIRST = "html-01-titulo";
const DAY = 24 * 60 * 60 * 1000;

type Seed = Record<string, unknown>;

/** Writes persisted progress before the app boots (once per test). */
async function seed(page: Page, state: Seed) {
  await page.addInitScript(
    ([key, value]) => {
      if (sessionStorage.getItem("seeded")) return;
      localStorage.setItem(key, value);
      sessionStorage.setItem("seeded", "1");
    },
    // Tutorial tips already seen: they have their own spec (tutorial.spec.ts).
    [KEY, JSON.stringify({ state: { seenTips: TIP_IDS, ...state }, version: 2 })] as const,
  );
}

const settings = { muted: false, musicVolume: 0.6, sfxVolume: 0.8, reducedMotion: false };

// Bobbing nodes are never "stable" for Playwright; motion is not under test here.
test.use({ reducedMotion: "reduce" });

test("first visit shows the intro and «¡Vamos!» opens the first level", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Esta isla no tiene ni nombre. ¡Ponle uno!")).toBeVisible();
  await page.getByRole("button", { name: "¡Vamos!" }).click();
  await expect(page).toHaveURL(new RegExp(`/play/${FIRST}`));
  // The intro is not shown twice.
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Mapa del archipiélago" })).toBeAttached();
  await expect(page.getByText("Esta isla no tiene ni nombre")).toHaveCount(0);
});

test("simulated progress shows stars, the next level and locks", async ({ page }) => {
  await seed(page, {
    levels: { [FIRST]: { stars: 2, completedAt: 1 } },
    xp: 20,
    reviews: [],
    settings,
    seenIntro: true,
    equipped: { flag: "coral" },
  });
  await page.goto("/");

  const done = page.getByRole("button", { name: "Nivel 1: Ponle nombre, 2 estrellas" });
  await expect(done).toBeVisible();

  const nodes = page.getByRole("button", { name: /^Nivel \d+:/ });
  const total = await nodes.count();
  // Each world numbers from 1; across worlds only one level is "next".
  await expect(page.getByRole("button", { name: /siguiente nivel/ })).toHaveCount(total > 1 ? 1 : 0);
  await expect(page.getByRole("button", { name: /bloqueado/ })).toHaveCount(Math.max(0, total - 2));

  // Tap → popover reveals the learnt concept and a replay link.
  await done.click();
  await expect(page.getByText("Aprendiste:")).toBeVisible();
  const play = page.getByRole("link", { name: "¡Jugar otra vez!" });
  await expect(play).toHaveAttribute("href", `/play/${FIRST}`);
  await page.keyboard.press("Escape");
  await expect(play).toHaveCount(0);

  // HUD reflects XP and stars.
  await expect(page.getByRole("progressbar", { name: /Rango de shipper 1: 20 de 100/ })).toBeVisible();
  await expect(page.getByRole("status", { name: /^2 de \d+ estrellas$/ })).toBeVisible();
});

test("a fresh map points at level 1 with a locked concept", async ({ page }) => {
  await seed(page, { levels: {}, xp: 0, reviews: [], settings, seenIntro: true });
  await page.goto("/");
  const first = page.getByRole("button", { name: /^Nivel 1: .*siguiente nivel$/ });
  await first.click();
  await expect(page.getByText("Descubre el concepto al completarlo")).toBeVisible();
  await page.getByRole("link", { name: "¡Jugar!" }).click();
  await expect(page).toHaveURL(new RegExp(`/play/${FIRST}`));
});

test("after a jump the map opens on the jumped island's first level", async ({ page }) => {
  await seed(page, {
    levels: { [FIRST]: { stars: 2, completedAt: 1 } },
    xp: 20,
    reviews: [],
    settings,
    seenIntro: true,
    unlockedWorlds: ["css-basics"],
  });
  await page.goto("/");
  const next = page.getByRole("button", { name: /siguiente nivel/ });
  await expect(next).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Isla Estilo" }).getByRole("button", { name: /^Nivel 1: .*siguiente nivel$/ })).toBeInViewport();
  // The skipped island's gap stays playable.
  await expect(page.getByRole("button", { name: /^Nivel 2: .*disponible$/ })).toHaveCount(1);
});

test("due tides wash up as bottles that open a review", async ({ page }) => {
  await seed(page, {
    levels: { [FIRST]: { stars: 3, completedAt: 1 } },
    xp: 30,
    reviews: [{ levelId: FIRST, dueAt: Date.now() - DAY }],
    settings,
    seenIntro: true,
  });
  await page.goto("/");
  const bottle = page.getByRole("link", { name: /Botella de marea: repasa «Ponle nombre»/ });
  await expect(bottle).toHaveAttribute("href", `/play/${FIRST}?review=1`);
});

test("settings persist and progress can be erased after confirming", async ({ page }) => {
  await seed(page, {
    levels: { [FIRST]: { stars: 1, completedAt: 1 } },
    xp: 10,
    reviews: [],
    settings,
    seenIntro: true,
  });
  await page.goto("/");
  await expect(page.getByRole("button", { name: /^Nivel 1:/ }).first()).toBeVisible();

  await page.getByRole("button", { name: "Ajustes" }).click();
  const dialog = page.getByRole("dialog", { name: "Ajustes" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("switch", { name: /Sonido/ }).click();
  await dialog.getByLabel("Música").fill("30");
  await dialog.getByRole("switch", { name: /Reducir movimiento/ }).click();
  await dialog.getByRole("button", { name: "Cerrar" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Activar sonido" })).toBeVisible();

  await page.reload();
  const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).state.settings, KEY);
  expect(stored).toMatchObject({ muted: true, musicVolume: 0.3, reducedMotion: true });
  await page.getByRole("button", { name: "Ajustes" }).click();
  await expect(dialog.getByLabel("Música")).toHaveValue("30");
  await expect(dialog.getByRole("switch", { name: /Sonido/ })).toHaveAttribute("aria-checked", "false");

  // Erase needs a second, explicit confirmation; settings survive it.
  await dialog.getByRole("button", { name: "Borrar progreso" }).click();
  await dialog.getByRole("button", { name: "Sí, borrar" }).click();
  await expect(page.getByText("Esta isla no tiene ni nombre. ¡Ponle uno!")).toBeVisible();
  const after = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).state, KEY);
  expect(after.levels).toEqual({});
  expect(after.settings.muted).toBe(true);
});

test("the M key toggles mute on the map", async ({ page }) => {
  await seed(page, { levels: {}, xp: 0, reviews: [], settings, seenIntro: true });
  await page.goto("/");
  // Wait for persisted progress to load before pressing keys.
  await expect(page.getByRole("button", { name: /^Nivel 1:/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Silenciar sonido" })).toBeVisible();
  await page.keyboard.press("m");
  await expect(page.getByRole("button", { name: "Activar sonido" })).toBeVisible();
});

type AxeResult = {
  violations: { id: string; impact: string | null; nodes: { target: string[] }[] }[];
};

test("map and settings have no serious axe violations", async ({ page }) => {
  await seed(page, {
    levels: { [FIRST]: { stars: 2, completedAt: 1 } },
    xp: 20,
    reviews: [{ levelId: FIRST, dueAt: 0 }],
    settings,
    seenIntro: true,
  });
  await page.goto("/");
  await page.getByRole("button", { name: /^Nivel 1:/ }).first().click();
  await page.addScriptTag({ path: path.join(process.cwd(), "node_modules/axe-core/axe.min.js") });
  const run = () =>
    page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (c: Document) => Promise<AxeResult> } }).axe;
      const r = await axe.run(document);
      return r.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    });
  expect(await run()).toEqual([]);
  await page.getByRole("button", { name: "Ajustes" }).click();
  await expect(page.getByRole("dialog", { name: "Ajustes" })).toBeVisible();
  expect(await run()).toEqual([]);
});
