// apps/docs/src/components/examples/dialog/open-from-menu/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogOpenFromMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
        onClick={() => setOpen(true)}
      >
        Open dialog from a menu item
      </button>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Opened Externally</DialogTitle>
          <DialogDescription>
            This dialog was opened by setting state from a plain button, no trigger needed.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
