import { expect, type Page, test } from "@playwright/test";

const LEVEL = "/play/html-01-titulo";

async function typeInEditor(page: Page, text: string) {
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(text);
}

test.beforeEach(async ({ page }) => {
  await page.goto(LEVEL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("[data-check]").first()).toBeVisible();
});

test("shipping an empty title explains what is missing, without celebrating", async ({ page }) => {
  await page.getByTestId("ship").click();
  const line = page.locator('[data-check="h1-has-text"]');
  await expect(line).toHaveAttribute("data-state", "fail");
  await expect(line).toContainText("está vacío");
  await expect(page.getByTestId("celebration")).toHaveCount(0);
});

test("plays level 1: write the title, ship it, see three stars", async ({ page }) => {
  await typeInEditor(page, "<h1>Isla Tuya");
  // Auto-close completes the tag; the live checklist lights up.
  await expect(page.locator('[data-check="h1-has-text"]')).toHaveAttribute("data-state", "pass");
  await expect(page.getByTestId("progress-pill")).toContainText("2/2");

  await page.getByTestId("ship").click();
  const dialog = page.getByRole("dialog", { name: /Lanzado/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-stars]")).toHaveAttribute("data-stars", "3");
  await expect(dialog.getByTestId("star-filled")).toHaveCount(3);
  await expect(dialog).toContainText("+30 XP");
  await expect(dialog.getByRole("link", { name: /Mapa/ })).toBeVisible();

  const progress = await page.evaluate(() => localStorage.getItem("shipnlearn-progress"));
  expect(progress).toContain('"html-01-titulo"');
});

test("using a hint caps the level at two stars", async ({ page }) => {
  await page.getByRole("button", { name: /Pistas/ }).click();
  await page.getByRole("button", { name: "Ver la primera pista" }).click();
  await expect(page.getByText("Pista 1")).toBeVisible();
  await page.keyboard.press("Escape");

  await typeInEditor(page, "<h1>Isla Tuya");
  await page.keyboard.press("ControlOrMeta+Enter");
  const dialog = page.getByRole("dialog", { name: /Lanzado/ });
  await expect(dialog.locator("[data-stars]")).toHaveAttribute("data-stars", "2");
  await expect(dialog.getByRole("button", { name: /Mejorar/ })).toBeVisible();
});

test("keeps the draft across reloads and restarts on demand", async ({ page }) => {
  await typeInEditor(page, "<h1>Borrador");
  await expect(page.locator('[data-check="h1-has-text"]')).toHaveAttribute("data-state", "pass");
  await page.reload();
  await expect(page.locator(".cm-content")).toContainText("Borrador");

  await page.getByRole("button", { name: "Reiniciar nivel" }).click();
  await page.getByRole("button", { name: "Reiniciar", exact: true }).click();
  await expect(page.locator(".cm-content")).not.toContainText("Borrador");
});

test("after 'Siguiente nivel' the next level is interactive (no stale modal)", async ({ page }) => {
  await typeInEditor(page, "<h1>Isla Tuya");
  await page.getByTestId("ship").click();
  const dialog = page.getByRole("dialog", { name: /Lanzado/ });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: /Siguiente/ }).click();
  await expect(page).toHaveURL(/html-02/);
  // Nothing may stay modal: the previous page is hidden, not unmounted.
  await expect.poll(() => page.evaluate(() => document.querySelectorAll("dialog:modal").length)).toBe(0);
  const firstTile = page.getByTestId("tiles-bank").getByRole("button").first();
  await firstTile.click({ timeout: 3000 });
  await expect(page.getByTestId("tiles-placed").getByRole("button")).toHaveCount(1);
});

test("the preview shows only the player's page until the target is asked for", async ({ page }) => {
  const target = page.locator('iframe[title="Objetivo"]');
  await expect(page.getByTestId("view-mine")).toHaveAttribute("aria-checked", "true");
  await expect(target).toHaveCount(0);
  await page.getByTestId("view-target").click();
  await expect(target).toHaveCount(1);
  await page.getByTestId("view-compare").click();
  await expect(page.getByLabel("Opacidad del objetivo")).toBeVisible();
});
