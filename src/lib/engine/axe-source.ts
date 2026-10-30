/**
 * The untouched axe-core build as text, for injection into preview iframes.
 * `axe.source` from the bundled module is the minified, rewritten function
 * and breaks once serialised (it references bundler-renamed variables), so
 * the original file is emitted as a static asset and fetched on demand.
 */
const AXE_URL = new URL("axe-core/axe.min.js", import.meta.url);

export async function fetchAxeSource(): Promise<string> {
  const res = await fetch(AXE_URL);
  if (!res.ok) throw new Error(`axe-core: HTTP ${res.status}`);
  return res.text();
}
