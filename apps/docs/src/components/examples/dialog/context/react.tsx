// apps/docs/src/components/examples/dialog/context/react.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogBackdrop,
  useDialogContext,
} from '@cloudvoyant/helical-react';

function DialogStatus() {
  const dialog = useDialogContext();
  return <p className="text-sm text-muted-foreground">Dialog is {dialog.open ? 'open' : 'closed'}</p>;
}

export default function ReactDialogContext() {
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
        <DialogStatus />
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Context</DialogTitle>
          <DialogDescription>The open state above is read via useDialogContext.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
