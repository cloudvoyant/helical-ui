// apps/docs/src/components/examples/which-key/jump-labels/react.tsx

// 1. Imports
import { useState } from 'react';
import {
  Badge,
  Button,
  HStack,
  Kbd,
  Pane,
  ToggleGroup,
  ToggleGroupItem,
  VStack,
  WhichKey,
  WhichKeyProvider,
  useWhichKey,
  type JumpAction,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const JUMP_ITEMS = ['Deploy Service', 'Run Migrations', 'Inspect Logs', 'Rotate Keys'];

// 3. Local helpers / inner components
function JumpLabelsSurface({
  jumpAction,
  onToggleJumpAction,
}: {
  jumpAction: JumpAction;
  onToggleJumpAction: (next: JumpAction) => void;
}) {
  // --- State ---
  const { startJumpMode, setJumpAction } = useWhichKey();
  const [activatedItem, setActivatedItem] = useState('None');
  const [focusedItem, setFocusedItem] = useState('None');

  // --- Render ---
  return (
    <Pane
      paneId="wk-jump-pane"
      paneTitle="Jump Targets"
      data-testid="wk-jump-surface"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-2">
          <ToggleGroup
            attached
            value={[jumpAction]}
            onValueChange={(d) => {
              const next = d.value[0] as JumpAction | undefined;
              if (!next) return;
              setJumpAction(next);
              onToggleJumpAction(next);
            }}
            aria-label="Jump action mode"
          >
            <ToggleGroupItem value="focus" size="sm" variant="outline" data-testid="wk-jump-mode-focus">
              jumpAction: focus
            </ToggleGroupItem>
            <ToggleGroupItem value="activate" size="sm" variant="outline" data-testid="wk-jump-mode-activate">
              jumpAction: activate
            </ToggleGroupItem>
          </ToggleGroup>
          <Button size="sm" variant="outline" data-testid="wk-jump-trigger" onClick={() => startJumpMode()}>
            Trigger Jump (<Kbd size="sm" hotkey="g w" />)
          </Button>
        </HStack>

        <HStack className="items-center gap-2 text-xs">
          <span>
            Focused: <strong data-testid="wk-jump-focused">{focusedItem}</strong>
          </span>
          <Badge variant="subtle" color="primary">
            Activated: <strong data-testid="wk-jump-activated">{activatedItem}</strong>
          </Badge>
        </HStack>
      </HStack>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {JUMP_ITEMS.map((item, idx) => (
          <button
            key={item}
            type="button"
            data-testid={`wk-jump-target-${idx}`}
            onFocus={() => setFocusedItem(item)}
            onClick={() => setActivatedItem(item)}
            className="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            {item}
          </button>
        ))}
      </div>
    </Pane>
  );
}

// 4. Exported component
export default function ReactWhichKeyJumpLabels() {
  // --- State ---
  const [jumpAction, setJumpAction] = useState<JumpAction>('focus');

  // --- Render ---
  return (
    <WhichKeyProvider preset="helix" jumpAction={jumpAction}>
      <VStack className="w-full gap-3">
        <JumpLabelsSurface jumpAction={jumpAction} onToggleJumpAction={setJumpAction} />
        <WhichKey />
      </VStack>
    </WhichKeyProvider>
  );
}
