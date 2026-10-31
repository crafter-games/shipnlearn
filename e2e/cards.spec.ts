import { expect, type Locator, type Page, test } from "@playwright/test";
import { allCards, getCard } from "../src/lib/levels/cards";
import { getLevel } from "../src/lib/levels/registry";
import { TIP_IDS } from "../src/components/tutorial/tours";

const KEY = "shipnlearn-progress";
const LEVEL_ID = "html-01-titulo";
const LEVEL = `/play/${LEVEL_ID}`;
const levelCards = getLevel(LEVEL_ID)!.cards.map((id) => getCard(id)!);

// Cards flip in; motion is not under test here.
test.use({ reducedMotion: "reduce" });

/** The step on screen (the one sliding out loses its test id). */
const currentStep = (dialog: Locator) => dialog.getByTestId("card-step");

/** A touch swipe on the card, as pointer events (dx < 0 goes forward). */
async function swipe(page: Page, dx: number) {
  await page.getByTestId("card-step").evaluate((el, dx) => {
    const r = el.getBoundingClientRect();
    const y = r.top + r.height / 2;
    const x = r.left + r.width / 2;
    const fire = (type: string, cx: number) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: "touch", clientX: cx, clientY: y }));
    fire("pointerdown", x);
    fire("pointerup", x + dx);
  }, dx);
}

const seenCards = (page: Page) =>
  page.evaluate((k) => (JSON.parse(localStorage.getItem(k) ?? "{}").state?.seenCards ?? []) as string[], KEY);

async function fresh(page: Page, path: string, state: Record<string, unknown> = {}) {
  await page.goto(path);
  await page.evaluate(
    ([k, s]) => {
      localStorage.clear();
      localStorage.setItem(k, JSON.stringify({ state: s, version: 3 }));
    },
    // Tutorial tips already seen: they have their own spec (tutorial.spec.ts).
    [KEY, { seenTips: TIP_IDS, ...state }] as const,
  );
  await page.reload();
}

test("level 1 opens with its concept cards, a predict question, then the editor", async ({ page }) => {
  expect(levelCards.length).toBeGreaterThan(0);
  await fresh(page, LEVEL);

  const dialog = page.getByRole("dialog", { name: /Ficha nueva/ });
  await expect(dialog).toBeVisible();

  for (const [i, card] of levelCards.entries()) {
    const view = dialog.getByTestId("concept-card");
    await expect(view).toHaveAttribute("data-card", card.id);
    await expect(view.getByRole("heading", { level: 2 })).toHaveText(card.title);
    await expect(dialog.getByTestId("cards-progress")).toHaveText(`Ficha ${i + 1} de ${levelCards.length}`);

    // 1. Qué es: one bite, no example yet.
    await expect(currentStep(dialog)).toHaveAttribute("data-step", "que-es");
    await expect(currentStep(dialog)).toContainText(card.tagline);
    await expect(dialog.getByText("Paso 1 de 4: Qué es")).toBeAttached();
    await expect(view.getByTestId("card-code")).toHaveCount(0);
    await expect(dialog.getByTestId("card-back")).toBeEnabled({ enabled: i > 0 });

    // 2. Míralo: the worked example renders live next to its code.
    await dialog.getByTestId("card-next").click();
    await expect(currentStep(dialog)).toHaveAttribute("data-step", "miralo");
    await expect(dialog.getByRole("heading", { level: 3, name: "Míralo" })).toBeFocused();
    await expect(dialog.getByText("Paso 2 de 4: Míralo")).toBeAttached();
    await expect(view.getByTestId("card-code")).toContainText(card.example.html.trim().split("\n")[0]);
    await expect(view.frameLocator('[data-testid="card-preview"]').locator("body")).not.toBeEmpty();
    await expect(currentStep(dialog)).toContainText(card.exampleNote);

    // «Atrás» and the arrow keys walk the same steps.
    await dialog.getByTestId("card-back").click();
    await expect(currentStep(dialog)).toHaveAttribute("data-step", "que-es");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    // 3. Cuándo sí / cuándo no.
    await expect(currentStep(dialog)).toHaveAttribute("data-step", "cuando");
    for (const t of [...card.use.slice(0, 3), ...card.avoid.slice(0, 2)]) {
      await expect(currentStep(dialog)).toContainText(t);
    }

    // 4. Predict: moving on waits for an answer before a level.
    await dialog.getByTestId("to-predict").click();
    await expect(currentStep(dialog)).toHaveAttribute("data-step", "prueba");
    await expect(dialog.getByTestId("card-next")).toBeDisabled();
    // Pick a wrong option when there is one, so both explanations show.
    const options = dialog.getByTestId("card-predict").getByRole("button");
    const wrong = card.predict.options.findIndex((o) => !o.correct);
    await options.nth(wrong).click();
    await expect(dialog.getByTestId("predict-feedback")).toBeVisible();
    await expect(options.nth(wrong)).toHaveAttribute("data-state", "wrong");
    const right = card.predict.options.findIndex((o) => o.correct);
    await expect(options.nth(right)).toHaveAttribute("data-state", "right");
    await expect(dialog).toContainText(card.predict.options[right].why);

    const last = i === levelCards.length - 1;
    await dialog.getByRole("button", { name: last ? "¡A construir!" : "Siguiente ficha" }).click();
  }

  await expect(page.getByRole("dialog", { name: /Ficha nueva/ })).toHaveCount(0);
  await expect(page.locator(".cm-content")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.querySelectorAll("dialog:modal").length)).toBe(0);
  expect(await seenCards(page)).toEqual(expect.arrayContaining(levelCards.map((c) => c.id)));

  // Seen once: the level now opens straight into the editor.
  await page.reload();
  await expect(page.locator("[data-check]").first()).toBeVisible();
  await expect(page.getByRole("dialog", { name: /Ficha nueva/ })).toHaveCount(0);

  // «Fichas» in the header reopens them, without blocking.
  await page.getByTestId("open-cards").click();
  const again = page.getByTestId("cards-dialog");
  await expect(again).toHaveAttribute("data-mode", "browse");
  await expect(again.getByTestId("concept-card")).toHaveAttribute("data-card", levelCards[0].id);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("cards-dialog")).toHaveCount(0);
});

