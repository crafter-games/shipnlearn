"use client";

import { MotionConfig } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Document, Hint, Palette, Pencil, Puzzle, Restart, Rocket } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { playSfx, setIntensity, setScene, setWorld, unlockAudio } from "@/lib/audio";
import { type AxeReport, preloadAxe } from "@/lib/engine/axe";
import { buildSrcdoc } from "@/lib/engine/preview";
import { type CheckResult, starsFor } from "@/lib/engine/run-checks";
import { createRunner, type Evaluation } from "@/lib/engine/runner";
import { clearDraft, composeFiles, type Draft, initialDraft, loadDraft, saveDraft } from "@/lib/engine/session";
import { getWorld, nextLevel } from "@/lib/levels/registry";
import type { FileKind, Level } from "@/lib/levels/types";
import { useProgress } from "@/lib/progress/store";
import { Celebration, type CelebrationData } from "./celebration";
import { Checklist } from "./checklist";
import { CodeEditor, type CodeEditorHandle } from "./code-editor";
import { FillBoard } from "./fill-board";
import { HintsDialog } from "./hints-dialog";
import { NpcBubble } from "./npc-bubble";
import { PreviewPane } from "./preview-pane";
import { useKeyboardInset } from "./hooks";
import { KEYBOARD_MIN, QuickKeys } from "./quick-keys";
import { TilesBoard } from "./tiles-board";

const DEBOUNCE_MS = 300; // tune
const KEY_SFX_MS = 70;

const FILE_NAME: Record<FileKind, string> = { html: "index.html", css: "estilos.css" };

/** The playable level: request, editor (code/tiles/fill), live preview, checklist, Ship it. */
/**
 * `review` = a spaced "Marea": start from the starter, never touch the saved
 * draft, and count the review as done on success.
 */
