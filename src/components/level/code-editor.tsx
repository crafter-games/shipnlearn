"use client";

import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import {
  bracketMatching,
  defaultHighlightStyle,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
  type TagStyle,
} from "@codemirror/language";
import { EditorState, Prec } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { type Ref, useEffect, useImperativeHandle, useRef } from "react";
import type { FileKind } from "@/lib/levels/types";

export type CodeEditorHandle = {
  /** Insert text at the cursor as if typed (runs auto-close handlers). */
  type: (text: string) => void;
  focus: () => void;
};

type Props = {
  value: string;
  lang: FileKind;
  label: string;
  onChange: (value: string) => void;
  onShip: () => void;
  onHint: () => void;
  onFocusChange?: (focused: boolean) => void;
  ref?: Ref<CodeEditorHandle>;
};

/**
 * Dark "ink" palette built from the default highlight style's own tags
 * (so we don't depend on @lezer/highlight directly), recoloured with theme
 * tokens that read on the ink background.
 */
const RECOLOR: Record<string, string> = {
  "#708": "var(--color-sand)", // keyword
  "#219": "var(--color-ocean-light)", // atom, url
  "#164": "var(--color-sand)", // numbers
  "#a11": "var(--color-lime)", // strings, attribute values
  "#e40": "var(--color-coral)",
  "#00f": "var(--color-ocean-light)",
  "#30a": "var(--color-ocean-light)",
  "#085": "var(--color-coral)", // tag names
  "#167": "var(--color-sand)", // class selectors
  "#256": "var(--color-foam)",
  "#00c": "var(--color-ocean-light)", // property names
  "#940": "color-mix(in oklab, var(--color-foam) 55%, transparent)", // comments
  "#404740": "color-mix(in oklab, var(--color-foam) 60%, transparent)",
  "#f00": "var(--color-coral)",
};

type TagLike = { base?: TagLike };

function inkHighlight() {
  const specs: TagStyle[] = defaultHighlightStyle.specs.map((s) => {
    const color = typeof s.color === "string" ? RECOLOR[s.color] : undefined;
    return color ? { ...s, color } : s;
  });
  // definition(propertyName).base === propertyName → colours HTML attribute
  // names and CSS properties too (they inherit from propertyName).
  const defProp = defaultHighlightStyle.specs.find((s) => s.color === "#00c")?.tag;
  const propertyName = (Array.isArray(defProp) ? defProp[0] : defProp) as TagLike | undefined;
  if (propertyName?.base) {
    specs.push({ tag: propertyName.base as never, color: "var(--color-ocean-light)" });
  }
  return HighlightStyle.define(specs);
}

const inkTheme = EditorView.theme(
  {
    "&": {
      color: "var(--color-foam)",
      backgroundColor: "var(--color-ink)",
      fontSize: "16px",
      height: "100%",
    },
    ".cm-scroller": { fontFamily: "var(--font-mono)", lineHeight: "1.6", overflow: "auto" },
    ".cm-content": { caretColor: "var(--color-sand)", padding: "12px 0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--color-sand)", borderLeftWidth: "2px" },
    "&.cm-focused": { outline: "none" },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, ::selection":
      { backgroundColor: "color-mix(in oklab, var(--color-ocean) 45%, transparent)" },
    ".cm-activeLine": { backgroundColor: "color-mix(in oklab, var(--color-foam) 6%, transparent)" },
    ".cm-gutters": {
      backgroundColor: "var(--color-ink)",
      color: "color-mix(in oklab, var(--color-foam) 40%, transparent)",
      border: "none",
    },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-sand)" },
    ".cm-matchingBracket": { backgroundColor: "color-mix(in oklab, var(--color-lime) 30%, transparent)" },
    ".cm-tooltip": {
      border: "3px solid var(--color-ink)",
      borderRadius: "12px",
      backgroundColor: "var(--color-foam)",
      color: "var(--color-ink)",
      overflow: "hidden",
      boxShadow: "var(--shadow-chunky-sm)",
    },
    ".cm-tooltip-autocomplete > ul": { fontFamily: "var(--font-mono)" },
    ".cm-tooltip-autocomplete > ul > li": { padding: "4px 10px" },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
      backgroundColor: "var(--color-ocean)",
      color: "var(--color-foam)",
    },
  },
  { dark: true },
);

/** CodeMirror 6 editor for one file, themed for the ink panel. */
export function CodeEditor({ value, lang, label, onChange, onShip, onHint, onFocusChange, ref }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const cb = useRef({ onChange, onShip, onHint, onFocusChange });
  useEffect(() => {
    cb.current = { onChange, onShip, onHint, onFocusChange };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: value,
        extensions: [
          Prec.highest(keymap.of([{ key: "Mod-h", run: () => (cb.current.onHint(), true) }])),
          lineNumbers(),
          highlightActiveLineGutter(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion({ icons: false }),
          highlightActiveLine(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          lang === "css" ? css() : html({ autoCloseTags: true }),
          syntaxHighlighting(inkHighlight()),
          inkTheme,
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            "aria-label": label,
            autocapitalize: "off",
            autocorrect: "off",
            spellcheck: "false",
          }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) cb.current.onChange(u.state.doc.toString());
            if (u.focusChanged) cb.current.onFocusChange?.(u.view.hasFocus);
          }),
        ],
      }),
    });
    viewRef.current = view;

    // Ctrl/Cmd+Enter ships on every platform. Caught in the capture phase on
    // the host: on Android, CodeMirror defers Enter before any extension sees
    // it and replays it without modifiers (a newline instead of Ship).
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      e.stopPropagation();
      cb.current.onShip();
    };
    host.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      host.removeEventListener("keydown", onKeyDown, { capture: true });
      view.destroy();
      viewRef.current = null;
    };
    // Re-create only when the language changes; `value` syncs below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, label]);

  // External changes (restart, tab switch) replace the document.
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    focus: () => viewRef.current?.focus(),
    type: (text: string) => {
      const view = viewRef.current;
      if (!view) return;
      const { from, to } = view.state.selection.main;
      const insert = () =>
        view.state.update({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
          userEvent: "input.type",
          scrollIntoView: true,
        });
      const handled = view.state
        .facet(EditorView.inputHandler)
        .some((h) => h(view, from, to, text, insert));
      if (!handled) view.dispatch(insert());
      view.focus();
    },
  }));

  return <div ref={hostRef} className="h-full min-h-0" data-testid={`editor-${lang}`} />;
}
