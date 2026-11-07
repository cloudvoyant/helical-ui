// apps/docs/src/components/examples/which-key/default/react.tsx
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogDismiss,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HStack,
  Kbd,
  Pane,
  VStack,
  WhichKey,
  WhichKeyMode,
  WhichKeyProvider,
  useWhichKey,
} from '@cloudvoyant/helical-react';

function DefaultDemoSurface({
  lastAction,
  setLastAction,
}: {
  lastAction: string;
  setLastAction: (action: string) => void;
}) {
  const { preset, leaderOnly, setLeaderOnly, activePath, openPrefix, openExplorer } = useWhichKey();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Pane
      paneId="wk-default-pane"
      paneTitle="Workspace"
      data-testid="wk-default-surface"
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4"
    >
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-2">
          <WhichKeyMode data-testid="wk-default-mode" />
          <span className="text-xs text-muted-foreground">
            Preset: <strong className="text-foreground">{preset}</strong>
          </span>
          {activePath.length > 0 && (
            <span className="font-mono text-xs text-primary" data-testid="wk-default-prefix">
              {activePath.join(' » ')}
            </span>
          )}
        </HStack>
        <span className="text-xs text-muted-foreground" data-testid="wk-default-last-action">
          Last command: <strong className="text-foreground">{lastAction}</strong>
        </span>
      </HStack>

      <p className="text-xs text-muted-foreground">
        Click inside this workspace and press <Kbd size="sm">Space</Kbd> for the leader menu, <Kbd size="sm">g</Kbd> for
        Goto, <Kbd size="sm">z</Kbd> for View, or <Kbd size="sm" hotkey={['Space', '?']} /> to search all bindings.
      </p>

      <HStack className="flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          data-testid="wk-default-open-space"
          onClick={() => {
            setLastAction('Opened Space menu');
            openPrefix(['Space']);
          }}
        >
          Open <Kbd size="sm">Space</Kbd> Menu
        </Button>
        <Button
          size="sm"
          variant="outline"
          data-testid="wk-default-open-explorer"
          onClick={() => {
            setLastAction('Opened Explorer');
            openExplorer();
          }}
        >
          Explore <Kbd size="sm" hotkey={['Space', '?']} />
        </Button>

        <Button
          size="sm"
          variant={leaderOnly ? 'solid' : 'outline'}
          aria-pressed={leaderOnly}
          data-testid="wk-default-toggle-leader-only"
          onClick={() => setLeaderOnly(!leaderOnly)}
        >
          {leaderOnly ? 'Popup: Leader only' : 'Popup: All prefixes'}
        </Button>

        <Dialog open={dialogOpen} lazyMount unmountOnExit onOpenChange={(d) => setDialogOpen(d.open)}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" data-testid="wk-default-open-dialog">
              Open Modal Dialog
            </Button>
          </DialogTrigger>
          <DialogBackdrop />
          <DialogContent data-testid="wk-default-dialog">
            <DialogHeader>
              <DialogTitle>Nested Modal Layer</DialogTitle>
              <DialogDismiss />
            </DialogHeader>
            <DialogDescription>
              Press <Kbd size="sm">Space</Kbd> inside this dialog to open WhichKey, then press <Kbd size="sm">Esc</Kbd>.
              WhichKey closes first while keeping this dialog open.
            </DialogDescription>
            <HStack className="mt-3 gap-2">
              <Button size="sm" variant="outline" data-testid="wk-dialog-action-1">
                Dialog Action 1
              </Button>
              <Button size="sm" variant="outline" data-testid="wk-dialog-action-2">
                Dialog Action 2
              </Button>
            </HStack>
          </DialogContent>
        </Dialog>
      </HStack>
    </Pane>
  );
}

export default function ReactWhichKeyDefault() {
  const [lastAction, setLastAction] = useState('None');

  return (
    <WhichKeyProvider preset="helix" onCommand={(id) => setLastAction(id)}>
      <VStack className="w-full gap-3">
        <DefaultDemoSurface lastAction={lastAction} setLastAction={setLastAction} />
        <WhichKey />
      </VStack>
    </WhichKeyProvider>
  );
}
