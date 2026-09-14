// Server-rendered Reader example. Demo.astro loads this through SsrRouter without a client directive.
import { Reader } from '@cloudvoyant/vortex-react';

const content = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Server-rendered article' }] },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Reader turns saved Tiptap JSON into HTML during server rendering.' }],
    },
    {
      type: 'blockquote',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'No browser editor instance is created.' }] }],
    },
  ],
});

export default function ReactEditorServerReader() {
  return <Reader content={content} />;
}
