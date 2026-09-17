// libs/helical-react/src/editor/YouTubeInput.tsx
import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Play, X } from 'lucide-react';

export interface YouTubeInputProps {
  editor: Editor;
  position: number;
  onClose: () => void;
}

function isYouTubeUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname.replace(/^www\./, '');
    return host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be';
  } catch {
    return false;
  }
}

export function YouTubeInput({ editor, position, onClose }: YouTubeInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const insert = () => {
    const value = url.trim();
    if (!isYouTubeUrl(value)) {
      setError('Enter a valid YouTube URL.');
      return;
    }
    editor
      .chain()
      .focus()
      .insertContentAt(position, {
        type: 'linkPreview',
        attrs: { url: value, title: 'YouTube video', description: '', image: '', type: 'embed' },
      })
      .run();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Embed YouTube video"
      className="w-80 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Play className="size-5 fill-current text-red-600" aria-hidden="true" data-youtube-logo />
          Embed YouTube video
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close YouTube input"
          className="rounded p-1 hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <input
        ref={inputRef}
        value={url}
        onChange={(event) => {
          setUrl(event.target.value);
          setError('');
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            insert();
          } else if (event.key === 'Escape') onClose();
        }}
        placeholder="https://youtube.com/watch?v=…"
        aria-label="YouTube URL"
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {error ? (
        <div role="alert" className="mt-1 text-xs leading-tight text-destructive">
          {error}
        </div>
      ) : null}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={insert}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Embed
        </button>
      </div>
    </div>
  );
}
