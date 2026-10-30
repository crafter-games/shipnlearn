import Link from "next/link";
import type { ComponentProps } from "react";

/** A Next <Link> dressed as the chunky primary button (navigation, not action). */
export function LinkButton({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`inline-flex h-12 select-none items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-lime px-6 font-display text-xl tracking-wide text-ink shadow-chunky transition-[transform,box-shadow] duration-75 active:translate-y-1 active:shadow-pressed ${className}`}
    />
  );
}
