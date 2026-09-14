// libs/vortex-react/src/editor/UrlMentionPill.tsx
// React parity of UrlMentionPill.svelte: an inline, atom pill rendering a favicon (or a
// fallback link glyph) plus the page title.
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

export function UrlMentionPill({ node }: NodeViewProps) {
  const { url, title, favicon } = node.attrs as {
    url: string;
    title?: string;
    favicon?: string | null;
  };

  const displayTitle = title || url || '';

  return (
    <NodeViewWrapper as="span" className="inline">
      <a
        href={url || ''}
        target="_blank"
        rel="noopener noreferrer"
        data-type="url-mention"
        className="url-mention-pill url-mention-pill-edit inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 align-text-bottom text-sm leading-tight no-underline"
        style={{ color: 'inherit' }}
      >
        {favicon ? (
          <img
            src={favicon}
            alt=""
            className="inline-block h-3.5 w-3.5 shrink-0"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <svg className="inline-block h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l-3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
          </svg>
        )}
        <span>{displayTitle}</span>
      </a>
    </NodeViewWrapper>
  );
}
