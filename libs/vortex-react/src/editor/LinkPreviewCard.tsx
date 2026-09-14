// libs/vortex-react/src/editor/LinkPreviewCard.tsx
// React parity of LinkPreviewCard.svelte. Renders the `bookmark` card, or a 16:9 `embed`.
// YouTube embeds prefer the vortex YouTube facade (lazy, no iframe until interaction).
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { YouTube } from '../youtube';

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function youTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null;
    if (parsed.hostname.endsWith('youtube.com')) return parsed.searchParams.get('v');
    return null;
  } catch {
    return null;
  }
}

export function LinkPreviewCard({ node }: NodeViewProps) {
  const { url, title, description, image, favicon, type } = node.attrs as {
    url: string;
    title?: string;
    description?: string;
    image?: string | null;
    favicon?: string | null;
    type?: 'bookmark' | 'embed';
  };

  if (type === 'embed') {
    const videoId = url ? youTubeId(url) : null;
    return (
      <NodeViewWrapper as="div" data-type="link-preview" className="link-preview my-4">
        {videoId ? (
          // vortex YouTube takes the full url and derives the id itself.
          <YouTube url={url} title={title} />
        ) : (
          <div className="relative h-0 overflow-hidden rounded-lg pb-[56.25%]">
            <iframe
              src={url}
              title={title || ''}
              frameBorder="0"
              allowFullScreen
              className="absolute left-0 top-0 h-full w-full"
            />
          </div>
        )}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper as="div" data-type="link-preview" className="link-preview my-4">
      <a
        href={url || ''}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-link flex overflow-hidden rounded-lg border border-border/70 bg-muted/40 no-underline transition-colors hover:bg-muted"
        style={{ color: 'inherit' }}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-1.5">
          <div>
            <div className="mb-1 line-clamp-1 text-base font-semibold">{title}</div>
            {description ? (
              <p className="mb-2 line-clamp-2 text-xs leading-snug text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="h-3.5 w-3.5 shrink-0"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l-3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
              </svg>
            )}
            <span className="truncate opacity-80">{url ? hostnameOf(url) : ''}</span>
          </div>
        </div>
        {image ? (
          <div className="aspect-video w-44 shrink-0 bg-muted">
            <img
              src={image}
              alt={title || ''}
              className="h-full w-full object-cover"
              onError={(event) => {
                const parent = (event.currentTarget as HTMLImageElement).parentElement;
                if (parent) parent.style.display = 'none';
              }}
            />
          </div>
        ) : null}
      </a>
    </NodeViewWrapper>
  );
}
