"use client";

import { useKeyboardInset } from "./hooks";

/** Below this many px the "keyboard" is just browser chrome noise. */
export const KEYBOARD_MIN = 80;

const KEYS = ["<", ">", "/", "=", '"', "{", "}", ":", ";", "(", ")", "#"];

type Props = {
  visible: boolean;
  /** CSS `bottom` when no on-screen keyboard is open (sits above the Ship bar). */
  restingBottom: string;
  onKey: (text: string) => void;
  onDone: () => void;
};

/**
 * Mobile-only row of the symbols that are buried in phone keyboards,
 * pinned above the on-screen keyboard (or above Ship when there is none).
 * Buttons don't steal focus,
 * so the keyboard stays open.
 */
export function QuickKeys({ visible, restingBottom, onKey, onDone }: Props) {
  const inset = useKeyboardInset();
  if (!visible) return null;
  const keep = (e: React.PointerEvent | React.MouseEvent) => e.preventDefault();
  return (
    <div
      role="toolbar"
      aria-label="Teclas rápidas"
      style={{ bottom: inset > KEYBOARD_MIN ? inset : restingBottom }}
      className="fixed inset-x-0 z-40 flex items-center gap-1.5 border-t-[3px] border-ink bg-ink-soft px-2 py-2 md:hidden"
    >
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none]">
        <QuickKey label="Tab" text="  " aria="Tabulador" onKey={onKey} keep={keep} wide />
        {KEYS.map((k) => (
          <QuickKey key={k} label={k} text={k} onKey={onKey} keep={keep} />
        ))}
      </div>
      <button
        type="button"
        onPointerDown={keep}
        onMouseDown={keep}
        onClick={onDone}
        className="h-10 shrink-0 rounded-xl border-[3px] border-ink bg-sand px-3 font-display text-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
      >
        Listo
      </button>
    </div>
  );
}

function QuickKey({
  label,
  text,
  aria,
  wide,
  onKey,
  keep,
}: {
  label: string;
  text: string;
  aria?: string;
  wide?: boolean;
  onKey: (t: string) => void;
  keep: (e: React.PointerEvent | React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      aria-label={aria ?? `Escribir ${label}`}
      onPointerDown={keep}
      onMouseDown={keep}
      onClick={() => onKey(text)}
      className={`h-10 shrink-0 rounded-xl border-[3px] border-ink bg-foam font-mono text-lg font-bold text-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed ${wide ? "px-3 text-base" : "w-10"}`}
    >
      {label}
    </button>
  );
}
