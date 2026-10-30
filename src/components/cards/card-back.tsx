import type { ReactNode } from "react";
import { Island } from "@/components/icons";

/** Wave + dot pattern shared by every card back. */
export const CARD_BACK_STYLE = {
  backgroundColor: "var(--color-ocean-deep)",
  backgroundImage: [
    "radial-gradient(circle at 25% 25%, color-mix(in oklab, var(--color-foam) 22%, transparent) 0 3px, transparent 4px)",
    "radial-gradient(circle at 75% 75%, color-mix(in oklab, var(--color-ocean-light) 30%, transparent) 0 3px, transparent 4px)",
    "repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-ocean) 55%, transparent) 0 8px, transparent 8px 16px)",
  ].join(","),
  backgroundSize: "28px 28px, 28px 28px, auto",
} as const;

/** The back of a collectible card: island emblem on the ocean pattern. */
export function CardBack({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[1.4rem] border-4 border-ink text-center shadow-chunky ${className}`}
      style={CARD_BACK_STYLE}
    >
      <span aria-hidden className="pointer-events-none absolute inset-2 rounded-[1rem] border-2 border-dashed border-foam/40" />
      <span className="relative grid size-16 place-items-center rounded-full border-4 border-ink bg-sand shadow-chunky-sm">
        <Island className="size-11" />
      </span>
      {children}
    </div>
  );
}
