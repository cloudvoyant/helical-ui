// apps/docs/src/components/examples/which-key/explorer/react.tsx

// 1. Imports
import {
  Button,
  Kbd,
  Pane,
  WhichKey,
  WhichKeyProvider,
  useWhichKey,
  type WhichKeyNode,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const CUSTOM_KEYMAP: Record<string, WhichKeyNode> = {
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
};

// 3. Local helpers / inner components
function ExplorerSurface() {
  // --- State ---
  const { openExplorer } = useWhichKey();

  // --- Render ---
  return (
    <Pane
      paneId="wk-explorer-pane"
      paneTitle="Explorer Demo"
      className="flex items-center justify-center rounded-lg border border-border bg-card p-4"
    >
      <Button size="sm" variant="outline" onClick={() => openExplorer()}>
        Open Explorer <Kbd size="sm" hotkey="?" />
      </Button>
    </Pane>
  );
}

// 4. Exported component
export default function ReactWhichKeyExplorer() {
  // --- Render ---
  return (
    <WhichKeyProvider preset="helix" keymap={CUSTOM_KEYMAP}>
      <ExplorerSurface />
      <WhichKey />
    </WhichKeyProvider>
  );
}
