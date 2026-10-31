import type { ComponentType } from "react";
import { Balance, Card, Eye, type IconProps, Question } from "@/components/icons";

/** Every concept card is read as a short sequence of one-screen steps. */
export const STEPS = [
  { id: "que-es", label: "Qué es", Icon: Card },
  { id: "miralo", label: "Míralo", Icon: Eye },
  { id: "cuando", label: "Cuándo sí y cuándo no", Icon: Balance },
  { id: "prueba", label: "Ponte a prueba", Icon: Question },
] as const satisfies readonly { id: string; label: string; Icon: ComponentType<IconProps> }[];

export type StepId = (typeof STEPS)[number]["id"];

export const LAST_STEP = STEPS.length - 1;