export function LevelGame({ level, review = false }: { level: Level; review?: boolean }) {
  const world = getWorld(level.worldId);
  const levelNumber = (world?.levels.findIndex((l) => l.id === level.id) ?? 0) + 1;
  const next = nextLevel(level.id);

  const [draft, setDraftState] = useState<Draft>(() => (review ? initialDraft(level) : loadDraft(level)));
  // Mirrors `draft` synchronously: a Ctrl+Enter right after a keystroke must
  // ship what was typed, even before React re-renders.
  const draftRef = useRef(draft);
  const setDraft = useCallback((next: Draft | ((d: Draft) => Draft)) => {
    draftRef.current = typeof next === "function" ? next(draftRef.current) : next;
    setDraftState(draftRef.current);
  }, []);
  const files = useMemo(() => composeFiles(level, draft), [level, draft]);
  const filesKey = JSON.stringify(files);
  const editable = level.editable.length ? level.editable : (["html"] as FileKind[]);
  const [activeFile, setActiveFile] = useState<FileKind>(editable[0]);

  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [axe, setAxe] = useState<AxeReport | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [pops, setPops] = useState<Record<string, number>>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [shipping, setShipping] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  // Activity keeps this page mounted but hidden after navigating away: drop
  // transient overlays so coming back shows the level, not a stale modal.
  useLayoutEffect(
    () => () => {
      setCelebration(null);
      setHintsOpen(false);
    },
    [],
  );
  const [restartOpen, setRestartOpen] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);
  // Hide Ship only while an on-screen keyboard actually covers it.
  const keyboardOpen = useKeyboardInset() > KEYBOARD_MIN;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRefs = useRef<Partial<Record<FileKind, CodeEditorHandle | null>>>({});
  const checklistRef = useRef<HTMLDivElement>(null);
  const [runner] = useState(() => createRunner(level));
  const everPassed = useRef<Set<string> | null>(null);
  const lastKeySfx = useRef(0);
  const filesRef = useRef(files);
  const shipRef = useRef<() => void>(() => {});

  const ghostSrcdoc = useMemo(() => buildSrcdoc(level.target ?? level.solution), [level]);

  // Music + audio unlock on the first gesture (autoplay policy).
  useEffect(() => {
    setWorld(level.worldId);
    setIntensity(0);
    setScene("editor");
    preloadAxe();
    const unlock = () => void unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [level.worldId]);

  useEffect(() => {
    if (!review) saveDraft(level.id, draft);
  }, [review, level.id, draft]);

  /** Light up newly-passed lines. The first evaluation is a silent baseline. */
  const apply = useCallback((ev: Evaluation) => {
    const passIds = [
      ...ev.results.filter((r) => r.pass).map((r) => r.id),
      ...(ev.axe.ran && ev.axe.clean ? ["axe"] : []),
    ];
    if (everPassed.current === null) {
      everPassed.current = new Set(passIds);
    } else {
      const seen = everPassed.current;
      const fresh = passIds.filter((id) => !seen.has(id));
      fresh.forEach((id, i) => {
        playSfx("check", { step: seen.size + i });
      });
      fresh.forEach((id) => seen.add(id));
      if (fresh.length) {
        setPops((p) => {
          const out = { ...p };
          for (const id of fresh) out[id] = (out[id] ?? 0) + 1;
          return out;
        });
      }
    }
    // The music opens up as the player gets closer to shipping.
    setIntensity(ev.results.length ? ev.results.filter((r) => r.pass).length / ev.results.length : 0);
    setResults(ev.results);
    setAxe(ev.axe);
  }, []);

  // Live preview + checklist, debounced.
  useEffect(() => {
    filesRef.current = files;
    const t = window.setTimeout(() => {
      void runner.run(iframeRef.current, files).then((ev) => {
        if (ev && filesRef.current === files) apply(ev);
      });
    }, everPassed.current === null ? 0 : DEBOUNCE_MS);
    return () => window.clearTimeout(t);
    // filesKey captures `files` by value; re-running on identity alone would double-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesKey, runner, apply]);

  const ship = useCallback(async () => {
    if (shipping || celebration) return;
    void unlockAudio();
    setShipping(true);
    const latest = draftRef.current;
    const ev = await runner.run(iframeRef.current, composeFiles(level, latest), { axe: true });
    setShipping(false);
    if (!ev) return;
    apply(ev);
    setRevealed(true);
    const stars = starsFor(ev.results, { hintsUsed: latest.hintsUsed, axeClean: ev.axe.clean });
    if (stars === 0) {
      playSfx("error");
      setShakeKey((k) => k + 1);
      if (window.matchMedia("(max-width: 1023px)").matches) {
        checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    const progress = useProgress.getState();
    if (review) progress.completeReview(level.id);
    const res = progress.completeLevel(level.id, stars);
    playSfx("ship");
    setScene("celebrate");
    setCelebration({ stars, ...res });
  }, [shipping, celebration, runner, apply, level, review]);

  useEffect(() => {
    shipRef.current = () => void ship();
  }, [ship]);

  const openHints = useCallback(() => {
    playSfx("ui-tap");
    setHintsOpen(true);
  }, []);

  // Global shortcuts (CodeMirror handles its own and marks them handled).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || !(e.metaKey || e.ctrlKey)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        shipRef.current();
      } else if (e.key.toLowerCase() === "h") {
        e.preventDefault();
        openHints();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openHints]);

  /** Throttled typing tick (called from editor/input change events). */
  const typed = useCallback(() => {
    const now = performance.now();
    if (now - lastKeySfx.current > KEY_SFX_MS) {
      lastKeySfx.current = now;
      playSfx("key");
    }
  }, []);

  const restart = () => {
    playSfx("ui-tap");
    clearDraft(level.id);
    // Hints already seen can't be unseen.
    setDraft((d) => ({ ...initialDraft(level), hintsUsed: d.hintsUsed }));
    setRevealed(false);
    setRestartOpen(false);
  };

  const required = results?.filter((r) => r.kind === "required") ?? [];
  const passedRequired = required.filter((r) => r.pass).length;

  const editorPanel = (
    <section
      aria-label="Editor"
      className="flex min-h-[46dvh] flex-col overflow-hidden rounded-chunk border-[3px] border-ink bg-ink shadow-chunky md:min-h-[60dvh] lg:min-h-0 lg:flex-1"
    >
      <div className="flex items-center gap-1 border-b-[3px] border-ink bg-ink-soft px-2 pt-2" role={level.mode === "code" && editable.length > 1 ? "tablist" : undefined}>
        {level.mode === "code" ? (
          editable.map((f) => (
            <button
              key={f}
              type="button"
              role={editable.length > 1 ? "tab" : undefined}
              aria-selected={editable.length > 1 ? activeFile === f : undefined}
              onClick={() => {
                playSfx("ui-tap");
                setActiveFile(f);
              }}
              className={`-mb-[3px] flex items-center gap-1.5 rounded-t-xl border-[3px] border-b-0 border-ink px-3 py-1.5 font-mono text-sm font-bold ${activeFile === f ? "bg-ink text-sand" : "bg-ink-soft text-foam/70"}`}
            >
              {f === "html" ? <Document className="size-4.5" /> : <Palette className="size-4.5" />}
              {FILE_NAME[f]}
            </button>
          ))
        ) : (
          <span className="-mb-[3px] flex items-center gap-1.5 rounded-t-xl border-[3px] border-b-0 border-ink bg-ink px-3 py-1.5 font-display text-sm tracking-wide text-sand">
            {level.mode === "tiles" ? <Puzzle className="size-5" /> : <Pencil className="size-5" />}
            {level.mode === "tiles" ? "Ordena las fichas" : "Rellena los huecos"}
          </span>
        )}
        <span className="ml-auto hidden pb-1.5 text-xs font-bold text-foam/60 lg:inline">
          <kbd className="font-mono">Ctrl</kbd>+<kbd className="font-mono">Enter</kbd> para lanzar
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        {level.mode === "code" &&
          editable.map((f) => (
            <div key={f} className={`absolute inset-0 ${activeFile === f ? "" : "hidden"}`}>
              <CodeEditor
                ref={(h) => {
                  editorRefs.current[f] = h;
                }}
                value={draft.files[f] ?? ""}
                lang={f}
                label={`Código ${f.toUpperCase()}`}
                onChange={(v) => {
                  typed();
                  setDraft((d) => ({ ...d, files: { ...d.files, [f]: v } }));
                }}
                onShip={() => shipRef.current()}
                onHint={openHints}
                onFocusChange={setEditorFocused}
              />
            </div>
          ))}
        {level.mode === "tiles" && level.tiles && (
          <TilesBoard
            spec={level.tiles}
            seed={level.id}
            placed={draft.placed}
            onChange={(placed) => setDraft((d) => ({ ...d, placed }))}
          />
        )}
        {level.mode === "fill" && level.fill && (
          <FillBoard
            spec={level.fill}
            values={draft.values}
            onType={typed}
            onChange={(values) => setDraft((d) => ({ ...d, values }))}
          />
        )}
      </div>
    </section>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
        <header className="flex items-center gap-2 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1 sm:gap-3 sm:px-4">
          <Link
            href="/"
            aria-label="Volver al mapa"
            onClick={() => playSfx("ui-tap")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-foam text-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
          >
            <ArrowLeft className="size-6" />
          </Link>
          <div className="min-w-0 flex-1 leading-none">
            <p className="truncate text-xs font-extrabold uppercase tracking-wider text-foam/90">
              {world?.title} · Nivel {levelNumber}
            </p>
            <h1 className="truncate font-display text-2xl tracking-wide text-foam text-stroke sm:text-3xl">{level.title}</h1>
          </div>
          <IconButton aria-label="Reiniciar nivel" onClick={() => (playSfx("ui-tap"), setRestartOpen(true))}>
            <Restart className="size-6" />
          </IconButton>
          <IconButton aria-label={`Pistas (${draft.hintsUsed} de 3 usadas)`} tone="sand" onClick={openHints}>
            <Hint className="size-7" />
            {draft.hintsUsed > 0 && (
              <span aria-hidden className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border-2 border-ink bg-coral font-sans text-[11px] font-black text-foam">
                {draft.hintsUsed}
              </span>
            )}
          </IconButton>
        </header>

        <main
          className="flex flex-1 flex-col gap-3 px-3 pt-2 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-4 md:grid md:grid-cols-2 md:gap-4 md:pb-4 md:[grid-template-areas:'npc_editor'_'preview_editor'_'checks_editor'] md:[grid-template-rows:auto_auto_1fr] lg:min-h-0 lg:grid-cols-[minmax(17rem,0.75fr)_minmax(0,1.2fr)_minmax(0,1.05fr)] lg:[grid-template-areas:'npc_editor_preview'_'checks_editor_preview'] lg:[grid-template-rows:auto_minmax(0,1fr)]"
        >
          <NpcBubble npc={level.npc} story={level.story} className="md:[grid-area:npc]" />

          <PreviewPane
            iframeRef={iframeRef}
            ghostSrcdoc={ghostSrcdoc}
            passed={passedRequired}
            total={required.length}
            className="h-[42dvh] md:h-[38dvh] md:[grid-area:preview] lg:h-auto"
          />

          <div className="flex flex-col gap-3 md:[grid-area:editor] lg:min-h-0">
            {editorPanel}
            <div
              className={`fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-ocean-deep via-ocean-deep/80 to-transparent px-3 pt-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:bg-none md:p-0 ${editorFocused && keyboardOpen ? "max-md:hidden" : ""}`}
            >
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  playSfx("ui-tap");
                  void ship();
                }}
                aria-busy={shipping}
                aria-keyshortcuts="Control+Enter Meta+Enter"
                data-testid="ship"
              >
                {shipping ? "Comprobando…" : (
                  <>
                    ¡Ship it!
                    <Rocket className="size-8" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="md:[grid-area:checks] lg:min-h-0 lg:overflow-y-auto lg:pb-2">
            <Checklist
              ref={checklistRef}
              results={results}
              axe={axe}
              hintsUsed={draft.hintsUsed}
              revealed={revealed}
              pops={pops}
              shakeKey={shakeKey}
            />
          </div>
        </main>
      </div>

      <QuickKeys
        visible={editorFocused && level.mode === "code"}
        restingBottom="calc(5.25rem + env(safe-area-inset-bottom))"
        onKey={(t) => editorRefs.current[activeFile]?.type(t)}
        onDone={() => (document.activeElement as HTMLElement | null)?.blur()}
      />

      <HintsDialog
        level={level}
        open={hintsOpen}
        hintsUsed={draft.hintsUsed}
        onClose={() => setHintsOpen(false)}
        onReveal={() => {
          playSfx("ui-tap");
          setDraft((d) => ({ ...d, hintsUsed: Math.min(3, d.hintsUsed + 1) }));
        }}
      />

      <Dialog open={restartOpen} onClose={() => setRestartOpen(false)} labelledBy="restart-title">
        <div className="rounded-chunk border-[3px] border-ink bg-foam p-5 text-center shadow-chunky">
          <Restart className="mx-auto size-14 text-coral-deep" />
          <h2 id="restart-title" className="mt-1 font-display text-2xl tracking-wide">
            ¿Empezar de cero?
          </h2>
          <p className="mt-1 text-[15px] font-semibold text-ink-soft">Tu código vuelve a como estaba al principio.</p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setRestartOpen(false)} data-autofocus>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" onClick={restart}>
              Reiniciar
            </Button>
          </div>
        </div>
      </Dialog>

      <Celebration
        level={level}
        next={next}
        data={celebration}
        onImprove={() => {
          playSfx("ui-tap");
          setCelebration(null);
          setScene("editor");
        }}
      />
    </MotionConfig>
  );
}
