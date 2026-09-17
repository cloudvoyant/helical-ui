// apps/docs/src/components/examples/dialog/outside-scroll/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogOutsideScroll() {
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
        <DialogContent positionerClassName="overflow-y-auto">
          <DialogTitle>Extends Beyond Viewport</DialogTitle>
          <DialogDescription>The positioner scrolls so the dialog can exceed the viewport height.</DialogDescription>
          <div className="text-sm text-muted-foreground">
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i} className="mb-2">
                Section {i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
