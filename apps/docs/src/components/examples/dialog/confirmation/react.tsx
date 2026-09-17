// apps/docs/src/components/examples/dialog/confirmation/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogConfirmation() {
  const [dirty, setDirty] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Dialog
      </button>
      <Dialog
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        onEscapeKeyDown={(e) => {
          if (dirty) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (dirty) e.preventDefault();
        }}
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Unsaved changes</DialogTitle>
          <DialogDescription>You have unsaved changes that will be lost. Leave anyway?</DialogDescription>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1.5 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"
              onClick={() => {
                setDirty(false);
                setOpen(false);
              }}
            >
              Discard
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
