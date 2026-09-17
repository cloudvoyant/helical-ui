// apps/docs/src/components/examples/dialog/nested/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogNested() {
  const [open, setOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Dialog
      </button>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Outer Dialog</DialogTitle>
          <DialogDescription>Dialogs can be nested inside one another.</DialogDescription>
          <button
            type="button"
            onClick={() => setNestedOpen(true)}
            className="mt-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
          >
            Open Nested Dialog
          </button>
        </DialogContent>
      </Dialog>
      <Dialog open={nestedOpen} onOpenChange={(e) => setNestedOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Inner Dialog</DialogTitle>
          <DialogDescription>This dialog sits on top of the outer one.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
