import type { ButtonHTMLAttributes } from "react";

type Tone = "foam" | "sand" | "ink";

const tones: Record<Tone, string> = {
  foam: "bg-foam text-ink",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-foam",
};

/** Round chunky button for a single glyph. Always pass an aria-label. */
export function IconButton({
  tone = "foam",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; "aria-label": string }) {
  return (
    <button
      type="button"
      {...props}
      className={`relative inline-flex size-11 shrink-0 select-none items-center justify-center rounded-full border-[3px] border-ink font-display text-xl leading-none shadow-chunky-sm transition-[transform,box-shadow] duration-75 active:translate-y-0.5 active:shadow-pressed ${tones[tone]} ${className}`}
    />
  );
}
