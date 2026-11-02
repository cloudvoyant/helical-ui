// apps/docs/src/components/examples/which-key/forms/react.tsx
import { useState } from 'react';
import { Badge, HStack, Kbd, Pane, VStack, WhichKey, WhichKeyProvider, useWhichKey } from '@cloudvoyant/helical-react';

function FormsSurface() {
  const { mode } = useWhichKey();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <Pane
      paneId="wk-forms-pane"
      paneTitle="Form Controls"
      data-testid="wk-forms-surface"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          Press <Kbd size="sm">j</Kbd> / <Kbd size="sm">k</Kbd> in <strong>normal</strong> mode to step across inputs
          without typing. Press <Kbd size="sm">i</Kbd> or <Kbd size="sm">Enter</Kbd> to enter <strong>insert</strong>{' '}
          mode, and <Kbd size="sm">Esc</Kbd> to return to <strong>normal</strong> mode.
        </span>
        <Badge variant="subtle" color={mode === 'insert' ? 'success' : 'primary'} data-testid="wk-forms-mode">
          {mode.toUpperCase()}
        </Badge>
      </HStack>

      <VStack className="items-stretch gap-2.5">
        <button
          type="button"
          data-testid="wk-form-btn-start"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        >
          1 · Focus Anchor Button
        </button>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="2 · Project name (focus via j, then press i to type)"
          data-testid="wk-form-input-name"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />

        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          placeholder="3 · Commit notes"
          data-testid="wk-form-input-notes"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />

        <button
          type="button"
          data-testid="wk-form-btn-submit"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-left text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        >
          4 · Submit Form
        </button>
      </VStack>
    </Pane>
  );
}

export default function ReactWhichKeyForms() {
  return (
    <WhichKeyProvider preset="helix">
      <FormsSurface />
      <WhichKey />
    </WhichKeyProvider>
  );
}
