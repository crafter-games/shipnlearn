/** Chunky star icon. `filled=false` draws an empty slot. Decorative by default. */
export function Star({
  filled = true,
  className = "size-5",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
        fill={filled ? "var(--color-sand)" : "var(--color-ink-soft)"}
        stroke="var(--color-ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {filled && (
        <path
          d="M8.6 9.6l2-.3 1-2.1"
          fill="none"
          stroke="var(--color-foam)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}
    </svg>
  );
}
