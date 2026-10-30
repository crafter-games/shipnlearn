"use client";

import { useMemo, useRef, useState } from "react";
import { Monitor } from "@/components/icons";
import { buildSrcdoc } from "@/lib/engine/preview";
import type { LevelFiles } from "@/lib/levels/types";

const MIN_H = 96;
const MAX_H = 340;

/** Live, non-interactive render of a card example, sized to its content. */
export function ExamplePreview({ files, title }: { files: LevelFiles; title: string }) {
  const srcdoc = useMemo(() => buildSrcdoc(files), [files]);
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(140);

  const measure = () => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    const h = Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight ?? 0);
    setHeight(Math.min(MAX_H, Math.max(MIN_H, h)));
  };

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border-[3px] border-ink bg-white">
      <p className="flex items-center gap-1.5 border-b-[3px] border-ink bg-ocean-light px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">
        <Monitor className="size-4" />
        Resultado
        <span aria-hidden className="ml-auto flex gap-1">
          <span className="size-2 rounded-full border-2 border-ink bg-coral" />
          <span className="size-2 rounded-full border-2 border-ink bg-sand" />
          <span className="size-2 rounded-full border-2 border-ink bg-lime" />
        </span>
      </p>
      <iframe
        ref={ref}
        title={`Resultado del ejemplo: ${title}`}
        sandbox="allow-same-origin"
        srcDoc={srcdoc}
        onLoad={measure}
        tabIndex={-1}
        style={{ height }}
        className="pointer-events-none block w-full bg-white"
        data-testid="card-preview"
      />
    </div>
  );
}
