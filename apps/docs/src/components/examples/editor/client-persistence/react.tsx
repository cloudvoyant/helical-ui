// Persist serialized Tiptap JSON in browser storage and restore it after a reload.
import { useEffect, useState } from 'react';
import { Editor, Prose } from '@cloudvoyant/helical-react';

const STORAGE_KEY = 'vortex-editor-client-persistence-v1';
const seed = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Persistent draft' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Edit this text, then reload the page.' }] },
  ],
});

function loadDraft() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return seed;
  try {
    return JSON.parse(stored)?.type === 'doc' ? stored : seed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return seed;
  }
}

export default function ReactEditorClientPersistence() {
  const [content, setContent] = useState(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setContent(loadDraft());
    setReady(true);
  }, []);

  if (!ready) return <p className="text-sm text-muted-foreground">Loading saved draft…</p>;

  return (
    <Prose>
      <Editor
        content={content}
        onChange={({ content: nextContent }) => localStorage.setItem(STORAGE_KEY, nextContent)}
      />
      <p className="mt-2 text-xs text-muted-foreground" data-editor-persistence>
        Changes are saved in this browser. Reload the page to restore them.
      </p>
    </Prose>
  );
}
