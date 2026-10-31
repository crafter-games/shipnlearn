"use client";

import { JumpArc, MiniIsland } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TitledDialog } from "@/components/ui/titled-dialog";
import type { World } from "@/lib/levels/types";

type Props = {
  world: World;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/** "Saltar a esta isla": a short confirmation before opening a world's first level. */
export function JumpDialog({ world, open, onClose, onConfirm }: Props) {
  return (
    <TitledDialog open={open} onClose={onClose} title={`Saltar a ${world.title}`}>
      <div className="flex items-center gap-4">
        <MiniIsland accent={world.accent} className="size-16" />
        <p className="text-lg font-bold leading-snug">
          ¿Ya sabes lo de antes? Empieza aquí.
          <br />
          <span className="font-semibold text-ink-soft">Podrás volver cuando quieras.</span>
        </p>
      </div>
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Mejor no
        </Button>
        <Button data-autofocus onClick={onConfirm}>
          <JumpArc className="size-6" />
          Saltar a la isla
        </Button>
      </div>
    </TitledDialog>
  );
}
