import { type ReactNode, ViewTransition } from "react";

/**
 * Navigation transition types (passed to `<Link transitionTypes>` or
 * `router.push`). Navigations without a type (browser back, refresh) swap
 * instantly, as do Suspense reveals.
 *
 * - `nav-in`: map → level. The map zooms into the tapped node, the level grows out of it.
 * - `nav-out`: level → map. The level shrinks away, the map settles back.
 * - `nav-next`: level → next level. A sideways slide, like turning a page.
 */
export const NAV_IN = ["nav-in"];
export const NAV_OUT = ["nav-out"];
export const NAV_NEXT = ["nav-next"];

const CLASSES = { "nav-in": "nav-in", "nav-out": "nav-out", "nav-next": "nav-next", default: "none" };

/** Wraps a route's content so it animates when a typed navigation enters or leaves it. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={CLASSES} exit={CLASSES} default="none">
      <div data-page>{children}</div>
    </ViewTransition>
  );
}
