// apps/docs/src/components/examples/dialog/controlled/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogControlled() {
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
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
          <DialogDescription>This dialog is fully controlled by the checkbox.</DialogDescription>
        </DialogContent>
      </Dialog>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
        Open
      </label>
    </div>
  );
}
