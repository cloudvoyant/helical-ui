// apps/docs/src/components/examples/editor/mentions/react.tsx
// Minimal, no Prose wrapper — a chat-style input with @user mentions. The mention source is a
// static in-memory list, demonstrating the injected `mentionSource` seam.
import { Editor } from '@cloudvoyant/vortex-react';
import type { MentionItem } from '@cloudvoyant/vortex-ui';

const PEOPLE: MentionItem[] = [
  { id: '1', label: 'Ada Lovelace', type: 'user' },
  { id: '2', label: 'Alan Turing', type: 'user' },
  { id: '3', label: 'Grace Hopper', type: 'user' },
];

async function mentionSource(query: string): Promise<MentionItem[]> {
  const q = query.toLowerCase();
  return PEOPLE.filter((person) => person.label.toLowerCase().includes(q));
}

export default function ReactEditorMentions() {
  return (
    <div className="rounded-lg border border-input p-3">
      <Editor content="" enforceTitle={false} mentionSource={mentionSource} />
    </div>
  );
}
