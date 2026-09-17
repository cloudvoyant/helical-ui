// apps/docs/src/components/examples/tooltip/controlled/react.tsx
import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipControlled() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Tooltip open={open} onOpenChange={(e) => setOpen(e.open)}>
        <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Hover me
        </TooltipTrigger>
        <TooltipContent>Controlled tooltip</TooltipContent>
      </Tooltip>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
        Open
      </label>
    </div>
  );
}
