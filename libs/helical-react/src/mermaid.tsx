// libs/helical-react/src/mermaid.tsx
// Closely based on: diffbook Mermaid (packages/diffbook-ui/src/components/Mermaid.tsx placeholder +
// apps/book/src/components/article-body.tsx client renderer)
import { useEffect, useState } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  mermaidRootBase,
  mermaidSourceBase,
  mermaidSvgBase,
  mermaidLoadingBase,
  renderMermaidSource,
  mermaidSvgAspectRatio,
  cn,
} from '@cloudvoyant/helical-ui';
import type { MermaidProps as MermaidPropsBase } from '@cloudvoyant/helical-ui';

export type MermaidProps = HTMLArkProps<'div'> & MermaidPropsBase;

type Status = 'loading' | 'done' | 'error';

/**
 * Mermaid diagram. Two rendering paths:
 *
 * - **Prerendered** (`svg` prop): the SVG markup is rendered immediately — the server/static
 *   path. `mermaid` is never imported client-side. Its `viewBox` reserves the aspect ratio on
 *   the root container, so the diagram paints at its final size with no layout shift.
 * - **Client** (no `svg`): an SSR-safe loading skeleton is shown while `mermaid` is dynamically
 *   imported and the diagram renders; the source stays available in a `<noscript>` block for
 *   no-JS users and is shown directly if the render fails.
 */
export function Mermaid({ code, svg, className, ...props }: MermaidProps) {
  const [status, setStatus] = useState<Status>(svg === undefined ? 'loading' : 'done');
  const [rendered, setRendered] = useState<string | null>(svg ?? null);
  const aspectRatio = rendered === null ? undefined : mermaidSvgAspectRatio(rendered);

  useEffect(() => {
    if (svg !== undefined) return; // prerendered — nothing to load client-side
    let cancelled = false;
    setStatus('loading');
    setRendered(null);
    renderMermaidSource(code)
      .then((markup) => {
        if (!cancelled) {
          setRendered(markup);
          setStatus('done');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [code, svg]);

  return (
    <ark.div
      {...props}
      data-mermaid-code={JSON.stringify(code)}
      data-mermaid-src={rendered === null ? undefined : code}
      data-mermaid-state={status}
      // aspectRatio is applied last so the diagram's ratio wins over any caller style and
      // the swap never shifts layout (matches the Svelte wrapper).
      style={aspectRatio === undefined ? props.style : { ...props.style, aspectRatio }}
      className={cn(mermaidRootBase, className)}
    >
      {rendered === null ? (
        status === 'error' ? (
          <pre className={mermaidSourceBase}>{code}</pre>
        ) : (
          <>
            <div className={mermaidLoadingBase} role="status" aria-label="Rendering diagram" data-mermaid-loading>
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-muted-foreground"
              />
              <span className="text-sm text-muted-foreground">Rendering diagram</span>
            </div>
            <noscript>
              {/* Only active with JS disabled: hide the loading spinner, which can never
                resolve, and show the raw source instead. */}
              <style>{'[data-mermaid-loading]{display:none}'}</style>
              <pre className={mermaidSourceBase}>{code}</pre>
            </noscript>
          </>
        )
      ) : (
        <div className={mermaidSvgBase} dangerouslySetInnerHTML={{ __html: rendered }} />
      )}
    </ark.div>
  );
}
