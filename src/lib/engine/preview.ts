import type { LevelFiles } from "@/lib/levels/types";

/** Base styles every preview gets, so a blank page doesn't look broken. */
const BASE_CSS = `html{font-family:system-ui,sans-serif;line-height:1.5;color:#1B1F3B;background:#fff}body{margin:16px}img{max-width:100%}`;

/**
 * Nonce for the only script allowed in a preview: the axe-core auditor the
 * parent injects. A random value per page load, never shown to the player.
 */
export const PREVIEW_NONCE =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "")
    : Math.random().toString(36).slice(2);

/**
 * The preview iframe may run with `allow-scripts` (for axe). This policy
 * blocks every player-authored script path that `stripScripts` can't see:
 * inline handlers (`onerror=`), `javascript:` URLs and nested srcdoc frames.
 */
const CSP = `<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${PREVIEW_NONCE}'; object-src 'none'; base-uri 'none'">`;

/** Remove scripts: v1 teaches HTML/CSS only, and user JS must not run. */
const stripScripts = (html: string) =>
  html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "").replace(/<script\b[^>]*>/gi, "");

/**
 * Builds the iframe srcdoc. If the player wrote a full document
 * (<!doctype>/<html>) it is kept as-is with the CSS injected into <head>;
 * otherwise the HTML is wrapped in a minimal document.
 */
export function buildSrcdoc(files: LevelFiles): string {
  const html = stripScripts(files.html);
  const userCss = `<style data-user>${files.css ?? ""}</style>`;
  const baseCss = `<style data-base>${BASE_CSS}</style>`;
  if (/<html[\s>]|<!doctype/i.test(html)) {
    const head = /<head(\s[^>]*)?>/i;
    if (head.test(html)) {
      const withCsp = html.replace(head, (m) => `${m}${CSP}`);
      return /<\/head>/i.test(withCsp)
        ? withCsp.replace(/<\/head>/i, `${baseCss}${userCss}</head>`)
        : withCsp.replace(head, (m) => `${m}${baseCss}${userCss}`);
    }
    const open = /<html(\s[^>]*)?>/i;
    if (open.test(html)) {
      return html.replace(open, (m) => `${m}<head>${CSP}${baseCss}${userCss}</head>`);
    }
    return html.replace(/<!doctype[^>]*>/i, (m) => `${m}${CSP}${baseCss}${userCss}`);
  }
  return `<!doctype html><html lang="es"><head>${CSP}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title>${baseCss}${userCss}</head><body>${html}</body></html>`;
}
