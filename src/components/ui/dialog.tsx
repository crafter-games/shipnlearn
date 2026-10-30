"use client";

import { type ReactNode, useEffect, useRef } from "react";

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
 */
export function Dialog({ open, onClose, labelledBy, children, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && d.open) {
      d.close();
    }
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
