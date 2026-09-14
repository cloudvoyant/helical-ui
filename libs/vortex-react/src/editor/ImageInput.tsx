// libs/vortex-react/src/editor/ImageInput.tsx
import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { ImageUploadResult } from '@cloudvoyant/vortex-ui';
import { X } from 'lucide-react';
import { ImageFileUpload } from './ImageFileUpload';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No image data'));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}

export interface ImageInputProps {
  editor: Editor;
  position: number;
  onClose: () => void;
  onUpload?: (file: File) => Promise<ImageUploadResult>;
}

export function ImageInput({ editor, position, onClose, onUpload }: ImageInputProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlValue, setUrlValue] = useState('');
  const [urlError, setUrlError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab === 'url') urlInputRef.current?.focus();
  }, [tab]);

  function insertImage(src: string, srcset?: string) {
    editor.chain().focus().setTextSelection(position).insertImage({ src, srcset, alt: '', caption: '' }).run();
    onClose();
  }

  async function handleUpload() {
    if (!selectedFile) return setUploadError('Choose an image first.');
    setUploading(true);
    setUploadError('');
    try {
      const result: ImageUploadResult = onUpload
        ? await onUpload(selectedFile)
        : { src: await fileToDataUrl(selectedFile) };
      insertImage(result.src, result.srcset);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleUrlSubmit() {
    const trimmed = urlValue.trim();
    if (!trimmed) return setUrlError('Please enter a URL');
    try {
      new URL(trimmed);
    } catch {
      return setUrlError('Please enter a valid URL');
    }
    insertImage(trimmed);
  }

  return (
    <div
      role="dialog"
      aria-label="Insert image"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      className="max-h-[calc(100vh-2rem)] w-80 overflow-y-auto rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-xl"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Insert Image</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close image dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex gap-1 rounded-md bg-muted p-1">
          {(['upload', 'url'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value);
                setUrlError('');
              }}
              className={`flex-1 rounded px-3 py-1 text-xs font-medium transition-colors ${
                tab === value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {value === 'upload' ? 'Upload' : 'URL'}
            </button>
          ))}
        </div>

        {tab === 'upload' ? (
          <div className="space-y-1">
            <ImageFileUpload
              file={selectedFile}
              disabled={uploading}
              onFileChange={(file) => {
                setSelectedFile(file);
                setUploadError('');
              }}
            />
            {uploading ? <p className="text-xs text-muted-foreground">Uploading…</p> : null}
            {uploadError ? (
              <div role="alert" className="text-xs leading-tight text-destructive">
                {uploadError}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-1">
            <input
              ref={urlInputRef}
              type="url"
              value={urlValue}
              onChange={(event) => {
                setUrlValue(event.target.value);
                setUrlError('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleUrlSubmit();
              }}
              placeholder="https://example.com/image.jpg"
              aria-invalid={Boolean(urlError)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {urlError ? (
              <div role="alert" className="text-xs leading-tight text-destructive">
                {urlError}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-sm hover:bg-muted">
            Cancel
          </button>
          <button
            type="button"
            onClick={tab === 'upload' ? () => void handleUpload() : handleUrlSubmit}
            disabled={uploading || (tab === 'upload' && !selectedFile)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tab === 'upload' ? (uploading ? 'Uploading…' : 'Upload') : 'Insert'}
          </button>
        </div>
      </div>
    </div>
  );
}
