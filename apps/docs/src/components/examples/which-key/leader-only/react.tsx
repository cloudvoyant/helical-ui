// apps/docs/src/components/examples/which-key/leader-only/react.tsx

// 1. Imports
import {
  Button,
  HStack,
  Pane,
  WhichKey,
  WhichKeyMode,
  WhichKeyProvider,
  useWhichKey,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const ITEMS = ['First Entry', 'Second Entry'];

// 3. Local helpers / inner components
function LeaderOnlyWorkspace() {
  // --- State ---
  const { leaderOnly, setLeaderOnly } = useWhichKey();

  // --- Render ---
  return (
    <Pane
      paneId="wk-leader-only-pane"
      paneTitle="Leader-Only Workspace"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <WhichKeyMode />
        <Button
          size="sm"
          variant={leaderOnly ? 'solid' : 'outline'}
          aria-pressed={leaderOnly}
          onClick={() => setLeaderOnly(!leaderOnly)}
        >
          {leaderOnly ? 'Popup: Leader only' : 'Popup: All prefixes'}
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
export default function ReactWhichKeyLeaderOnly() {
  // --- Render ---
  return (
    <WhichKeyProvider preset="helix" leaderOnly>
      <LeaderOnlyWorkspace />
      <WhichKey />
    </WhichKeyProvider>
  );
}
