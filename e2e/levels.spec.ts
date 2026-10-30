import { expect, test } from "@playwright/test";

test("every level solution passes its checks and its starter does not", async ({ page }) => {
  await page.goto("/dev/verify");
  await page.waitForFunction(() => window.__verify?.done === true, null, { timeout: 120_000 });
  const rows = await page.evaluate(() => window.__verify!.rows);
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    expect.soft(row.failing, `${row.id} solution fails checks`).toEqual([]);
    expect.soft(row.starterPasses, `${row.id} starter already passes`).toBe(false);
  }
});

test("first level is playable from the map", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Ponle nombre/ }).click();
  await expect(page).toHaveURL(/\/play\/html-01-titulo/);
});
