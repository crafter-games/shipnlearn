import type { AvatarId } from "@/lib/levels/types";
import { Octo } from "./octo";

type Props = { id: AvatarId; className?: string };

/**
 * Round portrait of an island NPC, drawn as custom SVG.
 * Placeholder: Octo is real, the rest show a chunky initial until drawn.
 */
export function NpcAvatar({ id, className = "" }: Props) {
  if (id === "octo") return <Octo className={className} />;
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <circle cx="32" cy="32" r="29" fill="var(--color-sand)" stroke="var(--color-ink)" strokeWidth="3" />
      <text x="32" y="42" textAnchor="middle" fontSize="28" fontFamily="var(--font-display)" fill="var(--color-ink)">
        {id[0].toUpperCase()}
      </text>
    </svg>
  );
}
