// apps/docs/src/components/examples/which-key/panes/react.tsx
import { Badge, HStack, Kbd, Pane, VStack, WhichKey, WhichKeyProvider, useWhichKey } from '@cloudvoyant/helical-react';

function PanesSurface() {
  const { activePaneId } = useWhichKey();

  return (
    <VStack className="w-full gap-3">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          Use <Kbd size="sm" hotkey={['Space', 'w', 'l']} /> / <Kbd size="sm" hotkey={['Space', 'w', 'h']} /> (or{' '}
          <Kbd size="sm" hotkey="Control+w" />
          ), <Kbd size="sm" hotkey={['Space', '1']} />–<Kbd size="sm">3</Kbd>, and <Kbd size="sm" hotkey="Control+o" />{' '}
          / <Kbd size="sm" hotkey="Control+i" /> Jumplist.
        </span>
        <Badge variant="subtle" color="primary">
          Active: {activePaneId ?? 'pane-nav'}
        </Badge>
      </HStack>

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
    </VStack>
  );
}

export default function ReactWhichKeyPanes() {
  return (
    <WhichKeyProvider preset="helix">
      <PanesSurface />
      <WhichKey />
    </WhichKeyProvider>
  );
}
