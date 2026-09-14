// apps/docs/src/components/examples/editor/heading-enforcement/react.tsx
// The H1 title is enforced by the titleHeading ProseMirror plugin: it is auto-created when
// missing and restored when the first node is changed, so it cannot be deleted or demoted.
import { Editor, Prose } from '@cloudvoyant/vortex-react';

const seed = JSON.stringify({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Try to delete this title' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Select all and delete — the H1 is re-created automatically and cannot be removed or demoted.',
        },
      ],
    },
  ],
});

export default function ReactEditorHeadingEnforcement() {
  return (
    <Prose>
      <Editor content={seed} />
    </Prose>
  );
}
