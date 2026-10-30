import type { LevelFiles } from "@/lib/levels/types";

/** Base styles every preview gets, so a blank page doesn't look broken. */
const BASE_CSS = `html{font-family:system-ui,sans-serif;line-height:1.5;color:#1B1F3B;background:#fff}body{margin:16px}img{max-width:100%}`;

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
    if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${baseCss}${userCss}</head>`);
    return html.replace(/<html[^>]*>/i, (m) => `${m}<head>${baseCss}${userCss}</head>`);
  }
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title>${baseCss}${userCss}</head><body>${html}</body></html>`;
}
