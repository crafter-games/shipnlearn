"use client";

import { Fragment, useMemo } from "react";
import { blankWidth, parseFill } from "@/lib/engine/fill";
import type { FillSpec } from "@/lib/levels/types";

type Props = {
  spec: FillSpec;
  values: string[];
  onChange: (values: string[]) => void;
  onType: () => void;
};

/** Fixed code with inline inputs for every `[[n]]` blank. */
export function FillBoard({ spec, values, onChange, onType }: Props) {
  const parts = useMemo(() => parseFill(spec.template), [spec.template]);
  return (
    <div className="h-full min-h-0 overflow-auto p-4">
      <pre className="whitespace-pre-wrap font-mono text-base leading-[2.4] text-foam" data-testid="fill-board">
        {parts.map((p, i) =>
          p.kind === "text" ? (
            <Fragment key={i}>{p.text}</Fragment>
          ) : (
            <input
              key={i}
              value={values[p.index] ?? ""}
              placeholder={spec.placeholders[p.index] ?? ""}
              aria-label={`Hueco ${p.index + 1}${spec.placeholders[p.index] ? ` (p. ej. ${spec.placeholders[p.index]})` : ""}`}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => {
                const next = [...values];
                next[p.index] = e.target.value;
                onChange(next);
                onType();
              }}
              style={{
                // border-box: add padding + borders on top of the text width.
                width: `calc(${blankWidth(values[p.index] ?? "", spec.placeholders[p.index])}ch + 18px)`,
              }}
              className="mx-0.5 rounded-lg border-[3px] border-sand bg-ink-soft px-1.5 py-0.5 font-mono text-base text-sand placeholder:text-foam/40 focus:border-lime focus:outline-none"
            />
          ),
        )}
      </pre>
    </div>
  );
}
