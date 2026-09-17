// libs/helical-ui/src/code-block.ts
// Closely based on: diffbook code-block family (packages/diffbook-ui/src/components/ui/code-block.tsx).
import type { BundledLanguage } from 'shiki/bundle/full';

export const codeBlockRootBase = 'not-prose my-4 overflow-hidden rounded-lg border';

export const codeBlockHeaderBase = 'flex h-10 items-center justify-between gap-2 border-b bg-muted/50 px-4';

export const codeBlockHeaderInfoBase = 'flex min-w-0 items-center gap-2 text-muted-foreground';

export const codeBlockTitleBase = 'min-w-0 truncate font-mono text-xs';

export const codeBlockBodyBase = 'hx-cb relative overflow-x-auto bg-background';

export const codeBlockBodyScrollableBase = 'overflow-y-auto';

export const codeBlockContentBase = 'text-sm [&>pre]:p-4 [&_.line]:leading-[1.7]';

export const codeBlockLineNumbersBase = 'cbln';

export const codeBlockHighlightBase = 'cbhl';

export const codeBlockLoadingBase = 'flex h-16 items-center justify-center';

export const codeBlockSpinnerBase =
  'h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent';

/** Floating copy button anchored to the code body's top-right corner (multi-language block). */
export const codeBlockCopyFloatBase = 'absolute right-2 top-2';

export interface FileEntry {
  filename: string;
  code: string;
  language?: string;
  /** Pre-rendered shiki HTML for the static/server path. */
  html?: string;
}

export interface LanguageTab {
  label: string;
  filename: string;
  code: string;
  language?: string;
  /** Pre-rendered shiki HTML for the static/server path. */
  html?: string;
}

export interface CodeBlockProps {
  code: string;
  /** Shiki language id (default `tsx`). */
  language?: string;
  filename?: string;
  /** Pre-rendered shiki HTML for the static/server path. */
  html?: string;
  showLineNumbers?: boolean;
  scrollable?: boolean;
  maxHeight?: number;
  /** 1-based line numbers to highlight. */
  highlightLines?: number[];
  className?: string;
}

// -- Styles --
// Injected once at runtime. The `.hx-cb` wrapper scopes every rule to these islands so
// nothing leaks into fenced ```-block prose styling, and the `:root.dark` rules swap the
// shiki token colors/background to the dark palette (mirrors diffbook's CB_STYLES).
const CODE_BLOCK_STYLES = `
.hx-cb pre.shiki{margin:0!important;border:0!important;border-radius:0!important;background:transparent!important}
.hx-cb pre.shiki code{border:0!important;border-radius:0!important;background:transparent!important;padding:0!important}
:root.dark .hx-cb .shiki,
:root.dark .hx-cb .shiki span{color:var(--shiki-dark)!important;font-style:var(--shiki-dark-font-style)!important;font-weight:var(--shiki-dark-font-weight)!important;text-decoration:var(--shiki-dark-text-decoration)!important}
.hx-cb .cbln code{counter-reset:line;counter-increment:line 0}
.hx-cb .cbln .line::before{content:counter(line);counter-increment:line;display:inline-block;min-width:1.5rem;padding-right:.75rem;margin-right:1rem;text-align:right;font-size:.75rem;line-height:1.7;user-select:none;color:color-mix(in srgb,var(--muted-foreground,#888) 55%,transparent)}
.hx-cb .cbhl .line-highlighted{display:block;background-color:oklch(0.828 0.189 84.429/.12);border-left:2px solid oklch(0.769 0.188 70.08);margin:0 -1rem;padding:0 1rem}
`;

export function injectCodeBlockStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('hx-code-block')) return;
  const el = document.createElement('style');
  el.id = 'hx-code-block';
  el.textContent = CODE_BLOCK_STYLES;
  document.head.appendChild(el);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Escaped-plaintext `<pre>` preserving the `.shiki`/`.line` hooks so line-number and
 *  highlight CSS still apply. Never throws. */
function plaintextFallback(code: string): string {
  const lines = code
    .split('\n')
    .map((l) => `<span class="line">${escapeHtml(l)}</span>`)
    .join('\n');
  return `<pre class="shiki" tabindex="-1"><code>${lines}</code></pre>`;
}

/**
 * Dynamically import shiki and highlight `code` to an HTML string. The import stays
 * client-only and lazy, so shiki never enters the SSR/initial bundle. Unknown languages
 * or any highlight failure fall back to escaped plaintext — never throws.
 */
export async function renderCodeToHtml(code: string, language: string, highlightLines?: number[]): Promise<string> {
  injectCodeBlockStyles();
  try {
    const { codeToHtml } = await import('shiki/bundle/full');
    return await codeToHtml(code, {
      lang: language as BundledLanguage,
      themes: { light: 'github-light', dark: 'github-dark' },
      tabindex: false,
      transformers: [
        {
          pre(node) {
            if (node.properties?.['style']) {
              node.properties['style'] = (node.properties['style'] as string)
                .replace(/background-color:\s*[^;]+;?\s*/gi, '')
                .replace(/--shiki-dark-bg:\s*[^;]+;?\s*/gi, '');
            }
          },
          line(node, line) {
            if (highlightLines?.includes(line)) {
              this.addClassToHast(node, 'line-highlighted');
            }
          },
        },
      ],
    });
  } catch {
    return plaintextFallback(code);
  }
}
