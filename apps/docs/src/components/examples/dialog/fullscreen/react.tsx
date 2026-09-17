// apps/docs/src/components/examples/dialog/fullscreen/react.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogDismiss,
  DialogContent,
  DialogBackdrop,
} from '@cloudvoyant/helical-react';
import { Scroll } from '@cloudvoyant/helical-react';
import { X } from 'lucide-react';

export default function ReactDialogFullscreen() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Fullscreen
      </button>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent fullscreen className="flex flex-col gap-0">
          <DialogHeader sticky className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle>Fullscreen</DialogTitle>
              <DialogDismiss>
                <X />
              </DialogDismiss>
            </div>
            <DialogDescription>This dialog fills the whole viewport, edge to edge.</DialogDescription>
          </DialogHeader>
          <Scroll className="min-h-0 flex-1">
            <div className="p-6 text-sm text-muted-foreground">
              {Array.from({ length: 40 }, (_, i) => (
                <p key={i} className="mb-2">
                  Clause {i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              ))}
            </div>
          </Scroll>
          <DialogFooter sticky className="border-t px-6 py-4">
            <button
              type="button"
              className="rounded-md border px-3 py-1.5 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
