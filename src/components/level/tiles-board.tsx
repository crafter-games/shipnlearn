"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { useMemo } from "react";
import { Grip } from "@/components/icons";
import { playSfx } from "@/lib/audio";
import { makeTiles, moveItem, shuffleTiles, type Tile } from "@/lib/engine/tiles";
import type { TilesSpec } from "@/lib/levels/types";

type Props = {
  spec: TilesSpec;
  seed: string;
  placed: string[];
  onChange: (placed: string[]) => void;
};

/**
 * Parsons board: tap a tile in the bank to add it to your code, tap it in
 * your code to send it back, drag the handle (or Arrow keys) to reorder.
 */
export function TilesBoard({ spec, seed, placed, onChange }: Props) {
  const tiles = useMemo(() => shuffleTiles(makeTiles(spec), seed), [spec, seed]);
  const byId = useMemo(() => new Map(tiles.map((t) => [t.id, t])), [tiles]);
  const placedTiles = placed.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []));
  const bank = tiles.filter((t) => !placed.includes(t.id));

  const add = (id: string) => {
    playSfx("ui-tap");
    onChange([...placed, id]);
  };
  const remove = (id: string) => {
    playSfx("ui-tap");
    onChange(placed.filter((p) => p !== id));
  };
  const move = (id: string, delta: number) => {
    const i = placed.indexOf(id);
    onChange(moveItem(placed, i, i + delta));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-3">
      <section aria-labelledby="tiles-code" className="space-y-1.5">
        <h3 id="tiles-code" className="font-display text-sm tracking-wide text-sand">
          Tu código <span className="font-sans text-xs font-bold text-foam/70">· toca para quitar, arrastra <Grip className="inline size-3.5 align-[-2px]" /> para ordenar</span>
        </h3>
        {spec.before && <FixedCode code={spec.before} />}
        <Reorder.Group
          axis="y"
          values={placed}
          onReorder={onChange}
          className="flex min-h-16 flex-col gap-2 rounded-2xl border-[3px] border-dashed border-foam/30 p-2"
          data-testid="tiles-placed"
        >
          {placedTiles.map((t) => (
            <PlacedTile key={t.id} tile={t} onRemove={remove} onMove={move} />
          ))}
          {placedTiles.length === 0 && (
            <li className="list-none px-2 py-3 text-center text-sm font-bold text-foam/70">
              Toca las fichas de abajo para construir tu código
            </li>
          )}
        </Reorder.Group>
        {spec.after && <FixedCode code={spec.after} />}
      </section>

      <section aria-labelledby="tiles-bank" className="space-y-1.5">
        <h3 id="tiles-bank" className="font-display text-sm tracking-wide text-sand">
          Fichas <span className="font-sans text-xs font-bold text-foam/70">· ojo: alguna sobra</span>
        </h3>
        <ul className="flex flex-wrap gap-2" data-testid="tiles-bank">
          <AnimatePresence initial={false}>
            {bank.map((t) => (
              <motion.li
                key={t.id}
                layout
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <button
                  type="button"
                  onClick={() => add(t.id)}
                  aria-label={`Añadir línea: ${t.text.trim()}`}
                  className="min-h-11 whitespace-pre rounded-xl border-[3px] border-ink bg-foam px-3 py-1.5 text-left font-mono text-base text-ink shadow-chunky-sm transition-transform duration-75 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-pressed"
                >
                  {t.text}
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {bank.length === 0 && (
            <li className="text-sm font-bold text-foam/70">¡Has usado todas las fichas!</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function PlacedTile({
  tile,
  onRemove,
  onMove,
}: {
  tile: Tile;
  onRemove: (id: string) => void;
  onMove: (id: string, delta: number) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={tile.id}
      dragListener={false}
      dragControls={controls}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileDrag={{ scale: 1.04, rotate: -1 }}
      className="flex items-stretch rounded-xl border-[3px] border-ink bg-sand shadow-chunky-sm"
    >
      <span
        aria-hidden
        onPointerDown={(e) => controls.start(e)}
        className="flex w-9 shrink-0 cursor-grab touch-none items-center justify-center border-r-[3px] border-ink text-ink active:cursor-grabbing"
      >
        <Grip className="size-5" />
      </span>
      <button
        type="button"
        onClick={() => onRemove(tile.id)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            onMove(tile.id, e.key === "ArrowUp" ? -1 : 1);
          }
        }}
        aria-label={`Quitar línea: ${tile.text.trim()}. Flechas arriba y abajo para mover`}
        className="min-h-11 min-w-0 flex-1 overflow-x-auto whitespace-pre px-3 py-1.5 text-left font-mono text-base text-ink"
      >
        {tile.text}
      </button>
    </Reorder.Item>
  );
}

function FixedCode({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto px-2 font-mono text-base text-foam/60" aria-label="Código fijo">
      {code.replace(/^\n+|\n+$/g, "")}
    </pre>
  );
}
