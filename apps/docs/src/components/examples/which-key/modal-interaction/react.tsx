// apps/docs/src/components/examples/which-key/modal-interaction/react.tsx

// 1. Imports
import {
  Button,
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
} from '@cloudvoyant/helical-react';

// 4. Exported component
export default function ReactWhichKeyModalInteraction() {
  // --- Render ---
  return (
    <WhichKeyProvider preset="helix">
      <Pane
        paneId="wk-modal-pane"
        paneTitle="Modal Interaction"
        className="flex items-center justify-center rounded-lg border border-border bg-card p-4"
      >
        <Dialog lazyMount unmountOnExit>
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
      </Pane>
      <WhichKey />
    </WhichKeyProvider>
  );
}
