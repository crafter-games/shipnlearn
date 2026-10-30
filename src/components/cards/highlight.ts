/**
 * Tiny syntax colouring for the read-only examples on concept cards. Not a
 * parser: it only has to look right on short, well-formed snippets.
 */

export type TokenKind = "text" | "punct" | "tag" | "attr" | "string" | "comment" | "selector" | "property" | "value";

export type Token = { kind: TokenKind; text: string };

const push = (out: Token[], kind: TokenKind, text: string) => {
  if (!text) return;
  const last = out[out.length - 1];
  if (last && last.kind === kind) last.text += text;
  else out.push({ kind, text });
};

/** Splits one `<tag attr="v">` into tokens. */
function tagTokens(tag: string, out: Token[]) {
  const re = /(\s+)|(<\/?|\/?>)|([\w:.-]+)(?:(=)("[^"]*"|'[^']*'|[^\s"'>]+))?|([\s\S])/g;
  let nameDone = false;
  for (const m of tag.matchAll(re)) {
    const [, space, punct, word, eq, val, other] = m;
    if (space) push(out, "text", space);
    else if (punct) push(out, "punct", punct);
    else if (word) {
      if (!nameDone) {
        push(out, "tag", word);
        nameDone = true;
      } else {
        push(out, "attr", word);
        if (eq) {
          push(out, "punct", eq);
          push(out, "string", val ?? "");
        }
      }
    } else if (other) push(out, "punct", other);
  }
}

export function highlightHtml(src: string): Token[] {
  const out: Token[] = [];
  const re = /<!--[\s\S]*?-->|<!?\/?[a-zA-Z][^>]*>/g;
  let at = 0;
  for (const m of src.matchAll(re)) {
    push(out, "text", src.slice(at, m.index));
    if (m[0].startsWith("<!--")) push(out, "comment", m[0]);
    else tagTokens(m[0], out);
    at = m.index + m[0].length;
  }
  push(out, "text", src.slice(at));
  return out;
}

export function highlightCss(src: string): Token[] {
  const out: Token[] = [];
  const re = /\/\*[\s\S]*?\*\/|[{};:]|[^{};:/]+|\//g;
  let depth = 0;
  // Inside a block: "prop" until ':' then "value" until ';' or '}'.
  let mode: "selector" | "prop" | "value" = "selector";
  for (const m of src.matchAll(re)) {
    const t = m[0];
    const i = m.index;
    if (t.startsWith("/*")) push(out, "comment", t);
    else if (t === "{") {
      depth++;
      mode = "prop";
      push(out, "punct", t);
    } else if (t === "}") {
      depth = Math.max(0, depth - 1);
      mode = depth ? "prop" : "selector";
      push(out, "punct", t);
    } else if (t === ";") {
      if (mode === "value") mode = "prop";
      push(out, "punct", t);
    } else if (t === ":") {
      if (mode === "prop") {
        mode = "value";
        push(out, "punct", t);
      } else push(out, mode === "value" ? "value" : "selector", t);
    } else if (/^\s+$/.test(t)) push(out, "text", t);
    else {
      // A nested rule (inside @media): the text runs into '{' before any ';' or '}'.
      if (mode === "prop") {
        const rest = src.slice(i);
        const brace = rest.indexOf("{");
        const stop = rest.search(/[;}]/);
        if (brace !== -1 && (stop === -1 || brace < stop)) mode = "selector";
      }
      if (mode === "selector") {
        push(out, "selector", t);
        continue;
      }
      const lead = t.match(/^\s*/)?.[0] ?? "";
      const trail = t.match(/\s*$/)?.[0] ?? "";
      push(out, "text", lead);
      push(out, mode === "prop" ? "property" : mode, t.slice(lead.length, t.length - trail.length || undefined));
      push(out, "text", trail);
    }
  }
  return out;
}
