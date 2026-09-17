// apps/docs/src/components/examples/dialog/root-provider/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogRootProvider() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">Dialog is {open ? 'open' : 'closed'}</p>
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
          <DialogTitle>Controlled Externally</DialogTitle>
          <DialogDescription>This dialog is controlled from a plain button outside.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
