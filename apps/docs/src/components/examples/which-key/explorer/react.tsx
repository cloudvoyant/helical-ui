// apps/docs/src/components/examples/which-key/explorer/react.tsx
import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  HStack,
  Kbd,
  Pane,
  VStack,
  WhichKey,
  WhichKeyProvider,
  useWhichKey,
  type KeymapHandler,
  type WhichKeyNode,
} from '@cloudvoyant/helical-react';

function ExplorerSurface({ lastExecuted }: { lastExecuted: string }) {
  const { openExplorer } = useWhichKey();

  return (
    <Pane
      paneId="wk-explorer-pane"
      paneTitle="Explorer Demo"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Executed Command:</span>
          <Badge variant="subtle" color="primary">
            {lastExecuted}
          </Badge>
        </HStack>
        <Button size="sm" variant="outline" onClick={() => openExplorer()}>
          Open Explorer <Kbd size="sm">?</Kbd>
        </Button>
      </HStack>
      <p className="text-xs text-muted-foreground">
        Press <Kbd size="sm" hotkey="?" /> or <Kbd size="sm" hotkey={['Space', '?']} /> (or click the button) to open
        the searchable Keybinding Exploration Menu, filter by keyword, and press <Kbd size="sm">Enter</Kbd> to run a
        command.
      </p>
    </Pane>
  );
}

export default function ReactWhichKeyExplorer() {
  const [lastExecuted, setLastExecuted] = useState('none');

  const customKeymap = useMemo<Record<string, WhichKeyNode>>(
    () => ({
      Space: {
        key: 'Space',
        label: 'Leader',
        group: 'Leader',
        children: {
          p: {
            key: 'p',
            label: 'Format Document',
            description: 'Prettify and format the active buffer',
            group: 'Document',
            commandId: 'demo.formatDocument',
          },
          s: {
            key: 's',
            label: 'Sync Workspace',
            description: 'Synchronize workspace state with remote',
            group: 'Workspace',
            commandId: 'demo.syncWorkspace',
          },
        },
      },
    }),
    [],
  );

  const commands = useMemo<Record<string, KeymapHandler>>(
    () => ({
      'demo.formatDocument': () => {
        setLastExecuted('demo.formatDocument');
      },
      'demo.syncWorkspace': () => {
        setLastExecuted('demo.syncWorkspace');
      },
    }),
    [],
  );

  return (
    <WhichKeyProvider
      preset="helix"
      keymap={customKeymap}
      commands={commands}
      onCommand={(cmdId) => setLastExecuted(cmdId)}
    >
      <VStack className="w-full gap-3">
        <ExplorerSurface lastExecuted={lastExecuted} />
        <WhichKey />
      </VStack>
    </WhichKeyProvider>
  );
}
