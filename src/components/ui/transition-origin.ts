/**
 * Remembers where a navigation starts so the page transition can zoom from
 * that point: `--vt-old-*` is the point inside the leaving page's box (its
 * snapshot spans the whole page, scrolled or not), `--vt-new-*` the same point
 * on screen for the incoming page, which starts at the top.
 * Without an element, the centre of the screen is used.
 */
export function markTransitionOrigin(el?: Element | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const r = el?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
  const y = r ? r.top + r.height / 2 : window.innerHeight / 2;
  // Routes kept alive by <Activity> stay in the DOM hidden: pick the visible page.
  const visible = [...document.querySelectorAll("[data-page]")].find((p) => p.getClientRects().length > 0);
  const page = (el?.closest("[data-page]") ?? visible)?.getBoundingClientRect();
  root.style.setProperty("--vt-old-x", `${Math.round(x - (page?.left ?? 0))}px`);
  root.style.setProperty("--vt-old-y", `${Math.round(y - (page?.top ?? 0))}px`);
  root.style.setProperty("--vt-new-x", `${Math.round(x)}px`);
  root.style.setProperty("--vt-new-y", `${Math.round(y)}px`);
}
