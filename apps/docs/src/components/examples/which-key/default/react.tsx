// apps/docs/src/components/examples/which-key/default/react.tsx

// 1. Imports
import {
  Button,
  HStack,
  Kbd,
  Pane,
  WhichKey,
  WhichKeyMode,
  WhichKeyProvider,
  useWhichKey,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const ITEMS = ['Workspace File A', 'Workspace File B'];

// 3. Local helpers / inner components
function DefaultWorkspace() {
  // --- State ---
  const { openPrefix } = useWhichKey();

  // --- Render ---
  return (
    <Pane
      paneId="wk-default-pane"
      paneTitle="Workspace"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <WhichKeyMode showPreset />
        <Button size="sm" variant="outline" onClick={() => openPrefix(['Space'])}>
          Open <Kbd size="sm" hotkey="Space" /> Menu
        </Button>
      </HStack>

      <HStack className="flex-wrap gap-2">
        {ITEMS.map((label) => (
          <button
            key={label}
            type="button"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            {label}
          </button>
        ))}
      </HStack>
    </Pane>
  );
}

// 4. Exported component
export default function ReactWhichKeyDefault() {
  // --- Render ---
  return (
    <WhichKeyProvider preset="helix">
      <DefaultWorkspace />
      <WhichKey />
    </WhichKeyProvider>
  );
}
