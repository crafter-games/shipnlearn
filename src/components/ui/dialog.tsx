"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Chunky modal built on the native <dialog>: focus trap, Escape to close and
 * inert background come for free. Clicking the backdrop closes it too.
 */
export function Dialog({ open, onClose, title, children, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`m-auto w-[min(92vw,26rem)] rounded-chunk border-[3px] border-ink bg-foam p-0 text-ink shadow-chunky backdrop:bg-ink/60 open:animate-pop ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-sand px-5 py-3">
        <h2 id={titleId} className="font-display text-2xl tracking-wide">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="grid size-10 place-items-center rounded-xl border-[3px] border-ink bg-foam font-display text-xl shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
        >
          ✕
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
