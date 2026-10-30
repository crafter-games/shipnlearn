import type { ComponentType } from "react";
import type { AvatarId } from "@/lib/levels/types";
import { Hogaza, Migas } from "./npcs/bakers";
import { Bruno, DjMarea, Nieve, Rosa, Tablas, Tula } from "./npcs/crafts";
import { Anselmo, Anzuelo } from "./npcs/fishers";
import { Faustino, Lumi } from "./npcs/keepers";
import { Buho, Tinta } from "./npcs/library";
import { OctoPortrait } from "./npcs/octo-portrait";
import type { PortraitProps } from "./npcs/parts";
import { Brea, Pinzas, Remedios, Sello } from "./npcs/town";

type Props = { id: AvatarId; className?: string };

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
};

export const AVATAR_IDS = Object.keys(PORTRAITS) as AvatarId[];

/** Round head-and-shoulders portrait of an island NPC, drawn as custom SVG. Decorative (aria-hidden). */
export function NpcAvatar({ id, className = "" }: Props) {
  const Portrait = PORTRAITS[id];
  return <Portrait className={className} />;
}
