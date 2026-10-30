import type { AxeResults, ImpactValue } from "axe-core";
import { PREVIEW_NONCE } from "./preview";

export type AxeIssue = {
  id: string;
  impact: ImpactValue;
  /** Short Spanish explanation for the checklist. */
  message: string;
  /** How many elements break the rule. */
  count: number;
};

export type AxeReport = {
  /** No serious/critical violations. True when axe couldn't run (never block the player on our bug). */
  clean: boolean;
  issues: AxeIssue[];
  ran: boolean;
};

export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Only these impacts cost the ⭐⭐. */
const BLOCKING: ImpactValue[] = ["serious", "critical"];

/** Brief, friendly copy for the rules beginners hit most. Falls back to axe's Spanish locale. */
const MESSAGES: Record<string, string> = {
  "image-alt": "Una imagen no tiene texto alternativo (alt).",
  "input-image-alt": "Un botón de imagen no tiene texto alternativo (alt).",
  "role-img-alt": "Un elemento con role=\"img\" no tiene nombre accesible.",
  "svg-img-alt": "Un SVG con role=\"img\" no tiene texto alternativo.",
  "document-title": "La página no tiene <title>.",
  "html-has-lang": "Falta el idioma: añade lang=\"es\" a <html>.",
  "html-lang-valid": "El idioma de <html lang> no es válido.",
  "color-contrast": "Hay texto con poco contraste con su fondo: cuesta leerlo.",
  "link-name": "Un enlace no tiene texto que diga adónde lleva.",
  "button-name": "Un botón no tiene texto que diga qué hace.",
  label: "Un campo de formulario no tiene <label>.",
  "select-name": "Un <select> no tiene <label>.",
  list: "Una lista contiene algo que no es <li>.",
  listitem: "Hay un <li> fuera de una lista <ul> u <ol>.",
  "definition-list": "Una lista <dl> contiene elementos que no van ahí.",
  "aria-required-children": "Un rol ARIA no tiene los hijos que necesita.",
  "aria-required-parent": "Un rol ARIA no está dentro del padre que necesita.",
  "nested-interactive": "Hay un control interactivo dentro de otro.",
  "frame-title": "Un <iframe> no tiene title.",
  "meta-viewport": "El viewport impide hacer zoom.",
  "duplicate-id-aria": "Dos elementos usan el mismo id referenciado por ARIA.",
};

type AxeGlobal = {
  run: (context: Document, options: object) => Promise<AxeResults>;
};

let sourcePromise: Promise<string> | null = null;

/** axe-core source + Spanish locale, loaded once and only when needed. */
function loadSource(): Promise<string> {
  sourcePromise ??= Promise.all([
    import("axe-core"),
    import("axe-core/locales/es.json"),
  ]).then(([axeMod, locale]) => {
    const axe = (axeMod as unknown as { default?: { source: string } }).default ?? axeMod;
    const json = JSON.stringify((locale as { default?: unknown }).default ?? locale);
    // Bundlers may rewrite the UMD's `typeof module` checks inside the
    // function whose source axe exposes, so give it a throwaway CommonJS scope.
    return `(function(module,exports,define){${(axe as { source: string }).source}\n}).call(window,{exports:{}},{},undefined);\naxe.configure({locale:${json}});`;
  });
  return sourcePromise;
}

/** Pre-fetch the auditor so the first Ship doesn't wait for the chunk. */
export function preloadAxe(): void {
  void loadSource().catch(() => {
    sourcePromise = null;
  });
}

export function summarize(results: Pick<AxeResults, "violations">): AxeIssue[] {
  return results.violations
    .filter((v) => v.impact && BLOCKING.includes(v.impact))
    .map((v) => ({
      id: v.id,
      impact: v.impact!,
      message: MESSAGES[v.id] ?? v.help,
      count: v.nodes.length,
    }));
}

/**
 * Audits the document loaded in `iframe` with axe-core. The iframe needs
 * `sandbox="allow-scripts allow-same-origin"`; the auditor is injected from
 * the parent as a nonce'd <script> (player scripts are stripped and blocked
 * by the preview CSP).
 */
export async function runAxe(iframe: HTMLIFrameElement): Promise<AxeReport> {
  try {
    const source = await loadSource();
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow as (Window & { axe?: AxeGlobal }) | null;
    if (!doc || !win) return { clean: true, issues: [], ran: false };
    if (!win.axe) {
      const script = doc.createElement("script");
      script.nonce = PREVIEW_NONCE;
      script.textContent = source;
      (doc.head ?? doc.documentElement).appendChild(script);
      script.remove();
    }
    if (!win.axe) return { clean: true, issues: [], ran: false };
    const results = await win.axe.run(doc, {
      resultTypes: ["violations"],
      // WCAG rules only: best-practice rules (region, landmark-one-main,
      // page-has-heading-one) would punish fragment levels taught before landmarks.
      runOnly: { type: "tag", values: WCAG_TAGS },
    });
    const issues = summarize(results);
    return { clean: issues.length === 0, issues, ran: true };
  } catch {
    return { clean: true, issues: [], ran: false };
  }
}
