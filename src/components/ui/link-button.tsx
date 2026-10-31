import Link from "next/link";
import type { ComponentProps } from "react";

/** A Next <Link> dressed as the chunky primary button (navigation, not action). */
export function LinkButton({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`inline-flex h-12 select-none items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-lime px-6 font-display text-xl tracking-wide text-ink shadow-chunky transition-[translate,scale,box-shadow] duration-100 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_7px_0_0_var(--color-ink)] active:translate-y-1 active:scale-[0.97] active:shadow-pressed active:duration-75 ${className}`}
    />
  );
}
