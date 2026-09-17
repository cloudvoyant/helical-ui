// apps/docs/src/components/examples/dialog/final-focus/react.tsx
import { useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogFinalFocus() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Dialog
      </button>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)} finalFocusEl={() => buttonRef.current}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Final Focus</DialogTitle>
          <DialogDescription>Focus returns to the outlined button when this dialog closes.</DialogDescription>
        </DialogContent>
      </Dialog>
      <button ref={buttonRef} type="button" className="rounded-md border px-3 py-1.5 text-sm font-medium">
        Receive focus on close
      </button>
    </div>
  );
}
