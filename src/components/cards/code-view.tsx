import { Fragment, type ReactNode } from "react";
import { Document, Palette } from "@/components/icons";
import { highlightCss, highlightHtml, type TokenKind } from "./highlight";

/** Token colours on the ink code surface (all ≥ 4.5:1 against ink). */
const TONE: Record<TokenKind, string> = {
  text: "text-foam",
  punct: "text-ocean-light",
  tag: "text-coral",
  attr: "text-sand",
  string: "text-lime",
  comment: "text-foam/60 italic",
  selector: "text-sand",
  property: "text-ocean-light",
  value: "text-lime",
};

function Code({ src, lang }: { src: string; lang: "html" | "css" }) {
  const tokens = lang === "html" ? highlightHtml(src) : highlightCss(src);
  return (
    <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[13px] leading-relaxed sm:text-sm">
      <code>
        {tokens.map((t, i) => (
          <span key={i} className={TONE[t.kind]}>
            {t.text}
          </span>
        ))}
      </code>
    </pre>
  );
}

function FileTab({ icon, name }: { icon: ReactNode; name: string }) {
  return (
    <p className="flex items-center gap-1.5 border-b-2 border-ink-soft bg-ink-soft/60 px-3 py-1 font-mono text-xs font-bold text-foam/90">
      {icon}
      {name}
    </p>
  );
}

/** Read-only, syntax-coloured example files (HTML, then CSS if any). */
export function CodeView({ html, css }: { html: string; css?: string }) {
  const files = [
    { lang: "html" as const, name: "index.html", src: html.trimEnd(), icon: <Document className="size-4" /> },
    ...(css?.trim() ? [{ lang: "css" as const, name: "estilos.css", src: css.trimEnd(), icon: <Palette className="size-4" /> }] : []),
  ];
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink" data-testid="card-code">
      {files.map((f) => (
        <Fragment key={f.lang}>
          <FileTab icon={f.icon} name={f.name} />
          <Code src={f.src} lang={f.lang} />
        </Fragment>
      ))}
    </div>
  );
}
