// apps/docs/src/components/examples/dialog/dialog-with-tooltip/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactDialogWithTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Open Dialog
          </button>
        </TooltipTrigger>
        <TooltipContent>Shows on hover over the trigger</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>Dialog with Tooltip</DialogTitle>
          <DialogDescription>The trigger also shows a tooltip on hover.</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
