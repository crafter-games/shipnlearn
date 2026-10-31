import type { ComponentType } from "react";
import { type IconProps, KindAttribute, KindConcept, KindElement, KindProperty, KindSelector } from "@/components/icons";
import type { ConceptCard } from "@/lib/levels/types";

export const KIND: Record<ConceptCard["kind"], { label: string; Icon: ComponentType<IconProps> }> = {
  element: { label: "Elemento", Icon: KindElement },
  attribute: { label: "Atributo", Icon: KindAttribute },
  property: { label: "Propiedad", Icon: KindProperty },
  selector: { label: "Selector", Icon: KindSelector },
  concept: { label: "Concepto", Icon: KindConcept },
};

export function KindBadge({
  kind,
  compact = false,
  className = "",
}: {
  kind: ConceptCard["kind"];
  /** Icon only (the label stays for assistive tech). */
  compact?: boolean;
  className?: string;
}) {
  const { label, Icon } = KIND[kind];
  if (compact)
    return (
      <span className={`grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-ink text-foam ${className}`}>
        <Icon className="size-4" />
        <span className="sr-only">{label}</span>
      </span>
    );
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 border-ink bg-ink px-2 py-0.5 font-display text-xs uppercase tracking-[0.12em] text-foam ${className}`}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
