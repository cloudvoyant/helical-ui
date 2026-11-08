// apps/docs/src/components/examples/which-key/forms/react.tsx

// 1. Imports
import { useState } from 'react';
import { HStack, Pane, VStack, WhichKey, WhichKeyMode, WhichKeyProvider } from '@cloudvoyant/helical-react';

// 4. Exported component
export default function ReactWhichKeyForms() {
  // --- State ---
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  // --- Render ---
  return (
    <WhichKeyProvider preset="helix">
      <Pane
        paneId="wk-forms-pane"
        paneTitle="Form Controls"
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      >
        <HStack className="justify-end">
          <WhichKeyMode />
        </HStack>

        <VStack className="items-stretch gap-2.5">
          <button
            type="button"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            1 · Focus Anchor Button
          </button>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="2 · Project name"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            placeholder="3 · Commit notes"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />

          <button
            type="button"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            4 · Submit Form
          </button>
        </VStack>
      </Pane>
      <WhichKey />
    </WhichKeyProvider>
  );
}
