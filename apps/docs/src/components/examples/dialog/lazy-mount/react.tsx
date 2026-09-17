// apps/docs/src/components/examples/dialog/lazy-mount/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogLazyMount() {
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
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)} lazyMount unmountOnExit>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Lazy Mounted</DialogTitle>
          <DialogDescription>This dialog mounts only when first opened and unmounts when closed.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
