"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

/**
 * Accessible modal built on the native <dialog>: showModal() gives a focus
 * trap, inert background, Escape to close and focus restoration for free.
 * The element marked `data-autofocus` receives focus on open.
 *
 * Next.js hides routes with <Activity> instead of unmounting them. A modal
 * <dialog> stays in the top layer even under display:none and makes the
 * visible page inert, so the cleanup closes it when the page is hidden.
 */
export function Dialog({ open, onClose, labelledBy, children, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const d = ref.current;
    if (!d || !open) return;
    if (!d.open) d.showModal();
    d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog box itself, outside the content).
        if (e.target === e.currentTarget) onClose();
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[min(100vw-2rem,30rem)] overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-[2px] ${className}`}
    >
      {open && children}
    </dialog>
  );
}
