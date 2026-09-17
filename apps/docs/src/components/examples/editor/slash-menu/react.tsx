// apps/docs/src/components/examples/editor/slash-menu/react.tsx
import { Editor, Prose } from '@cloudvoyant/helical-react';

const seed = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Blocks' }] },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: "Scroll to the last line, then type '/' to test the anchored block palette." }],
    },
    ...Array.from({ length: 15 }, () => ({ type: 'paragraph', content: [] })),
    { type: 'paragraph', content: [{ type: 'text', text: 'Type on the empty line below.' }] },
    { type: 'paragraph', content: [] },
  ],
});

const fetchLinkPreview = async (url: string) => ({
  title: 'Helical bookmark',
  description: 'Metadata returned by the app-owned preview function.',
  image: null,
  favicon: null,
  provider: new URL(url).hostname,
});

export default function ReactEditorSlashMenu() {
  return (
    <Prose>
      <Editor content={seed} fetchLinkPreview={fetchLinkPreview} />
    </Prose>
  );
}
