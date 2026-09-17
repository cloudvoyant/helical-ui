// apps/docs/src/components/examples/dialog/inside-scroll/react.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogBackdrop,
} from '@cloudvoyant/helical-react';
import { Scroll } from '@cloudvoyant/helical-react';

export default function ReactDialogInsideScroll() {
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
        <DialogContent className="flex max-h-[420px] flex-col gap-0 overflow-hidden p-0">
          <DialogHeader sticky className="px-6 pt-6 pb-4">
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>Scroll inside the dialog while the header and footer stay put.</DialogDescription>
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
          <DialogFooter sticky className="px-6 py-4">
            <button
              type="button"
              className="rounded-md border px-3 py-1.5 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Decline
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Accept
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
