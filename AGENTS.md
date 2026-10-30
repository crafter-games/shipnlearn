<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ShipNLearn

Gamified web to learn HTML and CSS by building. Design source of truth: `GDD.md`.

## Commands

- `pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint`
- `pnpm test` (Vitest, `src/**/*.test.ts`) · `pnpm test:e2e` (Playwright, desktop + Pixel 7)
- `/dev/verify` runs every level's solution against its checks; `e2e/levels.spec.ts` asserts it.

## Architecture

- `src/lib/levels/types.ts` — level contract. Levels are data; checks measure the rendered DOM, computed styles and geometry, never the source text (except "forbid" rules).
- `src/lib/levels/checks.ts` — shared check helpers. `src/lib/levels/registry.ts` — world order.
- `src/content/<world>/` — one file per level, `index.ts` exports the `World`.
- `src/lib/engine/` — preview srcdoc + check runner + star rating.
- `src/lib/progress/store.ts` — zustand persisted progress (stars, XP, reviews, settings).
- `src/lib/audio/index.ts` — audio contract; callers only use its exported functions.
- `src/components/ui/` — chunky primitives. Use theme tokens (`bg-ocean`, `border-ink`, `shadow-chunky`, `font-display`…), never raw hex.

## Conventions

- UI copy in Spanish, code and comments in English.
- Mobile first and desktop first: verify at 390px and 1280px.
- Respect `prefers-reduced-motion`. Errors never rely on colour alone.
- Feedback explains WHY (`Check.explain`), never just "wrong". No punishment for failing.
- Atomic commits with conventional messages (`feat(engine): …`). One concern per commit.
