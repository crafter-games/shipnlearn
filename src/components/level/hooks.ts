"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True after hydration; lets client-only state (localStorage drafts) render without mismatches. */
export const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

function subscribeViewport(cb: () => void) {
  const vv = window.visualViewport;
  vv?.addEventListener("resize", cb);
  vv?.addEventListener("scroll", cb);
  return () => {
    vv?.removeEventListener("resize", cb);
    vv?.removeEventListener("scroll", cb);
  };
}

/** Pixels covered by the on-screen keyboard (0 when closed or unsupported). */
export const useKeyboardInset = () =>
  useSyncExternalStore(
    subscribeViewport,
    () => {
      const vv = window.visualViewport;
      return vv ? Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)) : 0;
    },
    () => 0,
  );
