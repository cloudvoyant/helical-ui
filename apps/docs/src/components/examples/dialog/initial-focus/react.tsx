// apps/docs/src/components/examples/dialog/initial-focus/react.tsx
import { useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

export default function ReactDialogInitialFocus() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Dialog
      </button>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)} initialFocusEl={() => inputRef.current}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>The input below receives focus when the dialog opens.</DialogDescription>
          <input
            ref={inputRef}
            className="mt-2 h-9 rounded-md border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
            placeholder="Enter your name"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
