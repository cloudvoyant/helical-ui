// apps/docs/src/components/examples/editor/default/react.tsx
import { Editor, Prose } from '@cloudvoyant/vortex-react';

const seed = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Getting Started' }] },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: "Type '/' for commands, or select text for the bubble menu." }],
    },
  ],
});

export default function ReactEditorDefault() {
  return (
    <Prose>
      <Editor content={seed} />
    </Prose>
  );
}
