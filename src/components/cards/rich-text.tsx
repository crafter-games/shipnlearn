import type { ReactNode } from "react";

/** HTML tags written in card copy ("<h1>", "</p>", "<a href>") become code chips. */
const TAG = /(<\/?[a-zA-Z][\w-]*(?:\s[^<>]*)?>)/g;

export function RichText({ text, chip = "bg-ink/10" }: { text: string; chip?: string }): ReactNode {
  const parts = text.split(TAG);
  return parts.map((part, i) =>
    i % 2 ? (
      <code key={i} className={`whitespace-nowrap rounded-md px-1 py-px font-mono text-[0.88em] font-bold ${chip}`}>
        {part}
      </code>
    ) : (
      part
    ),
  );
}
