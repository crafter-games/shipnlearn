"use client";

import { type ReactNode, useId } from "react";
import { Close } from "@/components/icons";
import { Dialog } from "./dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/** Chunky modal with a sand title bar and a close button, on top of Dialog. */
export function TitledDialog({ open, onClose, title, children, className = "" }: Props) {
  const titleId = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={titleId} className={className}>
      <div className="animate-pop overflow-hidden rounded-chunk border-[3px] border-ink bg-foam shadow-chunky">
        <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-sand px-5 py-3">
          <h2 id={titleId} className="font-display text-2xl tracking-wide">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-10 place-items-center rounded-xl border-[3px] border-ink bg-foam text-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
          >
            <Close className="size-5" />
          </button>
        </div>
        <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto p-5">{children}</div>
      </div>
    </Dialog>
  );
}
