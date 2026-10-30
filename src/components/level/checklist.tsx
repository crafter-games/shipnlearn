"use client";

import { motion, useAnimate } from "motion/react";
import { type Ref, useEffect } from "react";
import type { AxeReport } from "@/lib/engine/axe";
import type { CheckResult } from "@/lib/engine/run-checks";

type Props = {
  results: CheckResult[] | null;
  axe: AxeReport | null;
  hintsUsed: number;
  /** After the first Ship, failing lines show why. Before, they stay neutral. */
  revealed: boolean;
  /** Bumps on every pass transition so the line pops. */
  pops: Record<string, number>;
  shakeKey: number;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

type State = "pass" | "fail" | "todo";

/** Live goals, grouped by the star each one unlocks. */
export function Checklist({ results, axe, hintsUsed, revealed, pops, shakeKey, className = "", ref }: Props) {
  const required = results?.filter((r) => r.kind === "required") ?? [];
  const a11y = results?.filter((r) => r.kind === "a11y") ?? [];
  const state = (pass: boolean): State => (pass ? "pass" : revealed ? "fail" : "todo");
  const [scope, animate] = useAnimate<HTMLElement>();

  useEffect(() => {
    // Gentle horizontal nudge on a failed Ship. MotionConfig drops it for reduced motion.
    if (shakeKey && scope.current) {
      void animate(scope.current, { x: [0, -6, 6, -6, 6, 0] }, { duration: 0.25 });
    }
  }, [shakeKey, animate, scope]);

  return (
    <div ref={ref} className={`scroll-mt-20 ${className}`}>
    <section
      ref={scope}
      aria-labelledby="checklist-title"
      className="rounded-chunk border-[3px] border-ink bg-foam p-3 shadow-chunky"
      data-testid="checklist"
    >
      <h2 id="checklist-title" className="mb-2 font-display text-lg tracking-wide">
        Objetivos
      </h2>
      {!results ? (
        <p className="text-sm font-bold text-ink-soft">Preparando la vista previa…</p>
      ) : (
        <div className="space-y-3">
          <Group stars={1} title="Para lanzar">
            {required.map((r) => (
              <Line key={r.id} id={r.id} label={r.label} explain={r.explain} state={state(r.pass)} pop={pops[r.id]} />
            ))}
          </Group>
          <Group stars={2} title="Accesible">
            {a11y.map((r) => (
              <Line key={r.id} id={r.id} label={r.label} explain={r.explain} state={state(r.pass)} pop={pops[r.id]} />
            ))}
            {axe?.ran &&
              (axe.issues.length === 0 ? (
                <Line id="axe" label="Sin errores graves de accesibilidad" state="pass" pop={pops.axe} />
              ) : (
                axe.issues.map((i) => (
                  <Line
                    key={i.id}
                    id={`axe-${i.id}`}
                    label={i.message}
                    explain={i.count > 1 ? `Pasa en ${i.count} elementos.` : undefined}
                    state={revealed ? "fail" : "todo"}
                    alwaysExplain
                  />
                ))
              ))}
          </Group>
          <Group stars={3} title="Por tu cuenta">
            <Line
              id="no-hints"
              label="Sin usar pistas"
              explain="Usaste una pista: no pasa nada, solo deja la ⭐⭐⭐ para la próxima."
              state={hintsUsed === 0 ? "pass" : "fail"}
            />
          </Group>
        </div>
      )}
    </section>
    </div>
  );
}

function Group({ stars, title, children }: { stars: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ink-soft">
        <span aria-hidden>{"⭐".repeat(stars)}</span>
        <span>
          <span className="sr-only">{stars} {stars === 1 ? "estrella" : "estrellas"}: </span>
          {title}
        </span>
      </h3>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

const ICON: Record<State, { glyph: string; cls: string; sr: string }> = {
  pass: { glyph: "✓", cls: "bg-lime text-ink", sr: "Cumplido" },
  fail: { glyph: "✗", cls: "bg-coral text-foam", sr: "Falta" },
  todo: { glyph: "", cls: "bg-foam text-ink", sr: "Pendiente" },
};

function Line({
  id,
  label,
  explain,
  state,
  pop,
  alwaysExplain,
}: {
  id: string;
  label: string;
  explain?: string;
  state: State;
  pop?: number;
  alwaysExplain?: boolean;
}) {
  const icon = ICON[state];
  const showExplain = explain && (state === "fail" || (alwaysExplain && state !== "pass"));
  return (
    <li
      data-check={id}
      data-state={state}
      className={`flex items-start gap-2 rounded-xl px-1.5 py-1 ${state === "fail" ? "bg-coral/15" : ""}`}
    >
      <motion.span
        key={pop}
        initial={pop ? { scale: 0.6 } : false}
        animate={{ scale: [0.6, 1.25, 1] }}
        transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
        aria-hidden
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-sm font-black leading-none ${icon.cls}`}
      >
        {icon.glyph}
      </motion.span>
      <div className="min-w-0">
        <p className="text-[15px] font-bold leading-snug text-ink">
          <span className="sr-only">{icon.sr}: </span>
          {label}
        </p>
        {showExplain && <p className="mt-0.5 text-sm font-semibold text-ink-soft">{explain}</p>}
      </div>
    </li>
  );
}
