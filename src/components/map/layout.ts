/**
 * Path geometry shared by nodes, trail dots and Octo. X is a sine offset from
 * the centre, scaled by the CSS variable `--amp` (wider on desktop), so the
 * same numbers work at every width without measuring the DOM.
 */
export const ROW = 150; // px between nodes (tune)
export const TOP = 76; // px from the top of the path to the first node centre
export const BOTTOM = 96; // px after the last node centre (stars + breathing room)

/** -1..1 horizontal offset of the i-th node. */
export const swing = (i: number) => Math.round(Math.sin(i * 0.95 + 0.2) * 100) / 100;

export const nodeTop = (i: number) => TOP + i * ROW;

export const pathHeight = (n: number) => (n === 0 ? 0 : TOP + (n - 1) * ROW + BOTTOM);

/** CSS `left` for a horizontal offset `s` (-1..1). */
export const leftAt = (s: number) => `calc(50% + var(--amp) * ${s})`;