test("«Saltar» skips the cards and still counts them as seen", async ({ page }) => {
  await fresh(page, LEVEL);
  await page.getByRole("dialog", { name: /Ficha nueva/ }).getByRole("button", { name: "Saltar" }).click();
  await expect(page.getByTestId("cards-dialog")).toHaveCount(0);
  await expect(page.locator(".cm-content")).toBeVisible();
  expect(await seenCards(page)).toEqual(expect.arrayContaining(levelCards.map((c) => c.id)));
});

test("the first hint links to the level's cards", async ({ page }) => {
  await fresh(page, LEVEL, { seenCards: allCards.map((c) => c.id) });
  await page.getByRole("button", { name: /Pistas/ }).click();
  await page.getByRole("button", { name: "Ver la primera pista" }).click();
  await page.getByRole("button", { name: /Ver ficha/ }).click();
  await expect(page.getByTestId("cards-dialog").getByTestId("concept-card")).toHaveAttribute(
    "data-card",
    levelCards[0].id,
  );
});

test("the Fichero shows seen cards and locked silhouettes", async ({ page }) => {
  // Nothing seen yet: every card is locked, and says where it unlocks.
  await fresh(page, "/", { seenIntro: true });
  await page.getByTestId("hud-fichero").click();
  await expect(page).toHaveURL(/\/fichero/);
  await expect(page.getByTestId("fichero-count")).toContainText(`0 / ${allCards.length}`);
  await expect(page.getByTestId("fichero-locked")).toHaveCount(allCards.length);
  await expect(page.locator(`[data-testid="fichero-locked"][data-card="${levelCards[0].id}"]`)).toContainText(
    "Se desbloquea en el nivel 1",
  );

  // Level 1's cards seen: they turn face up and open in the viewer.
  await fresh(page, "/fichero", { seenIntro: true, seenCards: levelCards.map((c) => c.id) });
  await expect(page.getByTestId("fichero-count")).toContainText(`${levelCards.length} / ${allCards.length}`);
  await expect(page.getByTestId("fichero-locked")).toHaveCount(allCards.length - levelCards.length);
  const card = page.getByTestId("fichero-card").first();
  await expect(card).toContainText(levelCards[0].title);
  await card.click();
  const dialog = page.getByTestId("cards-dialog");
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(levelCards[0].title);
  await expect(currentStep(dialog)).toHaveAttribute("data-step", "que-es");

  // Every step is reachable: swipes walk them, the pips jump straight to one.
  await swipe(page, -120);
  await expect(currentStep(dialog)).toHaveAttribute("data-step", "miralo");
  await swipe(page, 120);
  await expect(currentStep(dialog)).toHaveAttribute("data-step", "que-es");
  await dialog.getByRole("button", { name: "Paso 4 de 4: Ponte a prueba" }).click();
  await expect(currentStep(dialog)).toHaveAttribute("data-step", "prueba");
  await expect(dialog.getByRole("button", { name: "Paso 4 de 4: Ponte a prueba" })).toHaveAttribute(
    "aria-current",
    "step",
  );

  // Optional practice: answering works and can be retried.
  await dialog.getByTestId("card-predict").getByRole("button").first().click();
  await expect(dialog.getByTestId("predict-feedback")).toBeVisible();
  await dialog.getByRole("button", { name: "Otra vez" }).click();
  await expect(dialog.getByTestId("predict-feedback")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Cerrar ficha" }).click();
  await expect(page.getByTestId("cards-dialog")).toHaveCount(0);

  // No horizontal scroll at any width.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
