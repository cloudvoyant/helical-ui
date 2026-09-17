// libs/helical-ui/src/latex.ts
// Closely based on: diffbook's KaTeX pipeline (apps/book/src/lib/mdx.tsx rehype-katex) — here as a
// synchronous render helper + shared class strings for the LaTeX block component.
import katex from 'katex';

export const latexRootBase = 'not-prose';

export const latexDisplayBase = 'my-4 block w-full overflow-x-auto py-1';

export const latexInlineBase = 'inline-block align-middle';

export const latexErrorBase = 'font-mono text-sm text-destructive';

export interface LaTeXProps {
  /** LaTeX source. */
  latex: string;
  /** Pre-rendered KaTeX HTML for the static/server path. When provided the component renders it
   *  immediately and never calls `katex` — a rehype-katex-style plugin can pass its output here. */
  html?: string;
  /** Extra classes for the root container. */
  className?: string;
}

/**
 * Render LaTeX to KaTeX HTML synchronously. `katex` is a hard dependency, so this works at
 * build/SSR time (a rehype plugin or `renderToStaticMarkup` path) and on the client alike —
 * no lazy import, no placeholder, no double render.
 *
 * `throwOnError` and `strict` are disabled so a malformed expression renders best-effort
 * output instead of throwing.
 */
export function toLaTeX(latex: string, opts?: { displayMode?: boolean }): string {
  return katex.renderToString(latex, {
    displayMode: opts?.displayMode ?? false,
    throwOnError: false,
    strict: false,
  });
}
