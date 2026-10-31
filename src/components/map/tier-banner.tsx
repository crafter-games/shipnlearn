import { TierBars } from "@/components/icons";
import { type Tier, TIER_BG } from "./world-meta";

/** Ribbon that opens a difficulty tier on the map ("Nivel intermedio"). */
export function TierBanner({ tier, label }: { tier: Tier; label: string }) {
  return (
    <div className="flex items-center gap-4" data-testid="tier-banner">
      <span aria-hidden className="h-2.5 flex-1 rounded-full border-[3px] border-ink bg-foam/80" />
      <div className="relative isolate">
        {/* Folded ribbon tails, tucked behind the plaque. */}
        <span aria-hidden className="absolute top-2.5 -left-4 h-full w-8 rounded-l-lg border-[3px] border-ink bg-ink-soft" />
        <span aria-hidden className="absolute top-2.5 -right-4 h-full w-8 rounded-r-lg border-[3px] border-ink bg-ink-soft" />
        <h2
          className={`relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-2xl border-[3px] border-ink px-5 py-1.5 font-display text-2xl tracking-wide text-ink shadow-chunky md:text-3xl ${TIER_BG[tier]}`}
        >
          <TierBars tier={tier} className="size-7" />
          {label}
        </h2>
      </div>
      <span aria-hidden className="h-2.5 flex-1 rounded-full border-[3px] border-ink bg-foam/80" />
    </div>
  );
}
