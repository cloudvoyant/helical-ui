// libs/helical-react/src/latex.tsx
// Closely based on: diffbook's KaTeX pipeline; block + inline components. Inline rendering can
// also use `toLaTeX` directly — see the LaTeX docs.
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { latexRootBase, latexDisplayBase, latexInlineBase, latexErrorBase, toLaTeX, cn } from '@cloudvoyant/helical-ui';
import type { LaTeXProps as LaTeXPropsBase } from '@cloudvoyant/helical-ui';

export type LaTeXProps = HTMLArkProps<'div'> & LaTeXPropsBase;

/**
 * Renders a LaTeX **block** (display-mode) equation. KaTeX is a hard dependency, so the output
 * renders synchronously at SSR and on the client — no placeholder, no lazy import.
 *
 * Pass `html` to bypass KaTeX entirely with a pre-rendered string (e.g. from a rehype-katex
 * plugin at build time).
 */
export function LaTeX({ latex, html, className, ...props }: LaTeXProps) {
  let markup: string;
  let error = false;
  if (html === undefined) {
    try {
      markup = toLaTeX(latex, { displayMode: true });
    } catch {
      markup = latex;
      error = true;
    }
  } else {
    markup = html;
  }

  return (
    <ark.div
      {...props}
      data-latex-state={error ? 'error' : 'done'}
      className={cn(latexRootBase, latexDisplayBase, className)}
    >
      {error ? <code className={latexErrorBase}>{latex}</code> : <span dangerouslySetInnerHTML={{ __html: markup }} />}
    </ark.div>
  );
}

export type InlineLaTeXProps = HTMLArkProps<'span'> & LaTeXPropsBase;

/** Renders a LaTeX **inline** equation (`displayMode: false`) synchronously — the component
 *  equivalent of calling `toLaTeX(latex)` and dropping the HTML into surrounding text. */
export function InlineLaTeX({ latex, html, className, ...props }: InlineLaTeXProps) {
  let markup: string;
  let error = false;
  if (html === undefined) {
    try {
      markup = toLaTeX(latex);
    } catch {
      markup = latex;
      error = true;
    }
  } else {
    markup = html;
  }

  return (
    <ark.span
      {...props}
      data-latex-state={error ? 'error' : 'done'}
      className={cn(latexRootBase, latexInlineBase, className)}
    >
      {error ? <code className={latexErrorBase}>{latex}</code> : <span dangerouslySetInnerHTML={{ __html: markup }} />}
    </ark.span>
  );
}
