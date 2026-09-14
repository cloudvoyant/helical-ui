// libs/vortex-react/src/editor/LinkEditPopover.tsx
// React parity of LinkEditPopover.svelte. Kept inside BubbleMenu's positioned surface so editing
// a link never invokes the browser's blocking, unstyleable window.prompt dialog.
import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { ExternalLink, Globe, Trash2 } from 'lucide-react';

export interface LinkEditPopoverProps {
  editor: Editor;
  initialUrl?: string;
  onClose: () => void;
}

function safeExternalUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function LinkEditPopover({ editor, initialUrl = '', onClose }: LinkEditPopoverProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const externalUrl = safeExternalUrl(url.trim());

  useEffect(() => {
    setUrl(initialUrl);
    inputRef.current?.focus();
  }, [initialUrl]);

  function save() {
    const href = url.trim();
    if (href) editor.chain().focus().setLink({ href }).run();
    else editor.chain().focus().unsetLink().run();
    onClose();
  }

  function remove() {
    editor.chain().focus().unsetLink().run();
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-label="Edit link"
      className="absolute start-0 top-full z-10 mt-2 flex w-72 items-center gap-2 rounded-md border border-border bg-popover px-2 py-1.5 text-popover-foreground shadow-lg"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          save();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com"
        className="min-w-0 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={remove}
        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label="Remove link"
        title="Remove link"
      >
        <Trash2 className="size-4" />
      </button>
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Open link in new tab"
          title="Open link in new tab"
        >
          <ExternalLink className="size-4" />
        </a>
      ) : null}
    </div>
  );
}
