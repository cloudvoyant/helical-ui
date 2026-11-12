// apps/docs/src/components/examples/which-key/modal-interaction/react.tsx

// 1. Imports
import { useState } from 'react';
import {
  Button,
  CommandMenu,
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDismiss,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HStack,
  Pane,
  WhichKey,
  WhichKeyProvider,
  type CommandNode,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const MODAL_COMMANDS: CommandNode[] = [
  {
    value: 'open-dialog',
    label: 'Open Modal Dialog',
    command: 'open-dialog',
  },
];

// 4. Exported component
export default function ReactWhichKeyModalInteraction() {
  // --- State ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Render ---
  return (
    <WhichKeyProvider preset="helix">
      <Pane
        paneId="wk-modal-pane"
        paneTitle="Modal Interaction"
        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-4"
      >
        <Dialog open={dialogOpen} onOpenChange={({ open }) => setDialogOpen(open)} lazyMount unmountOnExit>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Open Modal Dialog
            </Button>
          </DialogTrigger>
          <DialogBackdrop />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nested Modal Layer</DialogTitle>
              <DialogDismiss />
            </DialogHeader>
            <HStack className="mt-3 gap-2">
              <Button size="sm" variant="outline">
                Dialog Action 1
              </Button>
              <Button size="sm" variant="outline">
                Dialog Action 2
              </Button>
            </HStack>
          </DialogContent>
        </Dialog>
        <Button size="sm" variant="outline" onClick={() => setMenuOpen(true)}>
          Run Command
        </Button>
      </Pane>
      <CommandMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        hotkey={false}
        items={MODAL_COMMANDS}
        onSelectCommand={({ value }) => {
          if (value === 'open-dialog') {
            setDialogOpen(true);
          }
        }}
      />
      <WhichKey />
    </WhichKeyProvider>
  );
}
