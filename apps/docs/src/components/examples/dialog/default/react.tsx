// apps/docs/src/components/examples/dialog/default/react.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogDismiss,
  DialogContent,
  DialogBackdrop,
} from '@cloudvoyant/helical-react';
import { X } from 'lucide-react';

export default function ReactDialogDefault() {
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
          <DialogDismiss>
            <X />
          </DialogDismiss>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
