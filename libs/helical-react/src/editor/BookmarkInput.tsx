// libs/helical-react/src/editor/BookmarkInput.tsx
import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { LinkPreviewFetcher } from '@cloudvoyant/helical-ui';

export interface BookmarkInputProps {
  editor: Editor;
  position: number;
  onClose: () => void;
  /** Optional metadata fetcher; without it a bare bookmark is inserted. */
  fetchLinkPreview?: LinkPreviewFetcher;
}

export function BookmarkInput({ editor, position, onClose, fetchLinkPreview }: BookmarkInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit() {
    const trimmed = url.trim();
    if (!trimmed) return setError('Please enter a URL');
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('Unsupported URL protocol');
    } catch {
      return setError('Please enter a valid URL');
    }

    setLoading(true);
    setError('');
    try {
      const metadata = fetchLinkPreview
        ? await fetchLinkPreview(trimmed)
        : {
            title: trimmed,
            description: '',
            image: null,
            favicon: null,
            provider: '',
          };
      editor
        .chain()
        .focus()
        .setTextSelection(position)
        .insertLinkPreview({ url: trimmed, type: 'bookmark', ...metadata })
        .run();
      onClose();
    } catch {
      setError('Could not load link details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Insert bookmark"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      className="w-80 space-y-2 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-xl"
    >
      <p className="text-sm font-semibold">Insert Bookmark</p>
      <div className="space-y-1">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setError('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void submit();
          }}
          placeholder="https://example.com"
          aria-invalid={Boolean(error)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {error ? (
          <div role="alert" className="text-xs leading-tight text-destructive">
            {error}
          </div>
        ) : null}
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-sm hover:bg-muted">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={loading}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Insert'}
        </button>
      </div>
    </div>
  );
}
