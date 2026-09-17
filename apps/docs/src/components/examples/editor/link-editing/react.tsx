// apps/docs/src/components/examples/editor/link-editing/react.tsx
// Chat-style input (no Prose) demonstrating paste-a-URL and inline link editing.
import { Editor } from '@cloudvoyant/helical-react';

const seed = JSON.stringify({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Paste a URL (e.g. https://tiptap.dev) to create a normal link; select linked text to edit its URL and label.',
        },
      ],
    },
  ],
});

export default function ReactEditorLinkEditing() {
  return (
    <div className="rounded-lg border border-input p-3">
      <Editor content={seed} enforceTitle={false} />
    </div>
  );
}
