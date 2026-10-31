import type { ComponentType } from "react";
import type { AvatarId } from "@/lib/levels/types";
import { Hogaza, Migas } from "./npcs/bakers";
import { Bruno, DjMarea, Nieve, Rosa, Tablas, Tula } from "./npcs/crafts";
import { Anselmo, Anzuelo } from "./npcs/fishers";
import { Faustino, Lumi } from "./npcs/keepers";
import { Buho, Tinta } from "./npcs/library";
import { Cifras, Marisol } from "./npcs/market";
import { OctoPortrait } from "./npcs/octo-portrait";
import type { PortraitProps } from "./npcs/parts";
import { Brea, Pinzas, Remedios, Sello } from "./npcs/town";
import { Escuadra, Pixel } from "./npcs/workshop";

type Props = { id: AvatarId; className?: string };

/** Round initial on a coloured disc, for islanders not drawn yet. */
function Placeholder(letter: string, fill: string): ComponentType<PortraitProps> {
  function PlaceholderPortrait({ className = "" }: PortraitProps) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden className={className}>
        <circle cx="32" cy="32" r="29" fill={fill} stroke="var(--color-ink)" strokeWidth="3" />
        <text x="32" y="42" textAnchor="middle" fontSize="28" fontFamily="var(--font-display)" fill="var(--color-ink)">
          {letter}
        </text>
      </svg>
    );
  }
  return PlaceholderPortrait;
}

/** Every AvatarId must have a portrait: TypeScript flags a missing one here. */
const PORTRAITS: Record<AvatarId, ComponentType<PortraitProps>> = {
  octo: OctoPortrait,
  hogaza: Hogaza,
  migas: Migas,
  anselmo: Anselmo,
  anzuelo: Anzuelo,
  faustino: Faustino,
  lumi: Lumi,
  brea: Brea,
  tinta: Tinta,
  buho: Buho,
  sello: Sello,
  pinzas: Pinzas,
  remedios: Remedios,
  rosa: Rosa,
  bruno: Bruno,
  "dj-marea": DjMarea,
  tablas: Tablas,
  nieve: Nieve,
  tula: Tula,
  marisol: Marisol,
  cifras: Cifras,
  escuadra: Escuadra,
  pixel: Pixel,
  // Placeholders until the new islanders are drawn.
  eco: Placeholder("E", "var(--color-ocean-light)"),
  llave: Placeholder("L", "var(--color-ocean-light)"),
  magma: Placeholder("M", "var(--color-sand-deep)"),
  prisma: Placeholder("P", "var(--color-sand-deep)"),
};

export const AVATAR_IDS = Object.keys(PORTRAITS) as AvatarId[];

/** Round head-and-shoulders portrait of an island NPC, drawn as custom SVG. Decorative (aria-hidden). */
export function NpcAvatar({ id, className = "" }: Props) {
  const Portrait = PORTRAITS[id];
  return <Portrait className={className} />;
}
