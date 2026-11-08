// apps/docs/src/components/examples/which-key/panes/react.tsx

// 1. Imports
import { Pane, WhichKey, WhichKeyProvider } from '@cloudvoyant/helical-react';

// 2. Module constants & types
const PANES_DEMO_KEYMAP = {
  Space: {
    key: 'Space',
    label: 'Leader',
    children: {
      '1': { key: '1', label: 'Focus Pane 1', commandId: 'pane.focus.1' },
      '2': { key: '2', label: 'Focus Pane 2', commandId: 'pane.focus.2' },
      '3': { key: '3', label: 'Focus Pane 3', commandId: 'pane.focus.3' },
    },
  },
};

// 4. Exported component
export default function ReactWhichKeyPanes() {
  // --- Render ---
  return (
    <WhichKeyProvider preset="helix" keymap={PANES_DEMO_KEYMAP}>
      <div className="grid grid-cols-3 gap-3">
        <Pane
          paneId="pane-nav"
          paneTitle="Explorer"
          paneOrder={1}
          className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <span className="text-xs font-semibold text-muted-foreground">1 · Explorer</span>
          <button
            type="button"
            className="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            src/index.ts
          </button>
          <button
            type="button"
            className="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            src/controller.ts
          </button>
        </Pane>

        <Pane
          paneId="pane-editor"
          paneTitle="Editor"
          paneOrder={2}
          className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <span className="text-xs font-semibold text-muted-foreground">2 · Editor</span>
          <button
            type="button"
            className="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Buffer Tab A
          </button>
          <button
            type="button"
            className="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Buffer Tab B
          </button>
        </Pane>

        <Pane
          paneId="pane-inspector"
          paneTitle="Inspector"
          paneOrder={3}
          className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <span className="text-xs font-semibold text-muted-foreground">3 · Inspector</span>
          <button
            type="button"
            className="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            AST Symbols
          </button>
          <button
            type="button"
            className="rounded border border-border bg-background px-2.5 py-1.5 text-left text-xs focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Diagnostics
          </button>
        </Pane>
      </div>
      <WhichKey />
    </WhichKeyProvider>
  );
}
