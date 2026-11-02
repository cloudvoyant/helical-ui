// apps/docs/src/components/examples/which-key/jump-labels/react.tsx
import { useState } from 'react';
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
  type JumpAction,
} from '@cloudvoyant/helical-react';

const JUMP_ITEMS = ['Deploy Service', 'Run Migrations', 'Inspect Logs', 'Rotate Keys'];

function JumpLabelsSurface({
  jumpAction,
  onToggleJumpAction,
}: {
  jumpAction: JumpAction;
  onToggleJumpAction: (next: JumpAction) => void;
}) {
  const { startJumpMode, setJumpAction } = useWhichKey();
  const [activatedItem, setActivatedItem] = useState('None');
  const [focusedItem, setFocusedItem] = useState('None');

  return (
    <Pane
      paneId="wk-jump-pane"
      paneTitle="Jump Targets"
      data-testid="wk-jump-surface"
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-1.5">
          <Button
            size="sm"
            variant={jumpAction === 'focus' ? 'solid' : 'outline'}
            data-testid="wk-jump-mode-focus"
            onClick={() => {
              setJumpAction('focus');
              onToggleJumpAction('focus');
            }}
          >
            jumpAction: focus
          </Button>
          <Button
            size="sm"
            variant={jumpAction === 'activate' ? 'solid' : 'outline'}
            data-testid="wk-jump-mode-activate"
            onClick={() => {
              setJumpAction('activate');
              onToggleJumpAction('activate');
            }}
          >
            jumpAction: activate
          </Button>
          <Button size="sm" variant="outline" data-testid="wk-jump-trigger" onClick={() => startJumpMode()}>
            Trigger Jump (<Kbd size="sm" hotkey={['g', 'w']} />)
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

export default function ReactWhichKeyJumpLabels() {
  const [jumpAction, setJumpAction] = useState<JumpAction>('focus');

  return (
    <WhichKeyProvider preset="helix" jumpAction={jumpAction}>
      <VStack className="w-full gap-3">
        <JumpLabelsSurface jumpAction={jumpAction} onToggleJumpAction={setJumpAction} />
        <WhichKey />
      </VStack>
    </WhichKeyProvider>
  );
}
