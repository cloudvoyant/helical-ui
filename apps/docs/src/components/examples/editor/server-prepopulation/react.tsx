// Astro can fetch this serialized JSON on the server and pass it as the content prop.
import { useEffect, useState } from 'react';
import { Editor, Prose, Reader } from '@cloudvoyant/vortex-react';

const serverContent = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Server-populated draft' }] },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'This content is present in the server HTML before the editor hydrates.' }],
    },
  ],
});

export default function ReactEditorServerPrepopulation({ content = serverContent }: { content?: string }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <Prose>
      {hydrated ? (
        <Editor content={content} />
      ) : (
        <div data-editor-server-prepopulation>
          <Reader content={content} />
        </div>
      )}
    </Prose>
  );
}
