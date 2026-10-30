import type { HTMLAttributes } from "react";

/** Card surface with the chunky ink border and drop shadow. */
export function Panel({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`rounded-chunk border-[3px] border-ink bg-foam shadow-chunky ${className}`}
    />
  );
}
