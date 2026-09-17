// apps/docs/src/components/examples/dialog/non-modal/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent } from '@cloudvoyant/helical-react';

export default function ReactDialogNonModal() {
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
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)} modal={false}>
        <DialogContent>
          <DialogTitle>Non-Modal Dialog</DialogTitle>
          <DialogDescription>You can interact with the page behind this dialog.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
